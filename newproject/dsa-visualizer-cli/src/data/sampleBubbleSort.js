/**
 * Sample Bubble Sort demonstration dataset.
 * Reused for Milestone 2 playback engine demonstration and tests.
 */

export const sampleCodeLines = [
  "function bubbleSort(arr) {",
  "  const n = arr.length;",
  "  for (let i = 0; i < n; i++) {",
  "    for (let j = 0; j < n - i - 1; j++) {",
  "      if (arr[j] > arr[j + 1]) {",
  "        swap(arr, j, j + 1);",
  "      }",
  "    }",
  "  }",
  "}"
];

export const sampleSteps = [
  {
    step: 1,
    line: 3,
    comparisons: 0,
    swaps: 0,
    explanation: "Outer loop initialized (i = 0). Beginning first pass over the array.",
    bars: [
      { val: 4, status: 'normal' },
      { val: 8, status: 'normal' },
      { val: 2, status: 'normal' },
      { val: 6, status: 'normal' },
      { val: 9, status: 'normal' }
    ]
  },
  {
    step: 2,
    line: 4,
    comparisons: 0,
    swaps: 0,
    explanation: "Inner loop initialized (j = 0). Inspecting first pair.",
    bars: [
      { val: 4, status: 'normal' },
      { val: 8, status: 'normal' },
      { val: 2, status: 'normal' },
      { val: 6, status: 'normal' },
      { val: 9, status: 'normal' }
    ]
  },
  {
    step: 3,
    line: 5,
    comparisons: 1,
    swaps: 0,
    explanation: "Comparing arr[0] (4) and arr[1] (8). Since 4 < 8, no swap needed.",
    bars: [
      { val: 4, status: 'comparing' },
      { val: 8, status: 'comparing' },
      { val: 2, status: 'normal' },
      { val: 6, status: 'normal' },
      { val: 9, status: 'normal' }
    ]
  },
  {
    step: 4,
    line: 4,
    comparisons: 1,
    swaps: 0,
    explanation: "Advancing to next pair (j = 1).",
    bars: [
      { val: 4, status: 'normal' },
      { val: 8, status: 'normal' },
      { val: 2, status: 'normal' },
      { val: 6, status: 'normal' },
      { val: 9, status: 'normal' }
    ]
  },
  {
    step: 5,
    line: 5,
    comparisons: 2,
    swaps: 0,
    explanation: "Comparing arr[1] (8) and arr[2] (2). 8 > 2, so elements are out of order!",
    bars: [
      { val: 4, status: 'normal' },
      { val: 8, status: 'comparing' },
      { val: 2, status: 'comparing' },
      { val: 6, status: 'normal' },
      { val: 9, status: 'normal' }
    ]
  },
  {
    step: 6,
    line: 6,
    comparisons: 2,
    swaps: 1,
    explanation: "Swapping arr[1] and arr[2]. Values 8 and 2 trade positions.",
    bars: [
      { val: 4, status: 'normal' },
      { val: 2, status: 'swapping' },
      { val: 8, status: 'swapping' },
      { val: 6, status: 'normal' },
      { val: 9, status: 'normal' }
    ]
  },
  {
    step: 7,
    line: 5,
    comparisons: 3,
    swaps: 1,
    explanation: "Comparing arr[2] (8) and arr[3] (6). 8 > 6, so another swap is needed.",
    bars: [
      { val: 4, status: 'normal' },
      { val: 2, status: 'normal' },
      { val: 8, status: 'comparing' },
      { val: 6, status: 'comparing' },
      { val: 9, status: 'normal' }
    ]
  },
  {
    step: 8,
    line: 6,
    comparisons: 3,
    swaps: 2,
    explanation: "Swapping arr[2] and arr[3]. 8 bubbles toward the right.",
    bars: [
      { val: 4, status: 'normal' },
      { val: 2, status: 'normal' },
      { val: 6, status: 'swapping' },
      { val: 8, status: 'swapping' },
      { val: 9, status: 'normal' }
    ]
  },
  {
    step: 9,
    line: 5,
    comparisons: 4,
    swaps: 2,
    explanation: "Comparing arr[3] (8) and arr[4] (9). 8 < 9, no swap needed.",
    bars: [
      { val: 4, status: 'normal' },
      { val: 2, status: 'normal' },
      { val: 6, status: 'normal' },
      { val: 8, status: 'comparing' },
      { val: 9, status: 'comparing' }
    ]
  },
  {
    step: 10,
    line: 3,
    comparisons: 4,
    swaps: 2,
    explanation: "First pass complete! Largest value (9) has bubbled to its final sorted index.",
    bars: [
      { val: 4, status: 'normal' },
      { val: 2, status: 'normal' },
      { val: 6, status: 'normal' },
      { val: 8, status: 'normal' },
      { val: 9, status: 'sorted' }
    ]
  }
];
