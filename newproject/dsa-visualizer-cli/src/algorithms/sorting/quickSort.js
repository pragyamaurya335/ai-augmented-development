/**
 * Quick Sort Algorithm Definition and Snapshot Generator
 */

export const quickSortCode = [
  "function quickSort(arr, low, high) {",
  "  if (low < high) {",
  "    const pi = partition(arr, low, high);",
  "    quickSort(arr, low, pi - 1);",
  "    quickSort(arr, pi + 1, high);",
  "  }",
  "}",
  "function partition(arr, low, high) {",
  "  const pivot = arr[high];",
  "  let i = low - 1;",
  "  for (let j = low; j < high; j++) {",
  "    if (arr[j] < pivot) {",
  "      i++;",
  "      swap(arr, i, j);",
  "    }",
  "  }",
  "  swap(arr, i + 1, high);",
  "  return i + 1;",
  "}"
];

export const quickSortMeta = {
  id: 'quick',
  name: 'Quick Sort',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(log n)',
  description: 'Divide-and-conquer algorithm picking a pivot and partitioning elements smaller left, larger right.'
};

/**
 * Generates step snapshots for Quick Sort.
 * @param {number[]} initialArray
 * @returns {Array<object>}
 */
export function generateQuickSortSnapshots(initialArray = [5, 2, 8, 4, 1]) {
  const arr = [...initialArray];
  const n = arr.length;
  const snapshots = [];
  let step = 1;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = new Set();

  function makeBars(pivotIdx = null, comparingIdx = null, swappingIdxs = [], activeRange = null) {
    return arr.map((val, idx) => {
      let status = 'normal';
      if (sortedIndices.has(idx)) {
        status = 'sorted';
      } else if (swappingIdxs.includes(idx)) {
        status = 'swapping';
      } else if (idx === pivotIdx) {
        status = 'pivot';
      } else if (idx === comparingIdx) {
        status = 'comparing';
      } else if (activeRange && (idx < activeRange[0] || idx > activeRange[1])) {
        status = 'normal';
      }
      return { val, status };
    });
  }

  // Initial State
  snapshots.push({
    step: step++,
    line: 1,
    comparisons,
    swaps,
    explanation: `Array initialized with ${n} elements. Starting Quick Sort with Lomuto partitioning.`,
    bars: makeBars()
  });

  function partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;

    snapshots.push({
      step: step++,
      line: 9,
      comparisons,
      swaps,
      explanation: `Chosen pivot arr[${high}] = ${pivot}. Partitioning subarray [${low}..${high}].`,
      bars: makeBars(high, null, [], [low, high])
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      const isSmaller = arr[j] < pivot;

      snapshots.push({
        step: step++,
        line: 12,
        comparisons,
        swaps,
        explanation: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot}). ${isSmaller ? `${arr[j]} < ${pivot}, swapping into left partition.` : 'Greater than or equal, stays right.'}`,
        bars: makeBars(high, j, [], [low, high])
      });

      if (isSmaller) {
        i++;
        if (i !== j) {
          swaps++;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          snapshots.push({
            step: step++,
            line: 14,
            comparisons,
            swaps,
            explanation: `Swapped arr[${i}] (${arr[i]}) and arr[${j}] (${arr[j]}).`,
            bars: makeBars(high, null, [i, j], [low, high])
          });
        }
      }
    }

    // Place pivot in correct slot
    const pi = i + 1;
    if (pi !== high) {
      swaps++;
      const temp = arr[pi];
      arr[pi] = arr[high];
      arr[high] = temp;

      snapshots.push({
        step: step++,
        line: 17,
        comparisons,
        swaps,
        explanation: `Placed pivot ${arr[pi]} into its sorted slot at index ${pi}.`,
        bars: makeBars(pi, null, [pi, high], [low, high])
      });
    }

    sortedIndices.add(pi);

    snapshots.push({
      step: step++,
      line: 18,
      comparisons,
      swaps,
      explanation: `Pivot value ${arr[pi]} at index ${pi} is now sorted in place!`,
      bars: makeBars()
    });

    return pi;
  }

  function sort(low, high) {
    if (low < high) {
      snapshots.push({
        step: step++,
        line: 2,
        comparisons,
        swaps,
        explanation: `Dividing range [${low}..${high}].`,
        bars: makeBars(null, null, [], [low, high])
      });

      const pi = partition(low, high);

      sort(low, pi - 1);
      sort(pi + 1, high);
    } else if (low === high) {
      sortedIndices.add(low);
    }
  }

  sort(0, n - 1);

  // Mark all sorted
  for (let k = 0; k < n; k++) {
    sortedIndices.add(k);
  }

  // Final Step
  snapshots.push({
    step: step++,
    line: 1,
    comparisons,
    swaps,
    explanation: `Quick Sort complete! Array is sorted with ${comparisons} comparisons and ${swaps} swaps.`,
    bars: makeBars()
  });

  return snapshots;
}
