/**
 * Selection Sort Algorithm Definition and Snapshot Generator
 */

export const selectionSortCode = [
  "function selectionSort(arr) {",
  "  const n = arr.length;",
  "  for (let i = 0; i < n - 1; i++) {",
  "    let minIdx = i;",
  "    for (let j = i + 1; j < n; j++) {",
  "      if (arr[j] < arr[minIdx]) {",
  "        minIdx = j;",
  "      }",
  "    }",
  "    if (minIdx !== i) swap(arr, i, minIdx);",
  "  }",
  "}"
];

export const selectionSortMeta = {
  id: 'selection',
  name: 'Selection Sort',
  timeComplexity: {
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(1)',
  description: 'Finds the minimum element from the unsorted part and puts it at the beginning.'
};

/**
 * Generates step snapshots for Selection Sort.
 * @param {number[]} initialArray
 * @returns {Array<object>}
 */
export function generateSelectionSortSnapshots(initialArray = [5, 2, 8, 4, 1]) {
  const arr = [...initialArray];
  const n = arr.length;
  const snapshots = [];
  let step = 1;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = new Set();

  function makeBars(minIdx = null, comparingIdx = null, swappingIdxs = []) {
    return arr.map((val, idx) => {
      let status = 'normal';
      if (sortedIndices.has(idx)) {
        status = 'sorted';
      } else if (swappingIdxs.includes(idx)) {
        status = 'swapping';
      } else if (idx === minIdx) {
        status = 'pivot'; // Represents candidate minimum
      } else if (idx === comparingIdx) {
        status = 'comparing';
      }
      return { val, status };
    });
  }

  // Initial State
  snapshots.push({
    step: step++,
    line: 2,
    comparisons,
    swaps,
    explanation: `Selection Sort initialized with ${n} elements.`,
    bars: makeBars()
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    snapshots.push({
      step: step++,
      line: 4,
      comparisons,
      swaps,
      explanation: `Iteration ${i + 1}: Assuming initial minimum is arr[${i}] (${arr[i]}).`,
      bars: makeBars(minIdx)
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      const isSmaller = arr[j] < arr[minIdx];

      snapshots.push({
        step: step++,
        line: 6,
        comparisons,
        swaps,
        explanation: `Comparing arr[${j}] (${arr[j]}) with current min arr[${minIdx}] (${arr[minIdx]}). ${isSmaller ? 'New minimum found!' : 'Not smaller.'}`,
        bars: makeBars(minIdx, j)
      });

      if (isSmaller) {
        minIdx = j;
        snapshots.push({
          step: step++,
          line: 7,
          comparisons,
          swaps,
          explanation: `Updated candidate minimum to arr[${minIdx}] (${arr[minIdx]}).`,
          bars: makeBars(minIdx)
        });
      }
    }

    if (minIdx !== i) {
      swaps++;
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      snapshots.push({
        step: step++,
        line: 10,
        comparisons,
        swaps,
        explanation: `Swapping minimum element ${arr[i]} into its sorted slot index ${i}.`,
        bars: makeBars(null, null, [i, minIdx])
      });
    }

    sortedIndices.add(i);
    snapshots.push({
      step: step++,
      line: 3,
      comparisons,
      swaps,
      explanation: `Index ${i} (value ${arr[i]}) is now sorted.`,
      bars: makeBars()
    });
  }

  sortedIndices.add(n - 1);

  // Final Step
  snapshots.push({
    step: step++,
    line: 1,
    comparisons,
    swaps,
    explanation: `Selection Sort complete! Sorted ${n} elements with ${comparisons} comparisons and ${swaps} swaps.`,
    bars: makeBars()
  });

  return snapshots;
}
