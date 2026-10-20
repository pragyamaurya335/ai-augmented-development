import assert from 'node:assert';
import {
  sortingAlgorithms,
  sortingAlgorithmsMap,
  getSortingAlgorithm,
  generateRandomArray
} from '../src/algorithms/sorting/index.js';
import { generateBubbleSortSnapshots } from '../src/algorithms/sorting/bubbleSort.js';
import { generateSelectionSortSnapshots } from '../src/algorithms/sorting/selectionSort.js';
import { generateInsertionSortSnapshots } from '../src/algorithms/sorting/insertionSort.js';
import { generateMergeSortSnapshots } from '../src/algorithms/sorting/mergeSort.js';
import { generateQuickSortSnapshots } from '../src/algorithms/sorting/quickSort.js';
import { main } from '../index.js';

console.log('🧪 Starting Milestone 3 Sorting Suite Automated Tests...\n');

const testArray = [5, 2, 8, 4, 1];
const expectedSorted = [1, 2, 4, 5, 8];

// 1. Test Registry Completeness
console.log('1. Testing Algorithm Registry...');
assert.strictEqual(sortingAlgorithms.length, 5, 'Should have 5 sorting algorithms registered');
const expectedIds = ['bubble', 'selection', 'insertion', 'merge', 'quick'];
expectedIds.forEach(id => {
  const algo = getSortingAlgorithm(id);
  assert(algo, `Algorithm with id "${id}" should exist in registry`);
  assert(algo.name, `Algorithm "${id}" should have a human-readable name`);
  assert(Array.isArray(algo.code), `Algorithm "${id}" should have code lines array`);
  assert.strictEqual(typeof algo.generateSnapshots, 'function', `Algorithm "${id}" should have generateSnapshots function`);
  assert(algo.timeComplexity.average, `Algorithm "${id}" should have timeComplexity defined`);
});
console.log('  ✔ All 5 sorting algorithms registered with valid metadata');

// 2. Test Bubble Sort Generator
console.log('2. Testing Bubble Sort Generator...');
{
  const snapshots = generateBubbleSortSnapshots(testArray);
  assert(snapshots.length > 5, 'Bubble Sort should generate multiple steps');
  const finalSnapshot = snapshots[snapshots.length - 1];
  const finalVals = finalSnapshot.bars.map(b => b.val);
  assert.deepStrictEqual(finalVals, expectedSorted, 'Bubble sort must correctly sort elements');
  assert(finalSnapshot.bars.every(b => b.status === 'sorted'), 'All bars in final snapshot must be sorted');
  assert(snapshots.some(s => s.comparisons > 0), 'Bubble sort should record comparisons');
  console.log('  ✔ Bubble Sort correctly generates valid snapshots and sorts array');
}

// 3. Test Selection Sort Generator
console.log('3. Testing Selection Sort Generator...');
{
  const snapshots = generateSelectionSortSnapshots(testArray);
  assert(snapshots.length > 5, 'Selection Sort should generate multiple steps');
  const finalSnapshot = snapshots[snapshots.length - 1];
  const finalVals = finalSnapshot.bars.map(b => b.val);
  assert.deepStrictEqual(finalVals, expectedSorted, 'Selection sort must correctly sort elements');
  assert(finalSnapshot.bars.every(b => b.status === 'sorted'), 'All bars in final snapshot must be sorted');
  assert(snapshots.some(s => s.bars.some(b => b.status === 'pivot')), 'Selection sort should highlight candidate minimum as pivot');
  console.log('  ✔ Selection Sort correctly generates valid snapshots and sorts array');
}

// 4. Test Insertion Sort Generator
console.log('4. Testing Insertion Sort Generator...');
{
  const snapshots = generateInsertionSortSnapshots(testArray);
  assert(snapshots.length > 5, 'Insertion Sort should generate multiple steps');
  const finalSnapshot = snapshots[snapshots.length - 1];
  const finalVals = finalSnapshot.bars.map(b => b.val);
  assert.deepStrictEqual(finalVals, expectedSorted, 'Insertion sort must correctly sort elements');
  assert(finalSnapshot.bars.every(b => b.status === 'sorted'), 'All bars in final snapshot must be sorted');
  console.log('  ✔ Insertion Sort correctly generates valid snapshots and sorts array');
}

// 5. Test Merge Sort Generator
console.log('5. Testing Merge Sort Generator...');
{
  const snapshots = generateMergeSortSnapshots(testArray);
  assert(snapshots.length > 5, 'Merge Sort should generate multiple steps');
  const finalSnapshot = snapshots[snapshots.length - 1];
  const finalVals = finalSnapshot.bars.map(b => b.val);
  assert.deepStrictEqual(finalVals, expectedSorted, 'Merge sort must correctly sort elements');
  assert(finalSnapshot.bars.every(b => b.status === 'sorted'), 'All bars in final snapshot must be sorted');
  console.log('  ✔ Merge Sort correctly generates valid snapshots and sorts array');
}

// 6. Test Quick Sort Generator
console.log('6. Testing Quick Sort Generator...');
{
  const snapshots = generateQuickSortSnapshots(testArray);
  assert(snapshots.length > 5, 'Quick Sort should generate multiple steps');
  const finalSnapshot = snapshots[snapshots.length - 1];
  const finalVals = finalSnapshot.bars.map(b => b.val);
  assert.deepStrictEqual(finalVals, expectedSorted, 'Quick sort must correctly sort elements');
  assert(finalSnapshot.bars.every(b => b.status === 'sorted'), 'All bars in final snapshot must be sorted');
  assert(snapshots.some(s => s.bars.some(b => b.status === 'pivot')), 'Quick sort should highlight pivot');
  console.log('  ✔ Quick Sort correctly generates valid snapshots and sorts array');
}

// 7. Test Random Array Generator
console.log('7. Testing Random Array Generator...');
{
  const arr = generateRandomArray(8, 3, 12);
  assert.strictEqual(arr.length, 8, 'Array length should be 8');
  assert(arr.every(v => v >= 3 && v <= 12), 'All values should fall within min/max bounds');
  console.log('  ✔ Random array generator verified');
}

// 8. Test Dynamic Switching in App Integration
console.log('8. Testing Dynamic Algorithm Switching in Main App...');
{
  const app = main();
  assert(app.tui, 'Main app initializes TUI');
  assert.strictEqual(app.getCurrentAlgo().id, 'bubble', 'Initial algorithm is bubble sort');

  // Switch to Selection Sort (index 1)
  app.loadAlgorithm(1);
  assert.strictEqual(app.getCurrentAlgo().id, 'selection', 'Switched to selection sort');
  assert(app.tui.panels.visualizer.widget.content.includes('Selection Sort'), 'Visualizer content reflects Selection Sort');
  assert(app.tui.panels.code.widget.content.includes('selectionSort'), 'Code viewer reflects Selection Sort');

  // Switch to Merge Sort (index 3)
  app.loadAlgorithm(3);
  assert.strictEqual(app.getCurrentAlgo().id, 'merge', 'Switched to merge sort');
  assert(app.tui.panels.visualizer.widget.content.includes('Merge Sort'), 'Visualizer content reflects Merge Sort');

  // Switch to Quick Sort (index 4) with a custom randomized array
  app.loadAlgorithm(4, [9, 3, 7, 1]);
  assert.strictEqual(app.getCurrentAlgo().id, 'quick', 'Switched to quick sort');
  assert(app.tui.panels.visualizer.widget.content.includes('Quick Sort'), 'Visualizer content reflects Quick Sort');

  app.controller.destroy();
  app.tui.screen.destroy();
  console.log('  ✔ Dynamic algorithm switching and UI rebinding verified');
}

console.log('\n🎉 ALL MILESTONE 3 TESTS PASSED SUCCESSFULLY!');
process.exit(0);
