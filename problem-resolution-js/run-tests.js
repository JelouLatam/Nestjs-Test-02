const assert = require('assert');
const { computeScore } = require('./score');

function test(name, fn) {
    try {
        fn();
        console.log(`PASS: ${name}`);
    } catch (err) {
        console.error(`FAIL: ${name}`);
        console.error(err.stack || err.message);
        process.exitCode = 1;
    }
}

test('example 1', () => {
    assert.strictEqual(computeScore([1, 2, 3, 4, 5]), 13);
});

test('example 2', () => {
    assert.strictEqual(computeScore([17, 19, 21]), 9);
});

test('example 3', () => {
    assert.strictEqual(computeScore([5, 5, 5]), 15);
});

test('empty array -> 0', () => {
    assert.strictEqual(computeScore([]), 0);
});

test('non-numeric values ignored', () => {
    assert.strictEqual(computeScore([2, 'a', null, undefined, 5]), 6); // 2 -> +1, 5 -> +5
});

console.log('All tests done.');
