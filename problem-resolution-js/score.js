// computeScore(array) -> number
// Rules:
// - +1 point for every even number (0 counts as even)
// - +3 points for every odd number except 5
// - +5 points for every occurrence of 5

function computeScore(arr) {
    let total = 0;
    for (const n of arr) {
        if (typeof n !== 'number' || !Number.isFinite(n)) continue;
        const num = n;
        if (num === 5) {
            total += 5;
        } else if (num % 2 === 0) {
            total += 1;
        } else {
            total += 3;
        }
    }
    return total;
}

module.exports = { computeScore };
