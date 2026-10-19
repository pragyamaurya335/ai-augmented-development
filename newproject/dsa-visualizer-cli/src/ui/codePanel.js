import blessed from 'neo-blessed';

/**
 * Creates the Right Panel: Algorithm Code Viewer.
 * 
 * Displays:
 * 1. Formatted algorithm source code with line numbers.
 * 2. Visual indicator ('>') and background highlight on the logically active line.
 * 3. Contextual explanation section at the bottom explaining the active operation.
 * 
 * @param {blessed.screen} screen - The parent Blessed screen
 * @returns {object} Panel controller with update methods
 */
export function createCodePanel(screen) {
  const widget = blessed.box({
    parent: screen,
    top: 0,
    left: '55%',
    width: '45%',
    height: '100%-3',
    label: ' [2] Algorithm Code Viewer ',
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: 'yellow'
      },
      label: {
        fg: 'yellow',
        bold: true
      }
    },
    tags: true,
    scrollable: true,
    alwaysScroll: true,
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
     * Formats and sets code with line numbers and active line highlighting
     * @param {string[]} codeLines - Array of code strings (1-indexed for user display)
     * @param {number} activeLineNumber - 1-indexed line number to highlight
     * @param {string} [explanation=""] - Explanation text describing the active step
     */
    setCodeView(codeLines = [], activeLineNumber = null, explanation = '') {
      let output = '';

      if (codeLines.length > 0) {
        output += '{bold}{underline}Algorithm Source / Pseudocode:{/underline}{/bold}\n\n';

        codeLines.forEach((lineText, index) => {
          const lineNumber = index + 1;
          const pad = lineNumber < 10 ? ' ' : '';

          if (lineNumber === activeLineNumber) {
            // Highlight the currently executing line
            output += `{bold}{yellow-fg}> ${pad}${lineNumber} │{/yellow-fg} {black-fg}{yellow-bg} ${lineText} {/yellow-bg}{/bold}\n`;
          } else {
            // Inactive line
            output += `  ${pad}${lineNumber} │ {white-fg}${lineText}{/white-fg}\n`;
          }
        });
      }

      if (explanation) {
        output += '\n{bold}{underline}Operation Explanation:{/underline}{/bold}\n';
        output += `{cyan-fg}${explanation}{/cyan-fg}\n`;
      }

      widget.setContent(output);
      screen.render();
    },

    /**
     * Sets raw content directly in the panel
     * @param {string} text - Formatted content
     */
    setContent(text) {
      widget.setContent(text);
      screen.render();
    },

    /**
     * Updates widget bounds dynamically during screen resize
     */
    updateBounds(bounds) {
      if (bounds.top !== undefined) widget.top = bounds.top;
      if (bounds.left !== undefined) widget.left = bounds.left;
      if (bounds.width !== undefined) widget.width = bounds.width;
      if (bounds.height !== undefined) widget.height = bounds.height;
    }
  };
}
