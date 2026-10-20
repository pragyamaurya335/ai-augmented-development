/**
 * Bubble Sort Algorithm Definition and Snapshot Generator
 */

export const bubbleSortCode = [
  "function bubbleSort(arr) {",
  "  const n = arr.length;",
  "  for (let i = 0; i < n - 1; i++) {",
  "    for (let j = 0; j < n - i - 1; j++) {",
  "      if (arr[j] > arr[j + 1]) {",
  "        swap(arr, j, j + 1);",
  "      }",
  "    }",
  "  }",
  "}"
];

export const bubbleSortMeta = {
  id: 'bubble',
  name: 'Bubble Sort',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(1)',
  description: 'Repeatedly steps through the array, compares adjacent elements, and swaps them if out of order.'
};

/**
 * Generates step snapshots for Bubble Sort.
 * @param {number[]} initialArray
 * @returns {Array<object>}
 */
export function generateBubbleSortSnapshots(initialArray = [5, 2, 8, 4, 1]) {
  const arr = [...initialArray];
  const n = arr.length;
  const snapshots = [];
  let step = 1;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = new Set();

  function makeBars(comparingIdxs = [], swappingIdxs = []) {
    return arr.map((val, idx) => {
      let status = 'normal';
      if (sortedIndices.has(idx)) {
        status = 'sorted';
      } else if (swappingIdxs.includes(idx)) {
        status = 'swapping';
      } else if (comparingIdxs.includes(idx)) {
        status = 'comparing';
      }
      return { val, status };
    });
  }

  // 1. Initial State
  snapshots.push({
    step: step++,
    line: 2,
    comparisons,
    swaps,
    explanation: `Array initialized with ${n} elements. Starting Bubble Sort.`,
    bars: makeBars()
  });

  for (let i = 0; i < n - 1; i++) {
    snapshots.push({
      step: step++,
      line: 3,
      comparisons,
      swaps,
      explanation: `Pass ${i + 1} of ${n - 1}: Placing next largest element into sorted position.`,
      bars: makeBars()
    });

    for (let j = 0; j < n - i - 1; j++) {
      // Comparison Step
      comparisons++;
      const needSwap = arr[j] > arr[j + 1];

      snapshots.push({
        step: step++,
        line: 5,
        comparisons,
        swaps,
        explanation: `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}). ${needSwap ? `${arr[j]} > ${arr[j + 1]}, swap required!` : 'In order, no swap.'}`,
        bars: makeBars([j, j + 1])
      });

      if (needSwap) {
        swaps++;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        snapshots.push({
          step: step++,
          line: 6,
          comparisons,
          swaps,
          explanation: `Swapped ${temp} and ${arr[j]}. New order: [${arr[j]}, ${arr[j + 1]}].`,
          bars: makeBars([], [j, j + 1])
        });
      }
    }

    sortedIndices.add(n - i - 1);
    snapshots.push({
      step: step++,
      line: 4,
      comparisons,
      swaps,
      explanation: `Pass ${i + 1} complete. Value ${arr[n - i - 1]} is now at its final sorted position.`,
      bars: makeBars()
    });
  }

  // First element is also sorted
  sortedIndices.add(0);

  // Final Step
  snapshots.push({
    step: step++,
    line: 1,
    comparisons,
    swaps,
    explanation: `Bubble Sort complete! All ${n} elements sorted with ${comparisons} comparisons and ${swaps} swaps.`,
    bars: makeBars()
  });

  return snapshots;
}
