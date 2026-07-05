# LLM Mastery: The 0 to 100 Curriculum

An interactive, self-contained reading tracker for learning how to train a large language model from scratch. Every module, paper, and piece of the modern research lexicon in one place, with a progress bar and per-item read tracking that persists in your browser.

## Features

- **13 modules** covering the full stack: tokenization, the modern Transformer, optimization, scaling laws, data, distributed training, MoE, SFT, RLHF/DPO/RLVR, inference, evaluation, and interpretability.
- **Mark-as-read checkboxes** on every resource, with a global progress bar and per-module progress.
- **Progress persists** automatically via `localStorage`. Close the tab and come back where you left off.
- **Light and dark mode**, toggled from the navbar and remembered across pages.
- **Filters**: view all modules, only unfinished, or only completed.
- **Completion celebration** with confetti when you finish a module or the whole curriculum.
- **Doc page** (`doc.html`) with the full written curriculum, rendered from Markdown.
- Fully static. No build step, no server, no dependencies to install.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The interactive module checklist (Home) |
| `doc.html` | The full written curriculum (Doc) |
| `CURRICULUM.md` | The curriculum in raw Markdown |
| `README.md` | This file |

## Run it

Just open `index.html` in any modern browser:

```bash
git clone https://github.com/ManasVardhan/llm-mastery.git
cd llm-mastery
open index.html        # macOS
# or: xdg-open index.html   (Linux)   |   start index.html   (Windows)
```

Optionally serve it locally (recommended so the Doc page loads over http):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## How progress is stored

Read state is kept in your browser under the `localStorage` key `llm-curriculum-progress-v1`, and the theme preference under `llm-theme`. Progress is per-browser and per-device. Use the **Reset** button in the navbar to clear it.

## License

MIT. Use it, fork it, remix it.
