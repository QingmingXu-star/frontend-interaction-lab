# Frontend Interaction Lab

A collection of frontend UI and interaction experiments.

This repository serves as a playground for exploring:

- Interaction patterns
- Animation techniques
- UI composition
- Small self-contained interface experiments

Each experiment is organized as an independent demo under the `demos/` directory.

---

## Demos

### Minimalist Bistro

A step-by-step ordering experience that explores:

- Staged user interaction flow
- Animated transitions between steps
- A "toaster-style" receipt reveal effect

📂 Path: `demos/minimalist-bistro/`

---

### Arch Carousel

An infinite horizontal carousel with arch-shaped units, exploring:

- Momentum scrolling and elastic snap alignment
- Multi-layer compositing with SVG and `clip-path`
- Dual-mode arrow key control (tap to snap / hold to scroll)
- A click zoom-through effect: upper layer scales to 8× while the content layer expands to fill the screen

📂 Path: `demos/arch-carousel/`

---

## Structure

```txt
demos/
  ├─ minimalist-bistro/
  ├─ arch-carousel/
  └─ more experiments...
```

---

## Experiment Philosophy

- Each demo focuses on a specific interaction or visual idea
- Experiments are intentionally small and self-contained
- No strict framework or architecture is enforced across demos
- Code may evolve or be refactored as ideas mature

---

## Tech Stack

- HTML
- CSS
- TypeScript
- Vanilla JavaScript (dependency-free experiments)

---

## Run a Demo Locally

Each demo has its own setup; refer to its README for details.

Example — Minimalist Bistro:

```bash
cd demos/minimalist-bistro
npm install
npm run build
cd ../..
python3 -m http.server 8080
```

Then open: `http://127.0.0.1:8080/demos/minimalist-bistro/`

Arch Carousel is a pure static project — open `demos/arch-carousel/index.html` directly with any static file server.

---

## Roadmap

- Add more interaction experiments
- Explore reusable animation patterns
- Group experiments by category (interaction / layout / motion)
- Extract reusable patterns when appropriate

---

## Notes

- This is an experimental repository; structure may evolve over time
- Some demos may later become standalone projects
