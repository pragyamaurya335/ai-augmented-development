/**
 * Merge Sort Algorithm Definition and Snapshot Generator
 */

export const mergeSortCode = [
  "function mergeSort(arr, l, r) {",
  "  if (l < r) {",
  "    const m = Math.floor((l + r) / 2);",
  "    mergeSort(arr, l, m);",
  "    mergeSort(arr, m + 1, r);",
  "    merge(arr, l, m, r);",
  "  }",
  "}",
  "function merge(arr, l, m, r) {",
  "  const left = arr.slice(l, m + 1);",
  "  const right = arr.slice(m + 1, r + 1);",
  "  let i = 0, j = 0, k = l;",
  "  while (i < left.length && j < right.length) {",
  "    if (left[i] <= right[j]) arr[k++] = left[i++];",
  "    else arr[k++] = right[j++];",
  "  }",
  "  while (i < left.length) arr[k++] = left[i++];",
  "  while (j < right.length) arr[k++] = right[j++];",
  "}"
];

export const mergeSortMeta = {
  id: 'merge',
  name: 'Merge Sort',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)'
  },
  spaceComplexity: 'O(n)',
  description: 'Stable divide-and-conquer algorithm that recursively splits and merges sorted subarrays.'
};

/**
 * Generates step snapshots for Merge Sort.
 * @param {number[]} initialArray
 * @returns {Array<object>}
 */
export function generateMergeSortSnapshots(initialArray = [5, 2, 8, 4, 1]) {
  const arr = [...initialArray];
  const n = arr.length;
  const snapshots = [];
  let step = 1;
  let comparisons = 0;
  let assignments = 0;
  let fullySorted = false;

  function makeBars(activeSubarray = null, comparingIdxs = [], targetIdx = null) {
    return arr.map((val, idx) => {
      let status = 'normal';
      if (fullySorted) {
        status = 'sorted';
      } else if (idx === targetIdx) {
        status = 'swapping'; // Merged value placed into position
      } else if (comparingIdxs.includes(idx)) {
        status = 'comparing';
      } else if (activeSubarray && idx >= activeSubarray[0] && idx <= activeSubarray[1]) {
        status = 'pivot'; // Active subarray being merged
      }
      return { val, status };
    });
  }

  // Initial State
  snapshots.push({
    step: step++,
    line: 1,
    comparisons,
    swaps: assignments,
    explanation: `Array initialized with ${n} elements. Starting recursive Merge Sort.`,
    bars: makeBars()
  });

  function merge(l, m, r) {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);

    snapshots.push({
      step: step++,
      line: 10,
      comparisons,
      swaps: assignments,
      explanation: `Merging left subarray [${left.join(', ')}] and right subarray [${right.join(', ')}].`,
      bars: makeBars([l, r])
    });

    let i = 0;
    let j = 0;
    let k = l;

    while (i < left.length && j < right.length) {
      comparisons++;
      const takeLeft = left[i] <= right[j];

      snapshots.push({
        step: step++,
        line: 14,
        comparisons,
        swaps: assignments,
        explanation: `Comparing left[${i}] (${left[i]}) with right[${j}] (${right[j]}). ${takeLeft ? `Taking ${left[i]} from left.` : `Taking ${right[j]} from right.`}`,
        bars: makeBars([l, r], [l + i, m + 1 + j])
      });

      if (takeLeft) {
        arr[k] = left[i];
        assignments++;
        i++;
      } else {
        arr[k] = right[j];
        assignments++;
        j++;
      }

      snapshots.push({
        step: step++,
        line: 14,
        comparisons,
        swaps: assignments,
        explanation: `Wrote ${arr[k]} into arr[${k}].`,
        bars: makeBars([l, r], [], k)
      });

      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      assignments++;
      snapshots.push({
        step: step++,
        line: 17,
        comparisons,
        swaps: assignments,
        explanation: `Flushing remaining left element ${left[i]} into arr[${k}].`,
        bars: makeBars([l, r], [], k)
      });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      assignments++;
      snapshots.push({
        step: step++,
        line: 18,
        comparisons,
        swaps: assignments,
        explanation: `Flushing remaining right element ${right[j]} into arr[${k}].`,
        bars: makeBars([l, r], [], k)
      });
      j++;
      k++;
    }

    snapshots.push({
      step: step++,
      line: 6,
      comparisons,
      swaps: assignments,
      explanation: `Subarray [${l}..${r}] successfully merged: [${arr.slice(l, r + 1).join(', ')}].`,
      bars: makeBars([l, r])
    });
  }

  function sort(l, r) {
    if (l < r) {
      const m = Math.floor((l + r) / 2);

      snapshots.push({
        step: step++,
        line: 3,
        comparisons,
        swaps: assignments,
        explanation: `Dividing subarray [${l}..${r}] at midpoint index ${m}.`,
        bars: makeBars([l, r])
      });

      sort(l, m);
      sort(m + 1, r);
      merge(l, m, r);
    }
  }

  sort(0, n - 1);

  fullySorted = true;

  // Final Step
  snapshots.push({
    step: step++,
    line: 1,
    comparisons,
    swaps: assignments,
    explanation: `Merge Sort complete! Array sorted with ${comparisons} comparisons and ${assignments} assignments.`,
    bars: makeBars()
  });

  return snapshots;
}
