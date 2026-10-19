import { createScreenManager } from './src/ui/screenManager.js';

/**
 * DSA Visualizer CLI - Milestone 1 Entry Point
 * Demonstrates the two-panel layout with blessed terminal UI.
 */
function main() {
  const tui = createScreenManager({ title: 'DSA Visualizer CLI - Milestone 1' });

  // 1. Populate Left Panel (Visualizer Preview)
  const leftWelcome = 
`{bold}{cyan-fg}=== Milestone 1: Visualizer Panel Ready ==={/cyan-fg}{/bold}

This panel is designated for dynamic data structure rendering:
  • {bold}Sorting Algorithms:{/bold} Visual array bars and swap animations.
  • {bold}Graph Algorithms:{/bold} BFS / DFS traversal paths & queue/stack state.
  • {bold}AVL Trees:{/bold} Hierarchical 2D ASCII branches & rotation states.

{yellow-fg}Sample Bar Preview (Coming in Milestone 3):{/yellow-fg}
  [0]  4 │ ████
  [1]  8 │ ████████ {bold}{yellow-fg}(Comparing){/yellow-fg}{/bold}
  [2]  2 │ ██       {bold}{yellow-fg}(Comparing){/yellow-fg}{/bold}
  [3]  6 │ ██████
  [4]  9 │ █████████ {green-fg}(Sorted){/green-fg}

{gray-fg}Ready for algorithm state rendering in upcoming milestones.{/gray-fg}`;

  tui.panels.visualizer.setContent(leftWelcome);

  // 2. Populate Right Panel (Code Viewer Preview)
  const sampleCode = [
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

  tui.panels.code.setCodeView(
    sampleCode,
    5, // Highlight line 5 for demonstration
    "Currently comparing arr[j] and arr[j + 1]. In Milestone 2 & 3, this pointer advances dynamically in sync with the visualizer!"
  );

  // 3. Populate Bottom Status Bar
  tui.panels.controls.setStatus({
    step: 1,
    totalSteps: 18,
    comparisons: 3,
    swaps: 1,
    speed: 1.0,
    isPaused: true,
    statusMessage: "Milestone 1 Layout Active - Press [q] to exit"
  });

  // Initial layout calculation and render
  tui.handleResize();
  tui.render();
}

main();
