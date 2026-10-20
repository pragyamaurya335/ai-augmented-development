import blessed from 'neo-blessed';

/**
 * Creates the Bottom Control & Status Bar.
 * 
 * Displays:
 * 1. Playback keyboard shortcuts.
 * 2. Real-time counters (current step, total steps, comparisons, swaps, animation speed).
 * 
 * @param {blessed.screen} screen - The parent Blessed screen
 * @returns {object} Control bar controller
 */
export function createControlBar(screen) {
  const widget = blessed.box({
    parent: screen,
    top: '100%-3',
    left: 0,
    width: '100%',
    height: 3,
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: 'green'
      }
    },
    tags: true,
    padding: {
      left: 1,
      right: 1,
      top: 0,
      bottom: 0
    }
  });

  return {
    widget,

    /**
     * Updates the control bar stats and state
     * @param {object} state
     * @param {number} state.step - Current step index
     * @param {number} state.totalSteps - Total steps
     * @param {number} [state.comparisons=0] - Total comparisons count
     * @param {number} [state.swaps=0] - Total swaps/rotations count
     * @param {number} [state.speed=1.0] - Speed multiplier
     * @param {boolean} [state.isPaused=true] - Playback status
     * @param {string} [state.statusMessage=""] - Additional short status
     */
    setStatus({
      step = 0,
      totalSteps = 0,
      comparisons = 0,
      swaps = 0,
      speed = 1.0,
      isPaused = true,
      statusMessage = 'Ready'
    } = {}) {
      const playState = isPaused ? '{yellow-fg}[PAUSED]{/yellow-fg}' : '{green-fg}[PLAYING]{/green-fg}';

      const line1 = '{bold}Controls:{/bold} {cyan-fg}[Space]{/cyan-fg} Play/Pause │ ' +
                    '{cyan-fg}[→]{/cyan-fg} Next │ ' +
                    '{cyan-fg}[←]{/cyan-fg} Prev │ ' +
                    '{cyan-fg}[R]{/cyan-fg} Reset │ ' +
                    '{cyan-fg}[1-5/M]{/cyan-fg} Algo │ ' +
                    '{cyan-fg}[G]{/cyan-fg} New Array │ ' +
                    '{cyan-fg}[+/-]{/cyan-fg} Speed │ ' +
                    '{red-fg}[Q]{/red-fg} Quit';

      const line2 = `{bold}Status:{/bold} Step: {yellow-fg}${step}/${totalSteps}{/yellow-fg} │ ` +
                    `Comparisons: {cyan-fg}${comparisons}{/cyan-fg} │ ` +
                    `Swaps/Shifts: {magenta-fg}${swaps}{/magenta-fg} │ ` +
                    `Speed: {bold}${speed.toFixed(1)}x{/bold} ${playState} │ ` +
                    `{white-fg}${statusMessage}{/white-fg}`;

      widget.setContent(`${line1}\n${line2}`);
      screen.render();
    },

    /**
     * Sets raw custom message on the bar
     */
    setContent(text) {
      widget.setContent(text);
      screen.render();
    }
  };
}
