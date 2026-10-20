import blessed from 'neo-blessed';

/**
 * Creates the Left Panel: Data Structure & Algorithm Visualizer.
 * 
 * In subsequent milestones, this panel will render:
 * - Sorting: animated bars / values
 * - Graphs: node connections, active node, traversal order
 * - AVL Trees: hierarchical ASCII tree with balance factors & rotation highlights
 * 
 * @param {blessed.screen} screen - The parent Blessed screen
 * @returns {object} Panel controller with update methods
 */
export function createVisualizerPanel(screen) {
  const widget = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '55%',
    height: '100%-3',
    label: ' [1] Data Structure / Algorithm Visualization ',
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: 'cyan'
      },
      label: {
        fg: 'cyan',
        bold: true
      }
    },
    tags: true, // Allows blessed color tags like {cyan-fg}...{/cyan-fg}
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
     * Updates the text/graph content displayed in the panel
     * @param {string} text - Formatted or styled text
     */
    setContent(text) {
      widget.setContent(text);
      screen.render();
    },

    /**
     * Formats and displays an array of bars with status highlights
     * @param {Array<{val: number, status: string}>} bars
     * @param {string} [title=""]
     */
    renderBars(bars = [], title = '') {
      let output = '';
      if (title) {
        output += `{bold}{cyan-fg}=== ${title} ==={/cyan-fg}{/bold}\n\n`;
      }

      if (!Array.isArray(bars) || bars.length === 0) {
        output += '{gray-fg}(No visual elements for this step){/gray-fg}\n';
      } else {
        bars.forEach((item, idx) => {
          const val = item.val;
          const bar = '█'.repeat(Math.max(1, Math.min(val, 40)));
          const status = item.status || 'normal';

          let tagOpen = '';
          let tagClose = '';
          let badge = '';

          if (status === 'comparing') {
            tagOpen = '{bold}{yellow-fg}';
            tagClose = '{/yellow-fg}{/bold}';
            badge = ' {bold}{yellow-fg}◀ Comparing{/yellow-fg}{/bold}';
          } else if (status === 'swapping') {
            tagOpen = '{bold}{magenta-fg}';
            tagClose = '{/magenta-fg}{/bold}';
            badge = ' {bold}{magenta-fg}⇄ Swapping{/magenta-fg}{/bold}';
          } else if (status === 'pivot') {
            tagOpen = '{bold}{cyan-fg}';
            tagClose = '{/cyan-fg}{/bold}';
            badge = ' {bold}{cyan-fg}★ Pivot/Active{/cyan-fg}{/bold}';
          } else if (status === 'sorted') {
            tagOpen = '{bold}{green-fg}';
            tagClose = '{/green-fg}{/bold}';
            badge = ' {bold}{green-fg}✔ Sorted{/green-fg}{/bold}';
          } else {
            tagOpen = '{white-fg}';
            tagClose = '{/white-fg}';
          }

          const padIdx = `[${idx}]`.padEnd(5, ' ');
          const padVal = String(val).padStart(2, ' ');
          output += `  ${padIdx} ${padVal} │ ${tagOpen}${bar}${tagClose}${badge}\n`;
        });

        output += '\n{gray-fg}Legend: {white-fg}Normal{/white-fg} │ {yellow-fg}Comparing{/yellow-fg} │ {magenta-fg}Swapping{/magenta-fg} │ {cyan-fg}Pivot/Active{/cyan-fg} │ {green-fg}Sorted{/green-fg}{/gray-fg}\n';
      }

      widget.setContent(output);
      screen.render();
    },

    /**
     * Updates the label at the top of the box border
     * @param {string} label - New panel title
     */
    setLabel(label) {
      widget.setLabel(` ${label} `);
      screen.render();
    },

    /**
     * Repositions widget dynamically (used during screen resize)
     */
    updateBounds(bounds) {
      if (bounds.top !== undefined) widget.top = bounds.top;
      if (bounds.left !== undefined) widget.left = bounds.left;
      if (bounds.width !== undefined) widget.width = bounds.width;
      if (bounds.height !== undefined) widget.height = bounds.height;
    }
  };
}
