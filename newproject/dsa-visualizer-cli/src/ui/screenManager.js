import blessed from 'neo-blessed';
import { createVisualizerPanel } from './visualizerPanel.js';
import { createCodePanel } from './codePanel.js';
import { createControlBar } from './controlBar.js';

/**
 * ScreenManager orchestrates the blessed screen, responsive dual-panel layout,
 * terminal resize events, and clean shutdown handling.
 */
export function createScreenManager(options = {}) {
  // Initialize the master blessed screen
  const screen = blessed.screen({
    smartCSR: true,
    title: options.title || 'DSA Visualizer CLI',
    autoPadding: true,
    warnings: true
  });

  // Create our three modular widgets
  const visualizer = createVisualizerPanel(screen);
  const code = createCodePanel(screen);
  const controls = createControlBar(screen);

  /**
   * Adjusts panel dimensions dynamically based on terminal dimensions.
   * If width is under 80 columns, stack panels vertically so text remains readable.
   * If width is 80 or above, use side-by-side layout (55% visualizer, 45% code).
   */
  function handleResize(forcedDims = {}) {
    const cols = forcedDims.cols ?? screen.cols ?? (process.stdout.columns || 80);
    const rows = forcedDims.rows ?? screen.rows ?? (process.stdout.rows || 24);

    if (cols < 80) {
      // Narrow screen: Stacked Layout
      const topHeight = Math.max(5, Math.floor((rows - 3) * 0.5));
      visualizer.updateBounds({
        top: 0,
        left: 0,
        width: '100%',
        height: topHeight
      });
      code.updateBounds({
        top: topHeight,
        left: 0,
        width: '100%',
        height: Math.max(5, rows - 3 - topHeight)
      });
    } else {
      // Wide screen: Side-by-Side Dual-Panel Layout
      visualizer.updateBounds({
        top: 0,
        left: 0,
        width: '55%',
        height: '100%-3'
      });
      code.updateBounds({
        top: 0,
        left: '55%',
        width: '45%',
        height: '100%-3'
      });
    }

    screen.render();
  }

  // Listen to terminal resize event
  screen.on('resize', handleResize);

  /**
   * Graceful exit handler.
   * Restores terminal cursor and clears blessed screen buffer.
   */
  function cleanExit() {
    try {
      screen.destroy();
    } catch {
      // Ignore any errors during screen teardown
    }
    // Ensure cursor is visible upon return to shell
    process.stdout.write('\x1b[?25h');
    process.exit(0);
  }

  // Register global quit keys (q, Q, and Ctrl+C)
  screen.key(['q', 'Q', 'C-c'], cleanExit);

  return {
    screen,
    panels: {
      visualizer,
      code,
      controls
    },
    handleResize,
    cleanExit,

    /**
     * Re-renders the terminal screen
     */
    render() {
      screen.render();
    },

    /**
     * Registers a custom key handler on the screen
     */
    onKey(keys, callback) {
      screen.key(keys, callback);
    }
  };
}
