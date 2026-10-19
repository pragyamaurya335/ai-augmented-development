// Algorithm Code Definition
const sampleCodeLines = [
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

// Interactive Preview Steps for Milestone 1
const sampleSteps = [
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

// App State
let currentStepIdx = 0;
let isPlaying = false;
let playTimer = null;
let playbackSpeed = 1.0;

// DOM Elements
const codeContainer = document.getElementById('codeContainer');
const explanationText = document.getElementById('explanationText');
const sampleBars = document.getElementById('sampleBars');
const statStep = document.getElementById('statStep');
const statComparisons = document.getElementById('statComparisons');
const statSwaps = document.getElementById('statSwaps');
const statState = document.getElementById('statState');
const btnPlayPause = document.getElementById('btnPlayPause');
const playIcon = document.getElementById('playIcon');
const playLabel = document.getElementById('playLabel');
const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev');
const btnReset = document.getElementById('btnReset');
const speedButtons = document.querySelectorAll('.speed-btn');

// Render Code Lines
function renderCode(activeLineNum) {
  codeContainer.innerHTML = '';
  sampleCodeLines.forEach((lineText, idx) => {
    const lineNum = idx + 1;
    const row = document.createElement('div');
    row.className = `code-line ${lineNum === activeLineNum ? 'active' : ''}`;

    const numSpan = document.createElement('span');
    numSpan.className = 'line-num';
    numSpan.textContent = lineNum;

    const textSpan = document.createElement('span');
    textSpan.className = 'line-text';
    textSpan.textContent = lineText;

    row.appendChild(numSpan);
    row.appendChild(textSpan);
    codeContainer.appendChild(row);
  });
}

// Render Bars
function renderBars(bars) {
  sampleBars.innerHTML = '';
  bars.forEach((bar, idx) => {
    const row = document.createElement('div');
    row.className = `bar-row ${bar.status}`;

    const indexSpan = document.createElement('span');
    indexSpan.className = 'bar-index';
    indexSpan.textContent = `[${idx}]`;

    const valSpan = document.createElement('span');
    valSpan.className = 'bar-val';
    valSpan.textContent = bar.val;

    const fillDiv = document.createElement('div');
    fillDiv.className = 'bar-fill';
    fillDiv.style.width = `${bar.val * 10}px`;

    row.appendChild(indexSpan);
    row.appendChild(valSpan);
    row.appendChild(fillDiv);

    if (bar.status === 'comparing') {
      const tag = document.createElement('span');
      tag.className = 'action-tag yellow';
      tag.textContent = 'Comparing';
      row.appendChild(tag);
    } else if (bar.status === 'swapping') {
      const tag = document.createElement('span');
      tag.className = 'action-tag yellow';
      tag.textContent = 'Swapping';
      row.appendChild(tag);
    } else if (bar.status === 'sorted') {
      const tag = document.createElement('span');
      tag.className = 'action-tag green';
      tag.textContent = 'Sorted';
      row.appendChild(tag);
    }

    sampleBars.appendChild(row);
  });
}

// Update UI to current step
function updateUI() {
  const current = sampleSteps[currentStepIdx];
  renderCode(current.line);
  renderBars(current.bars);
  explanationText.textContent = current.explanation;

  statStep.textContent = `${current.step}/${sampleSteps.length}`;
  statComparisons.textContent = current.comparisons;
  statSwaps.textContent = current.swaps;

  statState.textContent = isPlaying ? '[PLAYING]' : '[PAUSED]';
  statState.style.color = isPlaying ? '#4ade80' : '#facc15';
  statState.style.background = isPlaying ? 'rgba(74, 222, 128, 0.15)' : 'rgba(250, 204, 21, 0.15)';

  playIcon.textContent = isPlaying ? '⏸' : '▶';
  playLabel.textContent = isPlaying ? 'Pause' : 'Play';
}

// Step Controls
function nextStep() {
  if (currentStepIdx < sampleSteps.length - 1) {
    currentStepIdx++;
    updateUI();
  } else {
    pause();
  }
}

function prevStep() {
  if (currentStepIdx > 0) {
    currentStepIdx--;
    updateUI();
  }
}

function resetSteps() {
  pause();
  currentStepIdx = 0;
  updateUI();
}

function play() {
  if (currentStepIdx >= sampleSteps.length - 1) {
    currentStepIdx = 0;
  }
  isPlaying = true;
  updateUI();
  scheduleNext();
}

function pause() {
  isPlaying = false;
  if (playTimer) {
    clearTimeout(playTimer);
    playTimer = null;
  }
  updateUI();
}

function togglePlay() {
  if (isPlaying) {
    pause();
  } else {
    play();
  }
}

function scheduleNext() {
  if (!isPlaying) return;
  const delay = 1000 / playbackSpeed;
  playTimer = setTimeout(() => {
    if (currentStepIdx < sampleSteps.length - 1) {
      nextStep();
      scheduleNext();
    } else {
      pause();
    }
  }, delay);
}

// Event Listeners
btnPlayPause.addEventListener('click', togglePlay);
btnNext.addEventListener('click', () => { pause(); nextStep(); });
btnPrev.addEventListener('click', () => { pause(); prevStep(); });
btnReset.addEventListener('click', resetSteps);

speedButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    speedButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    playbackSpeed = parseFloat(btn.dataset.speed);
  });
});

// Keyboard Hotkeys (matching CLI)
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    togglePlay();
  } else if (e.code === 'ArrowRight') {
    e.preventDefault();
    pause();
    nextStep();
  } else if (e.code === 'ArrowLeft') {
    e.preventDefault();
    pause();
    prevStep();
  } else if (e.code === 'KeyR') {
    e.preventDefault();
    resetSteps();
  }
});

// Initial Render
updateUI();
