import { bubbleSortCode, bubbleSortMeta, generateBubbleSortSnapshots } from './bubbleSort.js';
import { selectionSortCode, selectionSortMeta, generateSelectionSortSnapshots } from './selectionSort.js';
import { insertionSortCode, insertionSortMeta, generateInsertionSortSnapshots } from './insertionSort.js';
import { mergeSortCode, mergeSortMeta, generateMergeSortSnapshots } from './mergeSort.js';
import { quickSortCode, quickSortMeta, generateQuickSortSnapshots } from './quickSort.js';

export const sortingAlgorithms = [
  {
    ...bubbleSortMeta,
    code: bubbleSortCode,
    generateSnapshots: generateBubbleSortSnapshots
  },
  {
    ...selectionSortMeta,
    code: selectionSortCode,
    generateSnapshots: generateSelectionSortSnapshots
  },
  {
    ...insertionSortMeta,
    code: insertionSortCode,
    generateSnapshots: generateInsertionSortSnapshots
  },
  {
    ...mergeSortMeta,
    code: mergeSortCode,
    generateSnapshots: generateMergeSortSnapshots
  },
  {
    ...quickSortMeta,
    code: quickSortCode,
    generateSnapshots: generateQuickSortSnapshots
  }
];

export const sortingAlgorithmsMap = new Map(
  sortingAlgorithms.map(algo => [algo.id, algo])
);

/**
 * Retrieves algorithm object by ID or returns Bubble Sort as fallback.
 * @param {string} id
 */
export function getSortingAlgorithm(id) {
  return sortingAlgorithmsMap.get(id) || sortingAlgorithms[0];
}

/**
 * Generates a randomized array of positive integers.
 * @param {number} [size=6]
 * @param {number} [min=2]
 * @param {number} [max=10]
 * @returns {number[]}
 */
export function generateRandomArray(size = 6, min = 2, max = 10) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return arr;
}
