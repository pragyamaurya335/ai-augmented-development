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
