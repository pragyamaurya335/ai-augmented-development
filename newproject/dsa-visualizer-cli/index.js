import { createScreenManager } from './src/ui/screenManager.js';
import { createTimeline } from './src/engine/timeline.js';
import { createPlaybackController } from './src/engine/playbackController.js';
import { sortingAlgorithms, generateRandomArray } from './src/algorithms/sorting/index.js';

/**
 * DSA Visualizer CLI - Milestone 3 Entry Point
 * Features:
 * - Full Sorting Suite: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort
 * - Interactive Algorithm Switcher ([1-5] or [M] to cycle)
 * - Dynamic Array Generator ([G] to generate new random array)
 * - Synchronized Code Viewer, ASCII Bar Display, and Playback Controls
 */
export function main() {
  const tui = createScreenManager({ title: 'DSA Visualizer CLI - Milestone 3' });

  let currentAlgoIndex = 0; // 0 = Bubble, 1 = Selection, 2 = Insertion, 3 = Merge, 4 = Quick
  let currentArray = [5, 2, 8, 4, 1, 7];

  function getCurrentAlgo() {
    return sortingAlgorithms[currentAlgoIndex];
  }

  // 1. Initialize Timeline with initial algorithm snapshots
  let initialSnapshots = getCurrentAlgo().generateSnapshots(currentArray);
  const timeline = createTimeline(initialSnapshots);

  // 2. Initialize Playback Controller (1.0x default speed, 1000ms step interval)
  const controller = createPlaybackController(timeline, {
    speed: 1.0,
    baseDelayMs: 1000
  });

  // Clean teardown on process exit
  process.on('exit', () => {
    controller.destroy();
  });

  /**
   * Switches the active algorithm and/or array, updating timeline and UI
   * @param {number} newIndex - Index in sortingAlgorithms
   * @param {number[]} [newArr] - Optional new input array
   */
  function loadAlgorithm(newIndex, newArr = null) {
    controller.pause();
    currentAlgoIndex = ((newIndex % sortingAlgorithms.length) + sortingAlgorithms.length) % sortingAlgorithms.length;
    if (Array.isArray(newArr) && newArr.length > 0) {
      currentArray = [...newArr];
    }
    const algo = getCurrentAlgo();
    const newSnapshots = algo.generateSnapshots(currentArray);
    timeline.loadSnapshots(newSnapshots);
    controller.reset();
  }

  // 3. Synchronize All UI Panels on Every Step / State Change
  controller.onUpdate((state) => {
    const snapshot = state.snapshot;
    if (!snapshot) return;
    const algo = getCurrentAlgo();

    // A. Update Left Panel: Show Algorithm Name, Complexities, and ASCII Bar Chart
    tui.panels.visualizer.setLabel(`[1] ${algo.name} (Time: ${algo.timeComplexity.average} | Space: ${algo.spaceComplexity})`);
    tui.panels.visualizer.renderBars(
      snapshot.bars,
      `${algo.name} [Step ${state.stepNumber}/${state.totalSteps}]`
    );

    // B. Update Right Panel: Show Algorithm Source, Highlight Active Line, and Operation Explanation
    tui.panels.code.setLabel(`[2] ${algo.name} Source Code`);
    tui.panels.code.setCodeView(
      algo.code,
      snapshot.line,
      snapshot.explanation
    );

    // C. Update Bottom Panel: Refresh status counters and play/pause badge
    let statusMsg = 'Ready';
    if (state.isPlaying) {
      statusMsg = `Playing ${algo.name}...`;
    } else if (state.isAtEnd) {
      statusMsg = 'Completed! [R] to reset or [1-5/M] next algo';
    } else {
      statusMsg = `Paused | [1-5/M] Switch Algo | [G] New Array`;
    }

    tui.panels.controls.setStatus({
      step: state.stepNumber,
      totalSteps: state.totalSteps,
      comparisons: snapshot.comparisons || 0,
      swaps: snapshot.swaps || 0,
      speed: state.speed,
      isPaused: !state.isPlaying,
      statusMessage: statusMsg
    });

    tui.render();
  });

  // 4. Interactive Keyboard Shortcuts
  // Play / Pause Toggle
  tui.onKey(['space'], () => controller.togglePlay());

  // Next Step
  tui.onKey(['right', 'n'], () => controller.next());

  // Previous Step
  tui.onKey(['left', 'p'], () => controller.previous());

  // Reset to Step 1
  tui.onKey(['r', 'R'], () => controller.reset());

  // Increase Speed
  tui.onKey(['+', '=', 'up'], () => controller.increaseSpeed());

  // Decrease Speed
  tui.onKey(['-', '_', 'down'], () => controller.decreaseSpeed());

  // Direct Algorithm Selection (Keys 1 to 5)
  tui.onKey(['1'], () => loadAlgorithm(0));
  tui.onKey(['2'], () => loadAlgorithm(1));
  tui.onKey(['3'], () => loadAlgorithm(2));
  tui.onKey(['4'], () => loadAlgorithm(3));
  tui.onKey(['5'], () => loadAlgorithm(4));

  // Cycle Algorithm (M / m)
  tui.onKey(['m', 'M', 'S-m'], () => {
    loadAlgorithm(currentAlgoIndex + 1);
  });

  // Generate New Random Array (G / g)
  tui.onKey(['g', 'G', 'S-g'], () => {
    const randomArr = generateRandomArray(6, 2, 9);
    loadAlgorithm(currentAlgoIndex, randomArr);
  });

  // 5. Initial layout calculation and render
  tui.handleResize();
  tui.render();

  return { tui, controller, timeline, loadAlgorithm, getCurrentAlgo };
}

// Only auto-run if executed directly as entry point
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  main();
}
