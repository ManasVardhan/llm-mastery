// Shared curriculum data for LLM Mastery.
// Loaded by both index.html (checklist) and module.html (detail pages).
// idFor(m,i) = "m"+m.n+"i"+i  -> the localStorage key scheme both pages share.
const MODULES=[
{n:"0",t:"Orientation & Mental Model",s:"The pipeline before the math",c:"#6d7cff",
 blurb:"Every LLM is: tokenize \u2192 pretrain \u2192 mid-train \u2192 post-train \u2192 align \u2192 evaluate \u2192 serve. Internalize the skeleton first; everything else hangs off it.",
 overview:"This module builds the mental map before you touch any math. You will see the full lifecycle of a language model end to end so that every later module has a place to slot into. The single most valuable thing you can do here is read and run one complete, minimal training stack from raw text to a served model.",
 study:[
  "The seven stages of the LLM lifecycle: tokenize, pretrain, mid-train, post-train (SFT + RL), align, evaluate, serve.",
  "What next-token prediction actually optimizes, and why cross-entropy is the loss and perplexity is its readable form (ppl = exp(loss)).",
  "The difference between a base model and an instruct/chat model, and exactly where in the pipeline each is produced.",
  "The core vocabulary of the field so that papers stop feeling opaque."],
 doit:[
  "Clone nanochat and read every file top to bottom, annotating what each stage does.",
  "Run the nanochat speedrun (rent an 8xH100 node, or run the smallest depth locally) and watch the loss curve drop.",
  "Draw the full pipeline from memory on a single page. If you cannot, reread until you can.",
  "Watch Karpathy's 'Let's build GPT' and reimplement the tiny GPT in a fresh file without looking."],
 mastery:[
  "You can explain, unprompted, every stage from raw text to served model.",
  "You can compute perplexity from a loss value and say what it means.",
  "You can point to where in nanochat each lifecycle stage lives."],
 items:[
  {t:"nanochat (Karpathy) - full stack in ~8K lines",note:"THE reference implementation. Tokenizer \u2192 pretrain \u2192 SFT \u2192 RL \u2192 eval \u2192 web UI for ~$100 on 8xH100. Clone it, read every file, run the speedrun.",links:[["GitHub","https://github.com/karpathy/nanochat"]]},
  {t:"Neural Networks: Zero to Hero",note:"Watch 'Let's build GPT' and 'Let's build the GPT Tokenizer' with the code open.",links:[["Course","https://karpathy.ai/zero-to-hero.html"]]},
  {t:"nanollama - raw text to GGUF in one command",note:"2026 spinoff showing a modern Llama-style stack end to end.",links:[["Discussion","https://github.com/karpathy/nanochat/discussions/557"]]},
 ],
 lex:["autoregressive","causal LM","next-token prediction","teacher forcing","cross-entropy","perplexity","bits-per-byte","context length","base vs instruct","foundation model","pretraining","post-training"]},

{n:"1",t:"Tokenization",s:"The part everyone underrates",c:"#7d6dff",
 blurb:"Tokenization silently determines math ability, multilingual fairness, and effective context. Normal people skip this. Do not.",
 overview:"Tokenization is the interface between raw bytes and the model. It quietly sets the ceiling on arithmetic, multilingual fairness, and how much real content fits in the context window. Most learners skip it; the ones who master it debug problems others cannot even see.",
 study:[
  "How BPE builds a vocabulary by iteratively merging frequent pairs, and how byte-level BPE guarantees nothing is ever out of vocabulary.",
  "The role of the pretokenization regex in deciding what tokens are allowed to merge.",
  "Why digit and whitespace handling make or break arithmetic and code.",
  "Unigram LM tokenization as a probabilistic alternative to BPE (used by T5/Gemma).",
  "Failure modes: glitch tokens, high-fertility languages, and the vocabulary-size tradeoff."],
 doit:[
  "Train a BPE tokenizer on a small corpus with minbpe and inspect the learned merges.",
  "Tokenize the same paragraph in English and a non-Latin language; compute fertility (tokens per word) for each.",
  "Find a glitch token in a public tokenizer and demonstrate the odd behavior it triggers.",
  "Tokenize a page of numbers two ways (grouped vs single-digit) and reason about the arithmetic impact."],
 mastery:[
  "You can hand-trace the first few BPE merges on a toy string.",
  "You can explain why 1234+5678 might fail purely because of tokenization.",
  "You can articulate the vocabulary-size tradeoff in both directions."],
 items:[
  {t:"Let's build the GPT Tokenizer + minbpe",note:"Karpathy's video plus his minimal BPE repo.",links:[["Video","https://www.youtube.com/watch?v=zduSFxRajkE"],["minbpe","https://github.com/karpathy/minbpe"]]},
  {t:"Neural Machine Translation of Rare Words with Subword Units",note:"Sennrich et al. 2016 - the original BPE idea.",links:[["arXiv 1508.07909","https://arxiv.org/abs/1508.07909"]]},
  {t:"SentencePiece + Unigram LM tokenizer",note:"Kudo & Richardson 2018. Unigram is different from BPE and used by T5/Gemma.",links:[["arXiv 1808.06226","https://arxiv.org/abs/1808.06226"]]},
  {t:"HuggingFace tokenizers library",note:"Production BBPE tooling.",links:[["GitHub","https://github.com/huggingface/tokenizers"]]},
 ],
 lex:["subword","merge rules","BPE","BBPE","WordPiece","Unigram LM","SentencePiece","pretokenizer regex","fertility","OOV","special tokens","chat template","glitch tokens","digit tokenization","tokenizer-free / BLT"]},

{n:"2",t:"The Transformer, Modern Edition",s:"Not the 2017 vanilla one",c:"#9d6dff",
 blurb:"The modern default stack: pre-norm + RMSNorm, RoPE, SwiGLU, GQA, FlashAttention. Learn it directly, not the archaic version.",
 overview:"This is the architecture module, but taught as the 2025 stack rather than the 2017 paper. You will learn the five components every current model shares and the systems trick (FlashAttention) that makes them trainable at length.",
 study:[
  "Attention as query-key-value with a causal mask, and the residual stream as the model's working memory.",
  "Why pre-norm plus RMSNorm gives stable gradients at depth.",
  "RoPE and how rotation encodes relative position, enabling context extension (YaRN).",
  "SwiGLU feed-forward and the 2/3 hidden-dim convention that keeps params matched.",
  "GQA/MQA/MLA as KV-cache memory optimizations.",
  "FlashAttention as an IO-aware kernel: it is about HBM vs SRAM traffic, not FLOPs."],
 doit:[
  "Take a vanilla GPT and swap LayerNorm to RMSNorm, learned positions to RoPE, and the MLP to SwiGLU; confirm it still trains.",
  "Implement GQA by sharing KV heads and measure the KV-cache memory savings.",
  "Profile attention with and without FlashAttention on a long sequence."],
 mastery:[
  "You can name all five modern-stack components and justify each.",
  "You can explain why FlashAttention saves memory without changing the math.",
  "You can describe how GQA trades a little quality for large inference-memory wins."],
 items:[
  {t:"Attention Is All You Need",note:"Vaswani et al. 2017. Pair with The Illustrated Transformer + The Annotated Transformer.",links:[["arXiv 1706.03762","https://arxiv.org/abs/1706.03762"]]},
  {t:"Crystallization of Transformer Architectures (2017-2025)",note:"Excellent survey of what converged and why.",links:[["Blog","https://jytan.net/blog/2025/transformer-architectures/"]]},
  {t:"RMSNorm - Root Mean Square Layer Normalization",note:"Zhang & Sennrich 2019. Why pre-norm gives gradient stability at depth.",links:[["arXiv 1910.07467","https://arxiv.org/abs/1910.07467"]]},
  {t:"RoFormer / RoPE",note:"Su et al. Rotation encodes relative position and enables YaRN context extension.",links:[["arXiv 2104.09864","https://arxiv.org/abs/2104.09864"],["YaRN","https://arxiv.org/abs/2309.00071"]]},
  {t:"GLU Variants Improve Transformer (SwiGLU)",note:"Shazeer 2020. Note the 2/3 hidden-dim trick to match params.",links:[["arXiv 2002.05202","https://arxiv.org/abs/2002.05202"]]},
  {t:"GQA - Grouped-Query Attention",note:"Ainslie et al. KV-cache memory play, generalizing MQA. Critical for inference.",links:[["arXiv 2305.13245","https://arxiv.org/abs/2305.13245"]]},
  {t:"FlashAttention 1/2/3",note:"Dao et al. IO-awareness: it's about HBM<->SRAM traffic, not FLOPs.",links:[["arXiv 2205.14135","https://arxiv.org/abs/2205.14135"]]},
 ],
 lex:["pre-norm/post-norm","residual stream","attention head","Q/K/V","causal mask","RoPE","ALiBi","NoPE","YaRN","KV cache","MHA/MQA/GQA/MLA","IO-aware","SRAM/HBM","tied embeddings","logit","QK-norm","logit soft-capping","sliding-window","attention sinks"]},

{n:"3",t:"Training Dynamics & Optimization",s:"Where models go to die",c:"#c06dff",
 blurb:"Loss spikes, learning-rate schedules, and how labs keep billion-param runs alive. muP is the tit-bit normal people miss.",
 overview:"Large runs fail in characteristic ways: loss spikes, divergence, dead learning rates. This module is the craft of keeping a run alive plus the theory (muP) that lets you tune cheaply on a small model and transfer to the big one.",
 study:[
  "AdamW and decoupled weight decay, and what optimizer states cost in memory (2x-3x the model).",
  "Warmup plus cosine versus WSD (Warmup-Stable-Decay) schedules, and when each wins.",
  "muP / muTransfer: tune hyperparameters on a small proxy and transfer them to the large model.",
  "Stabilizers: gradient clipping, z-loss, QK-norm, and spike mitigation.",
  "Mixed precision: bf16 vs fp16 vs fp8, loss scaling, and master weights."],
 doit:[
  "Reproduce a loss spike on a tiny model, then kill it with gradient clipping plus z-loss.",
  "Run a muP coordinate check across two model widths and confirm the curves overlay.",
  "Sweep learning rate and warmup length; plot final loss to find the stable basin."],
 mastery:[
  "You can explain why optimizer states can triple training memory.",
  "You can state what muP buys you and roughly how it works.",
  "You can list three cheap defenses against loss spikes."],
 items:[
  {t:"Decoupled Weight Decay Regularization (AdamW)",note:"Loshchilov & Hutter. Still the default optimizer.",links:[["arXiv 1711.05101","https://arxiv.org/abs/1711.05101"]]},
  {t:"muP / muTransfer (Tensor Programs V)",note:"Tune hyperparameters on a tiny model, transfer to the big one. Used by real labs.",links:[["arXiv 2203.03466","https://arxiv.org/abs/2203.03466"]]},
  {t:"An Empirical Model of Large-Batch Training",note:"McCandlish et al. Critical batch size and gradient noise scale.",links:[["arXiv 1812.06162","https://arxiv.org/abs/1812.06162"]]},
  {t:"Muon optimizer + WSD schedules",note:"Modern optimizers (Lion, Sophia, Adam-mini, Muon, SOAP) and Warmup-Stable-Decay eating cosine's lunch.",links:[["Muon","https://kellerjordan.github.io/posts/muon/"]]},
 ],
 lex:["AdamW","weight decay","warmup","cosine/WSD schedule","LR annealing","gradient clipping","grad norm","loss spike","z-loss","muP/muTransfer","coordinate check","critical batch size","gradient accumulation","EMA","bf16/fp8","loss scaling","optimizer states"]},

{n:"4",t:"Scaling Laws & Compute-Optimality",s:"The intellectual core",c:"#dd6dd0",
 blurb:"How labs decide how big a model to train and on how much data. Memorize C \u2248 6ND.",
 overview:"Scaling laws turn 'how big, how much data' from guesswork into arithmetic. Master C \u2248 6ND and the Chinchilla correction and you can size any training run on the back of an envelope.",
 study:[
  "Kaplan power laws and the Chinchilla correction (~20 tokens per parameter).",
  "The compute rule C \u2248 6ND and how to use it for cost estimates.",
  "Why deployed models are over-trained once inference cost enters the objective.",
  "Data-constrained scaling: how many epochs before repetition stops helping (~4).",
  "IsoFLOP curves and the irreducible loss term in L = E + A/N^a + B/D^b."],
 doit:[
  "Given a GPU budget, use 6ND to compute the largest Chinchilla-optimal run you can afford.",
  "Fit a toy scaling curve from runs at three model sizes.",
  "Recompute the optimal size when you weight inference cost heavily, and see it shrink."],
 mastery:[
  "You can derive tokens and params for a target FLOP budget.",
  "You can explain the Kaplan versus Chinchilla discrepancy.",
  "You can argue why real deployed models are smaller than Chinchilla-optimal."],
 items:[
  {t:"Scaling Laws for Neural Language Models",note:"Kaplan et al. 2020. The original power laws.",links:[["arXiv 2001.08361","https://arxiv.org/abs/2001.08361"]]},
  {t:"Training Compute-Optimal LLMs (Chinchilla)",note:"Hoffmann et al. The ~20 tokens/param rule that corrected Kaplan.",links:[["arXiv 2203.15556","https://arxiv.org/abs/2203.15556"],["Explainer","https://lifearchitect.ai/chinchilla/"]]},
  {t:"Scaling Data-Constrained Language Models",note:"Muennighoff et al. ~4 epochs \u2248 fresh data, then diminishing returns.",links:[["arXiv 2305.16264","https://arxiv.org/abs/2305.16264"]]},
  {t:"Beyond Chinchilla-Optimal (inference-adjusted)",note:"Why deployed models are over-trained (smaller, more tokens). LFM2.5-350M hit 80,000:1.",links:[["Analysis","https://medium.com/@advaitss11/llm-scaling-laws-and-their-relevance-in-2026-b7928e732b6d"]]},
 ],
 lex:["power law","compute-optimal","isoFLOP","6ND","tokens-per-parameter","over-training","irreducible loss","scaling exponent","emergent abilities","grokking","double descent","inference-adjusted scaling"]},

{n:"5",t:"Data: Curation, Dedup, Mixtures",s:"The real moat",c:"#ff6db6",
 blurb:"Frontier quality is 80% data. Least glamorous, most important. Mid-training / annealing is the phase most tutorials miss.",
 overview:"Data is where frontier quality actually comes from. This module is filtering, deduplication, mixture weights, and the underrated cooldown / mid-training phase that most tutorials never mention.",
 study:[
  "Web-scale corpora and why well-filtered web data beats hand-curated corpora.",
  "Deduplication with MinHash / LSH and why it improves models, not just saves compute.",
  "Quality filtering: classifiers, perplexity filters, DSIR, and DoReMi mixture weights.",
  "Synthetic and rephrased data (WRAP, the Phi textbooks line).",
  "Decontamination against eval sets, and the annealing / mid-training phase."],
 doit:[
  "Take a raw web dump, run dedup plus a quality classifier, and measure how much you drop.",
  "Build two different data mixtures and compare downstream eval scores.",
  "Design an anneal phase that upsamples high-quality data at the end of pretraining."],
 mastery:[
  "You can explain why dedup improves models, not just training speed.",
  "You can describe how DoReMi picks domain mixture weights.",
  "You can define the mid-training / cooldown phase and its purpose."],
 items:[
  {t:"RefinedWeb",note:"Web data alone, filtered well, beats curated corpora.",links:[["arXiv 2306.01116","https://arxiv.org/abs/2306.01116"]]},
  {t:"FineWeb & FineWeb-Edu blog",note:"A full data-engineering masterclass. Read it slowly.",links:[["Blog","https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1"]]},
  {t:"DoReMi - Domain Reweighting with Minimax Optimization",note:"Learn data mixture weights with a small proxy model.",links:[["arXiv 2305.10429","https://arxiv.org/abs/2305.10429"]]},
  {t:"Rephrasing the Web (WRAP)",note:"Synthetic / rephrased data. Pair with the Phi 'textbooks are all you need' line.",links:[["arXiv 2401.16380","https://arxiv.org/abs/2401.16380"]]},
 ],
 lex:["corpus","dedup (MinHash/LSH)","quality classifier","perplexity filter","DSIR","DoReMi","data mixture","domain weights","upsampling","decontamination","n-gram overlap","synthetic data","annealing/cooldown/mid-training","curriculum","replay","catastrophic forgetting","token budget"]},

{n:"6",t:"Distributed Training & Systems",s:"The memory wall",c:"#ff7d6d",
 blurb:"Parallelism, the roofline model, and MFU - the one number labs quote for training efficiency.",
 overview:"To train big you fight the memory wall with parallelism. This module is the map of DP/TP/PP/EP/SP/CP, ZeRO/FSDP sharding, and the one metric that matters for efficiency: MFU.",
 study:[
  "Data, tensor, pipeline, expert, sequence, and context parallelism, and when to reach for each.",
  "ZeRO stages 1/2/3 and FSDP sharding of optimizer, gradients, and parameters.",
  "Pipeline bubbles and 1F1B scheduling.",
  "Activation checkpointing (recompute vs store) and offloading tradeoffs.",
  "The roofline model, arithmetic intensity, and Model FLOPs Utilization (aim for 40-55%)."],
 doit:[
  "Shard a model with FSDP and confirm per-GPU memory scales down with world size.",
  "Add activation checkpointing and measure the compute-for-memory tradeoff.",
  "Compute the MFU of a training run from tokens/sec and the 6ND FLOP estimate."],
 mastery:[
  "You can pick a parallelism strategy for a given model and cluster.",
  "You can explain what ZeRO-3 shards and why it saves memory.",
  "You can compute MFU and judge whether a run is efficient."],
 items:[
  {t:"Megatron-LM (tensor parallelism)",note:"Shoeybi et al. 2019.",links:[["arXiv 1909.08053","https://arxiv.org/abs/1909.08053"]]},
  {t:"ZeRO / DeepSpeed",note:"Rajbhandari et al. Stages 1/2/3 sharding. FSDP is the PyTorch-native equivalent.",links:[["arXiv 1910.02054","https://arxiv.org/abs/1910.02054"]]},
  {t:"Ring Attention (sequence/context parallel)",note:"For long context training.",links:[["arXiv 2310.01889","https://arxiv.org/abs/2310.01889"]]},
  {t:"The Ultra-Scale Playbook",note:"HuggingFace 2025. Outstanding modern systems read. Pair with Google's 'How to Scale Your Model'.",links:[["Playbook","https://huggingface.co/spaces/nanotron/ultrascale-playbook"]]},
 ],
 lex:["DP/TP/PP/EP/SP/CP","3D/4D parallelism","ZeRO-1/2/3","FSDP","sharding","all-reduce/all-gather","NCCL","pipeline bubble","1F1B","micro-batch","activation checkpointing","rematerialization","offloading","MFU/HFU","arithmetic intensity","roofline","NVLink/InfiniBand"]},

{n:"7",t:"Mixture-of-Experts",s:"Near-mandatory in 2026",c:"#ffa06d",
 blurb:"Every frontier model (DeepSeek-V3, Mixtral, Qwen3, Llama 4, GPT-oss) is MoE now. Active vs total params is the key intuition.",
 overview:"Every frontier model in 2026 is sparse. This module is routing, load balancing, and the active-versus-total-params intuition that makes Mixture-of-Experts economical.",
 study:[
  "Top-k routing and why sparsity gives you more parameters per FLOP.",
  "Load-balancing loss versus auxiliary-loss-free (bias-adjusted) balancing.",
  "Shared and fine-grained experts (DeepSeekMoE).",
  "Failure modes: expert collapse, token dropping, and the capacity factor.",
  "Expert parallelism and its communication cost."],
 doit:[
  "Convert a dense MLP block into a top-2 MoE and route tokens through experts.",
  "Add a load-balancing loss and watch expert utilization even out.",
  "Measure active versus total params and the resulting FLOP savings."],
 mastery:[
  "You can explain why a 671B MoE runs like an ~37B dense model.",
  "You can describe auxiliary-loss-free load balancing.",
  "You can name two MoE failure modes and their fixes."],
 items:[
  {t:"Switch Transformer",note:"Fedus et al. 2021. Pair with GShard.",links:[["arXiv 2101.03961","https://arxiv.org/abs/2101.03961"]]},
  {t:"Mixtral of Experts",note:"2024. Clean, readable sparse MoE.",links:[["arXiv 2401.04088","https://arxiv.org/abs/2401.04088"]]},
  {t:"DeepSeek-V3 Technical Report",note:"The most important single report of the era. Fine-grained + shared experts, aux-loss-free balancing, MLA, FP8. Read it twice.",links:[["arXiv 2412.19437","https://arxiv.org/abs/2412.19437"]]},
 ],
 lex:["sparse MoE","router/gating","top-k routing","active params","shared/fine-grained experts","load-balancing loss","aux-loss-free balancing","expert collapse","router z-loss","capacity factor","token dropping","expert parallel","upcycling"]},

{n:"8",t:"Post-Training I: SFT",s:"Base model to assistant",c:"#ffc46d",
 blurb:"Instruction tuning, chat templates, loss masking, and PEFT. Quality beats quantity - LIMA showed 1K great examples.",
 overview:"SFT turns a base model into something that follows instructions. The craft is data quality, chat templates, and loss masking; the classic trap is a train/inference template mismatch that silently wrecks quality.",
 study:[
  "The SFT to reward-model to RL pipeline, and where supervised finetuning sits in it.",
  "Chat templates, system prompts, and completion-only loss masking.",
  "Sequence packing with correct attention masking across the pack boundary.",
  "LoRA / QLoRA and parameter-efficient finetuning.",
  "Why quality beats quantity for SFT (LIMA: 1K great examples)."],
 doit:[
  "Fine-tune a small base model on a 1K high-quality instruction set using LoRA.",
  "Implement completion-only loss masking and verify prompt tokens are not trained on.",
  "Deliberately break, then fix, a chat-template mismatch and observe the quality swing."],
 mastery:[
  "You can explain why prompt-token loss masking matters.",
  "You can set up a correct chat template end to end.",
  "You can describe when LoRA is preferable to full finetuning."],
 items:[
  {t:"InstructGPT",note:"Ouyang et al. The SFT\u2192RM\u2192PPO recipe that made ChatGPT. Required reading.",links:[["arXiv 2203.02155","https://arxiv.org/abs/2203.02155"]]},
  {t:"Self-Instruct",note:"Bootstrapping instruction data. Pair with Alpaca.",links:[["arXiv 2212.10560","https://arxiv.org/abs/2212.10560"]]},
  {t:"Tulu 3 (AllenAI)",note:"The best open, fully-documented post-training recipe.",links:[["arXiv 2411.15124","https://arxiv.org/abs/2411.15124"]]},
  {t:"LoRA + QLoRA",note:"Parameter-efficient finetuning (PEFT).",links:[["LoRA","https://arxiv.org/abs/2106.09685"],["QLoRA","https://arxiv.org/abs/2305.14314"]]},
 ],
 lex:["SFT","instruction tuning","chat template","system prompt","loss masking","completion-only loss","sequence packing","LoRA/QLoRA/DoRA","PEFT","adapters","LIMA","alignment tax"]},

{n:"9",t:"Post-Training II: RLHF, DPO & RLVR",s:"The reasoning-model era",c:"#e8d96d",
 blurb:"PPO \u2192 DPO \u2192 verifiable-reward RL. GRPO + RLVR (DeepSeek-R1) changed the field. KL-to-reference is the master knob.",
 overview:"This is the alignment and reasoning module: how preferences and verifiable rewards shape behavior, from PPO through DPO to the GRPO / RLVR wave that created the reasoning models.",
 study:[
  "RLHF with PPO: reward model, KL-to-reference penalty, value head, and GAE.",
  "DPO and the preference-optimization family (IPO, KTO, ORPO, SimPO).",
  "RLAIF and Constitutional AI.",
  "GRPO and RLVR: verifiable rewards, R1-Zero, and emergent chain-of-thought.",
  "Failure modes: reward hacking, over-optimization, and entropy collapse."],
 doit:[
  "Run a DPO finetune on a preference dataset and compare it against plain SFT.",
  "Implement a simple verifiable-reward loop on math with GRPO-style group advantage.",
  "Sweep the KL coefficient and watch drift trade off against quality."],
 mastery:[
  "You can explain the master role of the KL-to-reference term.",
  "You can contrast PPO and GRPO in both memory cost and mechanics.",
  "You can say exactly where RLVR applies and where it does not."],
 items:[
  {t:"PPO - Proximal Policy Optimization",note:"Schulman et al. Reward model, KL penalty, value head, GAE, reward hacking.",links:[["arXiv 1707.06347","https://arxiv.org/abs/1707.06347"]]},
  {t:"DPO - Direct Preference Optimization",note:"Rafailov et al. RLHF without a separate RL loop. Then the zoo: IPO, KTO, ORPO, SimPO.",links:[["arXiv 2305.18290","https://arxiv.org/abs/2305.18290"]]},
  {t:"Constitutional AI / RLAIF",note:"Anthropic. AI feedback instead of human labels.",links:[["arXiv 2212.08073","https://arxiv.org/abs/2212.08073"]]},
  {t:"DeepSeek-R1 (GRPO + RLVR)",note:"Must-read. R1-Zero: pure RL, no SFT, emergent chain-of-thought. GRPO drops the value network.",links:[["arXiv 2501.12948","https://arxiv.org/abs/2501.12948"]]},
 ],
 lex:["RLHF","reward model","Bradley-Terry","PPO","GAE","KL penalty","reference policy","DPO/IPO/KTO/ORPO/SimPO","RLAIF","GRPO","RLVR","verifier","PRM/ORM","rejection sampling","STaR","best-of-N","reward hacking","over-optimization","entropy collapse","rollout","advantage"]},

{n:"10",t:"Long Context, Inference & Serving",s:"Serve it cheaply",c:"#a0e86d",
 blurb:"Training isn't done until it serves. Quantization, speculative decoding, PagedAttention, and TTFT vs TPOT.",
 overview:"A model is not done until it serves cheaply. This module is quantization, the KV cache, speculative decoding, and the latency vocabulary of production serving.",
 study:[
  "Prefill versus decode, and the latency metrics TTFT, TPOT, and ITL.",
  "The KV cache and PagedAttention; continuous batching.",
  "Quantization: PTQ vs QAT, GPTQ / AWQ / GGUF / NF4, and FP8/INT4.",
  "Speculative decoding with draft models, Medusa, and EAGLE.",
  "Long-context extension and its evals (needle-in-a-haystack, RULER)."],
 doit:[
  "Serve a model with vLLM and measure TTFT and throughput under load.",
  "Quantize a model to 4-bit and compare quality and speed against the full-precision baseline.",
  "Add speculative decoding and measure the decode speedup."],
 mastery:[
  "You can explain why prefill and decode have different bottlenecks.",
  "You can pick a quantization method for a latency/quality target.",
  "You can describe how speculative decoding preserves the output distribution."],
 items:[
  {t:"vLLM + PagedAttention",note:"Continuous batching, prefix caching, chunked prefill.",links:[["Paper","https://arxiv.org/abs/2309.06180"]]},
  {t:"Quantization: GPTQ / AWQ / SmoothQuant",note:"PTQ vs QAT, GGUF/llama.cpp, NF4, FP8/INT4 inference.",links:[["GPTQ","https://arxiv.org/abs/2210.17323"],["AWQ","https://arxiv.org/abs/2306.00978"]]},
  {t:"Speculative decoding + Medusa / EAGLE",note:"Draft model accelerates decode without changing outputs.",links:[["Spec decode","https://arxiv.org/abs/2211.17192"]]},
  {t:"Distilling the Knowledge in a Neural Network",note:"Hinton et al. Plus on-policy distillation (2025) for small strong models.",links:[["arXiv 1503.02531","https://arxiv.org/abs/1503.02531"]]},
 ],
 lex:["prefill vs decode","TTFT/TPOT/ITL","continuous batching","PagedAttention","speculative decoding","draft model","Medusa/EAGLE","GPTQ/AWQ/GGUF/NF4","PTQ/QAT","throughput vs latency","prefix caching","needle-in-a-haystack","RULER","distillation"]},

{n:"11",t:"Evaluation",s:"Where credibility is won or lost",c:"#6de8a0",
 blurb:"Prompt-format sensitivity can swing MMLU 5-10 points. Contamination inflates everything. You'll feel at home here.",
 overview:"Evaluation is where claims are won or lost. This module teaches the standard benchmarks and, more importantly, the ways they mislead: prompt sensitivity, contamination, and saturation.",
 study:[
  "The core benchmark suite: MMLU, GPQA, GSM8K, MATH, HumanEval, IFEval, and MT-Bench.",
  "lm-eval-harness and HELM as tooling and frameworks.",
  "Arena Elo and its style / length confounds.",
  "LLM-as-a-judge and its biases (position, verbosity, self-preference).",
  "Contamination, benchmark saturation, and the elicitation gap."],
 doit:[
  "Run lm-eval-harness on a model across three tasks and record the numbers.",
  "Change only the prompt format and measure how much MMLU moves.",
  "Build a tiny LLM-as-judge and probe it for position bias."],
 mastery:[
  "You can explain why prompt format can move a score by 10 points.",
  "You can detect likely benchmark contamination.",
  "You can describe the elicitation gap and why it matters."],
 items:[
  {t:"lm-evaluation-harness",note:"The de facto eval tool. MMLU, GPQA, GSM8K, MATH, HumanEval, IFEval, BBH.",links:[["GitHub","https://github.com/EleutherAI/lm-evaluation-harness"]]},
  {t:"HELM - Holistic Evaluation of Language Models",note:"Stanford's multi-metric framework.",links:[["arXiv 2211.09110","https://arxiv.org/abs/2211.09110"]]},
  {t:"Judging LLM-as-a-Judge (MT-Bench + Chatbot Arena)",note:"Zheng et al. Elo ranking plus judge biases (position, verbosity, self-preference).",links:[["arXiv 2306.05685","https://arxiv.org/abs/2306.05685"]]},
  {t:"Are Emergent Abilities a Mirage?",note:"Schaeffer et al. The metric-choice critique of emergence.",links:[["arXiv 2304.15004","https://arxiv.org/abs/2304.15004"]]},
 ],
 lex:["zero/few-shot","in-context learning","CoT prompting","self-consistency","pass@k","log-likelihood vs generative eval","contamination","saturation","Elo","LLM-as-judge","IFEval","elicitation gap","held-out"]},

{n:"12",t:"Interpretability, Safety & Frontier",s:"Read any 2026 paper",c:"#6dc4ff",
 blurb:"Round out the vocabulary: mech interp, safety failure modes, and the emerging architectures worth name-dropping correctly.",
 overview:"The capstone: the vocabulary and ideas that let you read any 2026 paper, plus the safety failure modes and the architectures reaching beyond the standard Transformer.",
 study:[
  "Mechanistic interpretability: residual stream, induction heads, superposition, and sparse autoencoders.",
  "Safety failure modes: jailbreaks, sycophancy, deceptive alignment, and sandbagging.",
  "Alternative architectures: Mamba / SSMs, linear attention, and hybrids (Jamba, Zamba).",
  "Tokenizer-free models (BLT) and diffusion language models.",
  "Test-time compute and latent reasoning."],
 doit:[
  "Read one interpretability article and reproduce a toy induction-head finding.",
  "Red-team a chat model and document three distinct failure modes.",
  "Read one full frontier tech report cover to cover and outline its complete stack."],
 mastery:[
  "You can explain superposition and why sparse autoencoders help.",
  "You can name three post-Transformer architectures and their pitch.",
  "You can read a new model's tech report and map it back to these 13 modules."],
 items:[
  {t:"Toward / Scaling Monosemanticity (Anthropic)",note:"Sparse autoencoders, features vs neurons, superposition, induction heads.",links:[["Article","https://transformer-circuits.pub/2024/scaling-monosemanticity/"]]},
  {t:"Mamba - Linear-Time Sequence Modeling with SSMs",note:"State-space models, linear attention, hybrid (Jamba, Zamba) architectures.",links:[["arXiv 2312.00752","https://arxiv.org/abs/2312.00752"]]},
  {t:"Byte Latent Transformer (BLT)",note:"Meta 2024. Tokenizer-free, byte-level, dynamic patching.",links:[["arXiv 2412.09871","https://arxiv.org/abs/2412.09871"]]},
  {t:"Read one full tech report cover to cover",note:"Llama 3 (the 92-page one), DeepSeek-V3, OLMo 2/Tulu 3, or Qwen3. These reports ARE the modern curriculum.",links:[["Llama 3","https://arxiv.org/abs/2407.21783"],["Qwen3","https://arxiv.org/abs/2505.09388"]]},
 ],
 lex:["residual stream","induction heads","superposition","sparse autoencoders","monosemanticity","jailbreak","red-teaming","sycophancy","deceptive alignment","sandbagging","unlearning","Mamba/SSM","linear attention","hybrid models","diffusion LM","test-time compute","latent reasoning"]},
];
function idFor(m,i){return "m"+m.n+"i"+i}
