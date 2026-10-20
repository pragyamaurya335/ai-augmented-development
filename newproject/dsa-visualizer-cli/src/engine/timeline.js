/**
 * Timeline Engine
 * 
 * Stores and navigates an ordered sequence of algorithm execution snapshots.
 * Each snapshot contains:
 * - visualization data (e.g. array bars, graph nodes)
 * - active line number in the source code
 * - contextual explanation of the current operation
 * - performance statistics (comparisons, swaps, etc.)
 */
export class Timeline {
  /**
   * Initializes the timeline with an optional list of snapshots.
   * @param {Array<object>} [snapshots=[]] - Array of algorithm step snapshots
   */
  constructor(snapshots = []) {
    this.snapshots = Array.isArray(snapshots) ? [...snapshots] : [];
    this.currentIndex = 0;
  }

  /**
   * Replaces current snapshots with a new list and resets pointer to 0.
   * @param {Array<object>} snapshots
   */
  loadSnapshots(snapshots = []) {
    this.snapshots = Array.isArray(snapshots) ? [...snapshots] : [];
    this.currentIndex = 0;
  }

  /**
   * Appends a new step snapshot to the timeline.
   * @param {object} snapshot
   */
  addSnapshot(snapshot) {
    if (snapshot && typeof snapshot === 'object') {
      this.snapshots.push(snapshot);
    }
  }

  /**
   * Returns total number of steps in the timeline.
   * @returns {number}
   */
  getTotalSteps() {
    return this.snapshots.length;
  }

  /**
   * Returns current 0-based step index.
   * @returns {number}
   */
  getCurrentIndex() {
    return this.currentIndex;
  }

  /**
   * Returns the snapshot object at current position.
   * @returns {object|null}
   */
  getCurrentSnapshot() {
    if (this.snapshots.length === 0) {
      return null;
    }
    return this.snapshots[this.currentIndex] || null;
  }

  /**
   * Checks if there is a next step available.
   * @returns {boolean}
   */
  hasNext() {
    return this.currentIndex < this.snapshots.length - 1;
  }

  /**
   * Checks if there is a previous step available.
   * @returns {boolean}
   */
  hasPrevious() {
    return this.currentIndex > 0;
  }

  /**
   * Checks if current position is the very first step.
   * @returns {boolean}
   */
  isAtStart() {
    return this.currentIndex === 0;
  }

  /**
   * Checks if current position is the last step (or if timeline is empty).
   * @returns {boolean}
   */
  isAtEnd() {
    if (this.snapshots.length === 0) {
      return true;
    }
    return this.currentIndex === this.snapshots.length - 1;
  }

  /**
   * Advances one step forward if possible.
   * @returns {object|null} The snapshot at the new position
   */
  next() {
    if (this.hasNext()) {
      this.currentIndex++;
    }
    return this.getCurrentSnapshot();
  }

  /**
   * Moves one step backward if possible.
   * @returns {object|null} The snapshot at the new position
   */
  previous() {
    if (this.hasPrevious()) {
      this.currentIndex--;
    }
    return this.getCurrentSnapshot();
  }

  /**
   * Resets playback position back to the first step (index 0).
   * @returns {object|null}
   */
  reset() {
    this.currentIndex = 0;
    return this.getCurrentSnapshot();
  }

  /**
   * Jumps directly to a given 0-based index with boundary clamping.
   * @param {number} index
   * @returns {object|null}
   */
  goTo(index) {
    if (this.snapshots.length === 0) {
      this.currentIndex = 0;
      return null;
    }
    const target = Number(index);
    if (Number.isNaN(target)) {
      return this.getCurrentSnapshot();
    }
    const clampedIndex = Math.max(0, Math.min(target, this.snapshots.length - 1));
    this.currentIndex = clampedIndex;
    return this.getCurrentSnapshot();
  }
}

/**
 * Factory helper function to instantiate a Timeline.
 * @param {Array<object>} snapshots
 * @returns {Timeline}
 */
export function createTimeline(snapshots = []) {
  return new Timeline(snapshots);
}
