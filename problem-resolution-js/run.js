const { computeScore } = require('./score');

const examples = [
    { input: [1, 2, 3, 4, 5], expected: 13 },
    { input: [17, 19, 21], expected: 9 },
    { input: [5, 5, 5], expected: 15 },
];

for (const ex of examples) {
    const out = computeScore(ex.input);
    console.log(`Input: ${JSON.stringify(ex.input)} -> Output: ${out} (expected ${ex.expected})`);
}
