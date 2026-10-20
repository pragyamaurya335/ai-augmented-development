/**
 * Insertion Sort Algorithm Definition and Snapshot Generator
 */

export const insertionSortCode = [
  "function insertionSort(arr) {",
  "  const n = arr.length;",
  "  for (let i = 1; i < n; i++) {",
  "    let key = arr[i];",
  "    let j = i - 1;",
  "    while (j >= 0 && arr[j] > key) {",
  "      arr[j + 1] = arr[j];",
  "      j--;",
  "    }",
  "    arr[j + 1] = key;",
  "  }",
  "}"
];

export const insertionSortMeta = {
  id: 'insertion',
  name: 'Insertion Sort',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(1)',
  description: 'Builds the sorted array one item at a time by repeatedly shifting larger elements right.'
};

/**
 * Generates step snapshots for Insertion Sort.
 * @param {number[]} initialArray
 * @returns {Array<object>}
 */
export function generateInsertionSortSnapshots(initialArray = [5, 2, 8, 4, 1]) {
  const arr = [...initialArray];
  const n = arr.length;
  const snapshots = [];
  let step = 1;
  let comparisons = 0;
  let shifts = 0;
  let sortedBoundary = 0; // index up to which subarray is sorted

  function makeBars(keyIdx = null, comparingIdx = null, shiftingIdx = null) {
    return arr.map((val, idx) => {
      let status = 'normal';
      if (idx === keyIdx) {
        status = 'pivot'; // The active key to insert
      } else if (idx === shiftingIdx) {
        status = 'swapping'; // Actively being shifted
      } else if (idx === comparingIdx) {
        status = 'comparing';
      } else if (idx <= sortedBoundary && keyIdx === null) {
        status = 'sorted';
      }
      return { val, status };
    });
  }

  // Initial State
  snapshots.push({
    step: step++,
    line: 2,
    comparisons,
    swaps: shifts,
    explanation: `Array initialized with ${n} elements. Index 0 ([${arr[0]}]) is considered sorted.`,
    bars: makeBars()
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    snapshots.push({
      step: step++,
      line: 4,
      comparisons,
      swaps: shifts,
      explanation: `Picking key = ${key} at index ${i} to insert into sorted left subarray [0..${i - 1}].`,
      bars: makeBars(i)
    });

    while (j >= 0) {
      comparisons++;
      const isGreater = arr[j] > key;

      snapshots.push({
        step: step++,
        line: 6,
        comparisons,
        swaps: shifts,
        explanation: `Comparing key (${key}) with sorted element arr[${j}] (${arr[j]}). ${isGreater ? `${arr[j]} > ${key}, shifting ${arr[j]} right.` : `${arr[j]} <= ${key}, insertion slot found.`}`,
        bars: makeBars(j + 1, j)
      });

      if (isGreater) {
        shifts++;
        arr[j + 1] = arr[j];

        snapshots.push({
          step: step++,
          line: 7,
          comparisons,
          swaps: shifts,
          explanation: `Shifted ${arr[j]} from index ${j} to index ${j + 1}.`,
          bars: makeBars(null, null, j + 1)
        });

        j--;
      } else {
        break;
      }
    }

    arr[j + 1] = key;
    sortedBoundary = i;

    snapshots.push({
      step: step++,
      line: 10,
      comparisons,
      swaps: shifts,
      explanation: `Inserted key ${key} at index ${j + 1}. Subarray [0..${i}] is now sorted.`,
      bars: makeBars()
    });
  }

  // Final State
  snapshots.push({
    step: step++,
    line: 1,
    comparisons,
    swaps: shifts,
    explanation: `Insertion Sort complete! Sorted ${n} elements with ${comparisons} comparisons and ${shifts} shifts.`,
    bars: arr.map(val => ({ val, status: 'sorted' }))
  });

  return snapshots;
}
