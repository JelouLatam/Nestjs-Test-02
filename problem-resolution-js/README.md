Problem resolution - scoring kata

This folder contains a small Node 20 solution for the scoring problem described in the technical test.

Rules implemented:
- +1 point for every even integer (0 is considered even)
- +3 points for every odd integer, except the number 5
- +5 points for every appearance of the number 5

Files:
- `score.js` : exports `computeScore(array)`
- `run.js` : runs the example inputs and prints outputs
- `run-tests.js` : basic test runner using Node assert

Run examples:

```bash
node problem-resolution-js/run.js
```

Run the tests:

```bash
node problem-resolution-js/run-tests.js
```
