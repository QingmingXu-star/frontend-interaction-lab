# Frontend Interaction Lab

A collection of frontend UI and interaction experiments.

This repository serves as a playground for exploring:

* interaction patterns
* animation techniques
* UI composition
* small self-contained interface experiments

Each experiment is organized as an independent demo under the `demos/` directory.

---

## Demos

### Minimalist Bistro

A step-by-step ordering experience that explores:

* staged user interaction flow
* animated transitions between steps
* a “toaster-style” receipt reveal effect

📂 Path:

```txt
demos/minimalist-bistro/
```

---

## Structure

```txt
demos/
  ├─ minimalist-bistro/
  ├─ interaction-flow/      (planned)
  ├─ animation-lab/         (planned)
  ├─ layout-experiments/    (planned)
  └─ more experiments...
```

---

## Experiment Philosophy

This repository is organized as a collection of independent experiments:

* Each demo focuses on a specific interaction or visual idea
* Experiments are intentionally small and self-contained
* No strict framework or architecture is enforced across demos
* Code may evolve or be refactored as ideas mature

---

## Tech Stack

* HTML
* CSS
* TypeScript

---

## Run a Demo Locally

Example (Minimalist Bistro):

```bash
cd demos/minimalist-bistro
npm install
npm run build
cd ../..
python3 -m http.server 8080
```

Then open:

```txt
http://127.0.0.1:8080/demos/minimalist-bistro/
```

---

## Roadmap

* Add more interaction experiments
* Explore reusable animation patterns
* Group experiments by category (interaction / layout / motion)
* Extract reusable patterns when appropriate

---

## Notes

* This is an experimental repository
* Structure may evolve over time
* Some demos may later become standalone projects
