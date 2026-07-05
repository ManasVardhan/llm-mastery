# Train an LLM From Scratch: The 0 to 100 Curriculum

The syllabus you would hand a strong grad student who wants to go from zero to building and understanding a full LLM training stack. It is organized as a progression. Each module has the *why*, the canonical papers, hands-on resources, and the **lexicon** (the words researchers actually use in Slack and in paper reviews). Read in order, but the lexicon sections you can skim ahead for vocabulary.

---

## Module 0: Orientation and Mental Model

Before any math, internalize the pipeline. Every LLM is: **tokenize, pretrain (next-token prediction), mid-train, post-train (SFT + RLHF/RLVR), align, evaluate, serve**. Everything else is detail hanging off this skeleton.

**Do this first (single best 0-100 hands-on artifact):**
- **Karpathy's [nanochat](https://github.com/karpathy/nanochat)**: 8K lines, the entire stack (tokenizer, pretrain, SFT, RL, eval, web UI) for about $100 on an 8xH100 node. This is *the* reference implementation to read end to end. Clone it, read every file, run the speedrun.
- Karpathy's **[Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html)** YouTube series, especially "Let's build GPT" and "Let's build the GPT Tokenizer." Watch with the code open.
- **[nanollama](https://github.com/karpathy/nanochat/discussions/557)**: 2026 spinoff, raw text to Llama 3 to GGUF in one command. Good for seeing a modern Llama-style stack.

**Lexicon:** autoregressive, causal LM, next-token prediction, teacher forcing, cross-entropy loss, perplexity (ppl = exp(loss)), bits-per-byte (BPB), token, context length, base model vs instruct model, foundation model, pretraining vs post-training.

---

## Module 1: Tokenization (the part everyone underrates)

Tokenization silently determines your model's math ability, multilingual fairness, and effective context. "Normal people" skip this. Do not.

**Read/watch:**
- Karpathy, "Let's build the GPT Tokenizer" (video plus the `minbpe` repo).
- Sennrich et al., BPE for NMT (2016), the original subword idea: [arxiv 1508.07909](https://arxiv.org/abs/1508.07909).
- SentencePiece (Kudo and Richardson, 2018): [arxiv 1808.06226](https://arxiv.org/abs/1808.06226), and the Unigram LM tokenizer (Kudo 2018) which is *different* from BPE and used by T5/Gemma.
- HuggingFace [tokenizers](https://github.com/huggingface/tokenizers) library docs.

**Tit-bits that bite people:**
- **Byte-level BPE (BBPE)** vs char-level: modern models (GPT, Qwen with about 151K vocab) work over UTF-8 bytes so nothing is ever OOV.
- **Pretokenization regex** (the GPT-2/GPT-4 split pattern) controls whether numbers, contractions, and whitespace merge sanely. Get this wrong and arithmetic dies.
- **Digit tokenization**: left-to-right vs right-to-left digit grouping massively affects arithmetic. Llama 3 splits digits individually.
- **Glitch tokens / unreachable tokens** (SolidGoldMagikarp): tokens in vocab but almost never in training data cause bizarre behavior.
- **Fertility** (tokens per word): high fertility on a language means that language is effectively taxed on context and cost.
- **Vocabulary size tradeoff**: bigger vocab means shorter sequences but fatter embedding/softmax matrices and rarer tokens undertrained.

**Lexicon:** subword, merge rules, vocab, BPE/BBPE, WordPiece, Unigram LM, SentencePiece, pretokenizer, fertility, OOV, special tokens (bos, eos, pad), chat template, tokenizer-free / byte-latent (see BLT, Meta 2024).

---

## Module 2: The Transformer, Modern Edition

The 2017 vanilla Transformer is *not* what people train now. Learn the modern stack directly.

**Foundational:**
- Vaswani et al., "Attention Is All You Need" (2017): [arxiv 1706.03762](https://arxiv.org/abs/1706.03762).
- The Illustrated Transformer (Jay Alammar) and The Annotated Transformer (Harvard) for intuition plus line-by-line code.
- Jun Yu Tan, ["The Crystallization of Transformer Architectures (2017-2025)"](https://jytan.net/blog/2025/transformer-architectures/): excellent survey of what converged and why.

**The modern default stack (memorize these five):**
1. **Pre-norm + RMSNorm**: Zhang and Sennrich (2019): [arxiv 1910.07467](https://arxiv.org/abs/1910.07467). Why pre-norm: gradient stability at depth (see "On Layer Normalization in the Transformer Architecture").
2. **RoPE (Rotary Position Embeddings)**: Su et al.: [arxiv 2104.09864](https://arxiv.org/abs/2104.09864). Understand *why* rotation encodes relative position and enables NTK-aware / YaRN context extension ([YaRN, arxiv 2309.00071](https://arxiv.org/abs/2309.00071)).
3. **SwiGLU** feed-forward: Shazeer, "GLU Variants Improve Transformer": [arxiv 2002.05202](https://arxiv.org/abs/2002.05202). Note the 2/3 hidden-dim trick to keep params matched.
4. **GQA (Grouped-Query Attention)**: Ainslie et al.: [arxiv 2305.13245](https://arxiv.org/abs/2305.13245), generalizing MQA (Shazeer 2019). This is a KV-cache memory play, critical for inference.
5. **Bias-free linear layers plus untied or tied embeddings**: small but standard.

**Attention efficiency (the systems half):**
- **FlashAttention** (Dao et al. 2022): [arxiv 2205.14135](https://arxiv.org/abs/2205.14135), FlashAttention-2 (2023), FlashAttention-3 (2024, Hopper/FP8). IO-awareness is the key idea: it is about HBM to SRAM traffic, not FLOPs.
- **KV cache**, PagedAttention (vLLM), sliding-window attention (Mistral), attention sinks / StreamingLLM.

**Lexicon:** pre-norm/post-norm, residual stream, attention head, query/key/value, softmax attention, causal mask, RoPE, ALiBi, NoPE, positional interpolation, YaRN, KV cache, MHA/MQA/GQA/MLA (DeepSeek's Multi-head Latent Attention), FlashAttention, IO-aware, SRAM/HBM, tied embeddings, logit, unembedding, weight tying, QK-norm, logit soft-capping (Gemma 2).

---

## Module 3: Training Dynamics, Optimization and Init

Where models go to die (loss spikes) and how people keep them alive.

**Read:**
- AdamW (Loshchilov and Hutter): [arxiv 1711.05101](https://arxiv.org/abs/1711.05101), decoupled weight decay, still the default.
- muP / muTransfer (Yang et al., "Tensor Programs V"): [arxiv 2203.03466](https://arxiv.org/abs/2203.03466), tune hyperparameters on a tiny model, transfer to the big one. This is a genuine tit-bit normal people miss and is used by real labs. Follow-up: muP for the modern stack and CompleteP.
- Cosine LR schedule plus linear warmup, and why WSD (Warmup-Stable-Decay) schedules (from MiniCPM) are eating cosine's lunch for continued/scalable training.
- Gradient clipping, z-loss (softmax stabilizer), loss spikes and mitigation (embedding LR scaling, skipping batches, spike-free init).
- Newer optimizers to know: Lion (Chen et al. 2023), Sophia, Adam-mini, Muon (2024/25, used in several 2025 speedruns and Kimi, worth real attention), Shampoo/SOAP (second-order).
- Mixed precision: bf16 vs fp16 (bf16 won for training), fp8 training (Hopper), loss scaling, master weights.

**Tit-bits:** the learning-rate vs batch-size debate (linear vs square-root scaling); critical batch size (McCandlish et al., "An Empirical Model of Large-Batch Training"); warmup length matters more than people think; weight decay interacts with the LR schedule; Adam's epsilon and beta2 tuning for stability; QK-norm and z-loss are cheap insurance against spikes.

**Lexicon:** AdamW, weight decay, warmup, cosine/WSD/trapezoidal schedule, LR annealing, gradient clipping, grad norm, loss spike, divergence, z-loss, muP/muTransfer, coordinate check, critical batch size, gradient accumulation, EMA of weights, bf16/fp8, loss scaling, optimizer states (2x or 3x model size in memory).

---

## Module 4: Scaling Laws and Compute-Optimality

This is the intellectual core. It is how labs *decide* how big a model to train and on how much data.

**Read in this order:**
- Kaplan et al., "Scaling Laws for Neural Language Models" (2020): [arxiv 2001.08361](https://arxiv.org/abs/2001.08361), the original power laws.
- Hoffmann et al., Chinchilla ("Training Compute-Optimal LLMs", 2022): [arxiv 2203.15556](https://arxiv.org/abs/2203.15556), the about 20 tokens/param rule. This corrected Kaplan. Read [the plain-English explainer](https://lifearchitect.ai/chinchilla/) if you want intuition first.
- "Beyond Chinchilla-Optimal" (Sardana et al. 2023/25): folds inference cost into the objective, which is why real deployed models are *over-trained* (smaller than Chinchilla-optimal, trained on far more tokens). This is why LFM2.5-350M hit an 80,000:1 token-to-param ratio.
- **C is about 6ND**: memorize this. Compute is about 6 x params x tokens. It is your back-of-envelope for every training run's cost.
- Data-constrained scaling: Muennighoff et al., "Scaling Data-Constrained Language Models" (2023): [arxiv 2305.16264](https://arxiv.org/abs/2305.16264), how many epochs before repeating data stops helping (about 4 epochs is roughly fresh data, then diminishing).

**Tit-bits:** the Kaplan-vs-Chinchilla discrepancy was partly a warmup/LR-schedule artifact, a famous lesson in how easy it is to draw wrong scaling conclusions from under-tuned baselines. Also: isoFLOP curves, the irreducible loss term (E) in L = E + A/N^alpha + B/D^beta, and emergence vs smooth scaling (Wei's "Emergent Abilities" vs Schaeffer's "Are Emergent Abilities a Mirage?", the metric-choice critique).

**Lexicon:** power law, compute-optimal, isoFLOP, 6ND, tokens-per-parameter, over-training, irreducible loss, scaling exponent, emergent abilities, grokking, double descent, chinchilla-optimal, inference-adjusted scaling.

---

## Module 5: Data: Curation, Dedup, Mixtures (the real moat)

Frontier quality is 80% data. This is the least-glamorous and most-important module.

**Read:**
- The Pile (2020), RefinedWeb ([arxiv 2306.01116](https://arxiv.org/abs/2306.01116), "web data alone, filtered well, beats curated corpora"), Dolma, FineWeb and FineWeb-Edu (HuggingFace 2024, read the [FineWeb blog](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1), it is a full data-engineering masterclass).
- Deduplication: "Deduplicating Training Data Makes LMs Better" (Lee et al. 2021), MinHash / LSH, exact vs fuzzy, doc vs substring dedup.
- Quality filtering: classifier-based (fastText, "does this look like a reference doc"), perplexity filtering, DSIR (importance resampling), DoReMi ([arxiv 2305.10429](https://arxiv.org/abs/2305.10429), learn domain *mixture weights* with a small proxy model).
- Synthetic and rephrased data: "Rephrasing the Web (WRAP)" ([arxiv 2401.16380](https://arxiv.org/abs/2401.16380)), the Phi / textbooks-are-all-you-need line (Gunasekar et al.), Cosmopedia.
- Decontamination against eval sets (n-gram overlap): skipping this equals inflated benchmarks and a retracted result.

**Tit-bits:** data mixture weights (how much code/web/math/multilingual) are a top-tier lever; curriculum / data ordering and annealing on high-quality data at the end of pretraining (the mid-training or cooldown/anneal phase, huge in 2024-2026, most tutorials miss it entirely); upsampling code improves reasoning even for non-code tasks; PII removal, toxicity filtering, license/copyright; tokenization of math/code affects data value.

**Lexicon:** corpus, dedup (MinHash/LSH/suffix-array), quality classifier, perplexity filter, DSIR, DoReMi, data mixture, domain weights, upsampling, decontamination, n-gram overlap, synthetic data, distillation data, annealing/cooldown/mid-training, curriculum learning, replay, catastrophic forgetting, data provenance, token budget.

---

## Module 6: Distributed Training and Systems

To actually train at scale you must understand parallelism and the memory wall.

**Read:**
- Megatron-LM (Shoeybi et al. 2019): [arxiv 1909.08053](https://arxiv.org/abs/1909.08053), tensor parallelism.
- ZeRO / DeepSpeed (Rajbhandari et al.): [arxiv 1910.02054](https://arxiv.org/abs/1910.02054), stages 1/2/3, sharding optimizer/grad/params. FSDP is the PyTorch-native equivalent.
- GPipe / PipeDream: pipeline parallelism, bubbles, 1F1B scheduling.
- Sequence / context parallelism (Ring Attention: [arxiv 2310.01889](https://arxiv.org/abs/2310.01889)) for long context.
- The Ultra-Scale Playbook (HuggingFace 2025) and "How to Scale Your Model" (JAX/Google): both are outstanding modern systems reads.
- Activation checkpointing (recompute vs store), CPU/NVMe offload, overlap of compute and communication, NCCL/all-reduce, communication collectives.
- Hardware fluency: HBM bandwidth, arithmetic intensity, the roofline model, MFU (Model FLOPs Utilization), the single number labs quote for training efficiency. Aim for 40-55% MFU.

**Lexicon:** DP/TP/PP/EP/SP/CP (data/tensor/pipeline/expert/sequence/context parallel), 3D/4D parallelism, ZeRO-1/2/3, FSDP, sharding, all-reduce/all-gather/reduce-scatter, NCCL, pipeline bubble, 1F1B, micro-batch, activation checkpointing/rematerialization, offloading, MFU/HFU, arithmetic intensity, roofline, interconnect (NVLink/InfiniBand), gradient/optimizer sharding.

---

## Module 7: Mixture-of-Experts (near-mandatory in 2026)

Every frontier model (DeepSeek-V3, Mixtral, Qwen3, Llama 4, GPT-oss) is MoE now. Learn it.

**Read:**
- Switch Transformer (Fedus et al. 2021): [arxiv 2101.03961](https://arxiv.org/abs/2101.03961) and GShard.
- Mixtral of Experts (2024): [arxiv 2401.04088](https://arxiv.org/abs/2401.04088).
- DeepSeek-V3 / DeepSeekMoE ([arxiv 2412.19437](https://arxiv.org/abs/2412.19437)): fine-grained plus shared experts, auxiliary-loss-free load balancing, MLA, FP8 training. This is the most important single technical report of the era. Read it twice.

**Tit-bits:** top-k routing, load-balancing loss vs aux-loss-free (bias-adjusted) balancing, expert collapse, router z-loss, capacity factor and token dropping, active vs total params (why a 671B MoE runs like an about 37B dense model), expert parallelism communication cost, upcycling dense to MoE.

**Lexicon:** sparse MoE, router/gating, top-k, active params, shared/fine-grained experts, load balancing, capacity factor, token dropping, expert parallel, upcycling, dense-vs-sparse.

---

## Module 8: Post-Training I: SFT and Instruction Tuning

Base model to helpful assistant.

**Read:**
- InstructGPT (Ouyang et al. 2022): [arxiv 2203.02155](https://arxiv.org/abs/2203.02155), the SFT to RM to PPO recipe that made ChatGPT. Required reading.
- FLAN / instruction tuning (Wei et al.), Self-Instruct ([arxiv 2212.10560](https://arxiv.org/abs/2212.10560)), Alpaca, Tulu 2/3 (AllenAI, Tulu 3 is the best open, documented full post-training recipe: [arxiv 2411.15124](https://arxiv.org/abs/2411.15124)).
- Chat templates, loss masking on prompt tokens (only train on completion), packing vs padding, multi-turn masking.
- LoRA ([arxiv 2106.09685](https://arxiv.org/abs/2106.09685)) and QLoRA ([arxiv 2305.14314](https://arxiv.org/abs/2305.14314)), parameter-efficient finetuning (PEFT).

**Tit-bits:** quality beats quantity for SFT (LIMA, "Less Is More for Alignment", 1K great examples); prompt-token loss masking is a silent bug source; sequence packing with correct attention masking (do not let examples attend across the pack boundary); chat template mismatch between train and inference is the number one finetuning failure.

**Lexicon:** SFT, instruction tuning, chat template, system prompt, loss masking, completion-only loss, packing, LoRA/QLoRA/DoRA, PEFT, adapters, catastrophic forgetting, alignment tax.

---

## Module 9: Post-Training II: RLHF, DPO and RLVR

The 2022 to 2026 arc: PPO to DPO to verifiable-reward RL (the reasoning-model era).

**Read:**
- RLHF/PPO foundations: InstructGPT (above) plus PPO (Schulman et al.): [arxiv 1707.06347](https://arxiv.org/abs/1707.06347). Understand reward model, KL penalty to reference, value head, GAE, reward hacking.
- DPO (Rafailov et al. 2023): [arxiv 2305.18290](https://arxiv.org/abs/2305.18290), RLHF without a separate RL loop. Then the zoo: IPO, KTO, ORPO, SimPO, cDPO.
- RLAIF / Constitutional AI (Anthropic): [arxiv 2212.08073](https://arxiv.org/abs/2212.08073).
- The reasoning era (must-read): DeepSeek-R1 ([arxiv 2501.12948](https://arxiv.org/abs/2501.12948)), GRPO (Group Relative Policy Optimization), RLVR (RL with Verifiable Rewards), R1-Zero (pure RL, no SFT, emergent CoT). This changed the field.
- Follow-ons to know: PPO vs GRPO vs RLOO vs REINFORCE++, process reward models (PRM) vs outcome reward models (ORM), rejection sampling / STaR / best-of-N, length bias and reward hacking in RL, verifier design, entropy collapse in RL.

**Tit-bits:** the KL-to-reference coefficient is the master knob for how far it can drift; reward over-optimization (Gao et al. scaling laws for reward model overoptimization); DPO's implicit reward and why it can degrade the reference model; GRPO drops the value network (memory win) and normalizes advantage within a sampled group; RLVR only works where you can *check* the answer (math, code, formal), that is the whole game right now.

**Lexicon:** RLHF, reward model (RM), preference data, Bradley-Terry, PPO, GAE, KL penalty, reference policy, DPO/IPO/KTO/ORPO/SimPO, RLAIF, Constitutional AI, GRPO, RLVR, verifier, PRM/ORM, rejection sampling, STaR, best-of-N, reward hacking, over-optimization, entropy collapse, on-policy vs off-policy, rollout, advantage.

---

## Module 10: Long Context, Inference and Serving

Training is not done until it serves cheaply.

**Read:**
- Context extension: RoPE scaling, YaRN, Position Interpolation (Chen et al.), ring/blockwise attention; long-context needle-in-a-haystack eval and its critiques (RULER).
- Quantization: GPTQ, AWQ, SmoothQuant, bitsandbytes NF4, GGUF/llama.cpp, FP8/INT4 inference; QAT vs PTQ.
- Inference systems: vLLM plus PagedAttention, continuous batching, speculative decoding (draft model / Medusa / EAGLE), prefix caching, chunked prefill, disaggregated prefill/decode, TTFT vs TPOT/ITL latency metrics.
- Distillation: knowledge distillation (Hinton), sequence-level KD, on-policy distillation (2025, used to make small models punch up).

**Lexicon:** KV cache, prefill vs decode, TTFT/TPOT/ITL, continuous batching, PagedAttention, speculative decoding, draft model, Medusa/EAGLE, quantization (PTQ/QAT, GPTQ/AWQ/GGUF/NF4), throughput vs latency, prefix/prompt caching, needle-in-a-haystack, RULER, distillation.

---

## Module 11: Evaluation (where credibility is won or lost)

**Read:**
- HELM (Stanford), lm-evaluation-harness (EleutherAI, the de facto tool), MMLU / MMLU-Pro / GPQA / BBH / GSM8K / MATH / HumanEval+ / MBPP / IFEval / MT-Bench.
- LMSYS Chatbot Arena plus Elo / Bradley-Terry ranking, and its style/length confounds.
- LLM-as-a-judge (Zheng et al., MT-Bench paper), and its biases (position, verbosity, self-preference).

**Tit-bits normal people miss:** prompt-format sensitivity can swing MMLU by 5-10 points (few-shot vs zero-shot, answer-extraction, log-prob vs generation scoring); contamination inflates everything; benchmark saturation; elicitation gap (a model can be much better than its eval score with the right prompting).

**Lexicon:** zero/few-shot, in-context learning, CoT prompting, self-consistency, pass@k, log-likelihood vs generative eval, contamination, saturation, Elo, LLM-as-judge, IFEval, contamination-free, held-out.

---

## Module 12: Interpretability, Safety and the Frontier Lexicon

Round out your vocabulary so you can read *any* 2026 paper.

- Mechanistic interpretability: residual stream, induction heads, superposition, sparse autoencoders (SAEs), features vs neurons (Anthropic's "Toward Monosemanticity," "Scaling Monosemanticity").
- Safety/alignment: jailbreaks, red-teaming, sycophancy, deceptive alignment, sandbagging, RLHF's reward hacking, refusal training, unlearning.
- Emerging architectures to name-drop correctly: Mamba / SSMs / state-space models, linear attention, hybrid (attention plus SSM) models (Jamba, Zamba), Byte Latent Transformer (BLT), diffusion LMs, test-time compute / inference-time scaling (o1-style), latent reasoning.

---

## The How-Do-I-Actually-Do-It Track

If you want to *build* alongside the reading:
1. nanochat end-to-end (Module 0).
2. Sebastian Raschka, "Build a Large Language Model (From Scratch)" (book plus [repo](https://github.com/rasbt/LLMs-from-scratch)), the most methodical from-zero build, now with a from-scratch-to-finetuning arc. Pair with his [Ahead of AI](https://magazine.sebastianraschka.com/) newsletter for monthly modern-paper digests.
3. HuggingFace [LLM Course](https://huggingface.co/learn/llm-course) plus [Ultra-Scale Playbook](https://huggingface.co/spaces/nanotron/ultrascale-playbook) for the systems/data engineering half.
4. Read one full technical report cover-to-cover: DeepSeek-V3, Llama 3 ([arxiv 2407.21783](https://arxiv.org/abs/2407.21783), the 92-page one), OLMo 2 / Tulu 3 (AllenAI, fully open including data), Qwen3 ([arxiv 2505.09388](https://arxiv.org/abs/2505.09388)). These reports *are* the modern curriculum. Everything above appears in them.

---

## Suggested 10-Week Sequence

- **Wk 1-2:** Module 0-2 (nanochat plus Karpathy plus transformer internals). Build a working tiny GPT.
- **Wk 3-4:** Module 3-5 (optimization, scaling laws, data). Read Chinchilla plus FineWeb plus DeepSeek-V3.
- **Wk 5-6:** Module 6-7 (distributed plus MoE). Ultra-Scale Playbook.
- **Wk 7-8:** Module 8-9 (SFT plus RLHF/GRPO). Run a LoRA SFT then a DPO.
- **Wk 9-10:** Module 10-12 (inference, eval, frontier). Read one full tech report cover to cover.

---

## Sources

- [karpathy/nanochat](https://github.com/karpathy/nanochat)
- [nanollama 2026 baseline](https://github.com/karpathy/nanochat/discussions/557)
- [The Crystallization of Transformer Architectures 2017-2025](https://jytan.net/blog/2025/transformer-architectures/)
- [Qwen3 Technical Report](https://arxiv.org/abs/2505.09388)
- [Chinchilla explained (plain English)](https://lifearchitect.ai/chinchilla/)
- [Rephrasing the Web (WRAP)](https://arxiv.org/abs/2401.16380)
- [LLM Scaling Laws relevance in 2026](https://medium.com/@advaitss11/llm-scaling-laws-and-their-relevance-in-2026-b7928e732b6d)
