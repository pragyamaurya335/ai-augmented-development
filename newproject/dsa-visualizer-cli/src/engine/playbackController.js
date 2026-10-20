/**
 * Playback Controller
 * 
 * Orchestrates playback loop (play, pause, next, previous, reset, speed adjustments)
 * over a Timeline instance and notifies subscribers on each step/state change.
 */
export class PlaybackController {
  /**
   * @param {import('./timeline.js').Timeline} timeline - The timeline to control
   * @param {object} [options={}]
   * @param {number} [options.speed=1.0] - Speed multiplier (e.g. 0.5, 1.0, 2.0)
   * @param {number} [options.baseDelayMs=1000] - Base delay in milliseconds at 1.0x speed
   */
  constructor(timeline, options = {}) {
    if (!timeline) {
      throw new Error('PlaybackController requires a valid Timeline instance.');
    }

    this.timeline = timeline;
    this.speed = Math.max(0.25, Math.min(Number(options.speed) || 1.0, 4.0));
    this.baseDelayMs = Number(options.baseDelayMs) || 1000;
    this.timer = null;
    this.listeners = [];
  }

  /**
   * Returns current playback speed multiplier.
   * @returns {number}
   */
  getSpeed() {
    return this.speed;
  }

  /**
   * Sets playback speed multiplier (clamped between 0.25x and 4.0x).
   * If playback is currently active, restarts the timer with the updated interval immediately.
   * @param {number} speed
   */
  setSpeed(speed) {
    const val = Number(speed);
    if (Number.isNaN(val) || val <= 0) return;

    this.speed = Math.max(0.25, Math.min(val, 4.0));

    if (this.isPlaying()) {
      // Re-arm timer with new interval so speed change takes effect immediately
      this._stopTimer();
      this._startTimer();
    }

    this._notify();
  }

  /**
   * Increases playback speed by standard increments.
   */
  increaseSpeed() {
    const presets = [0.25, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0];
    const next = presets.find(s => s > this.speed + 0.01);
    if (next) {
      this.setSpeed(next);
    }
  }

  /**
   * Decreases playback speed by standard increments.
   */
  decreaseSpeed() {
    const presets = [0.25, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0];
    const prev = [...presets].reverse().find(s => s < this.speed - 0.01);
    if (prev) {
      this.setSpeed(prev);
    }
  }

  /**
   * Checks whether automatic playback is currently running.
   * @returns {boolean}
   */
  isPlaying() {
    return this.timer !== null;
  }

  /**
   * Starts automatic step playback.
   * Prevents duplicate timers if called while already playing.
   */
  play() {
    // 1. Prevent duplicate playback loops when Play is pressed repeatedly
    if (this.isPlaying()) {
      return;
    }

    // 2. If already at the end of the timeline, rewind to the first step before starting
    if (this.timeline.isAtEnd()) {
      this.timeline.reset();
      this._notify();
    }

    // 3. Start the interval loop
    this._startTimer();
    this._notify();
  }

  /**
   * Pauses automatic playback.
   */
  pause() {
    if (!this.isPlaying()) {
      return;
    }
    this._stopTimer();
    this._notify();
  }

  /**
   * Toggles between play and pause.
   */
  togglePlay() {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Steps forward once. Manual stepping pauses automatic playback.
   */
  next() {
    this.pause();
    if (this.timeline.hasNext()) {
      this.timeline.next();
      this._notify();
    }
  }

  /**
   * Steps backward once. Manual stepping pauses automatic playback.
   */
  previous() {
    this.pause();
    if (this.timeline.hasPrevious()) {
      this.timeline.previous();
      this._notify();
    }
  }

  /**
   * Resets timeline to step 1 (index 0) and pauses automatic playback.
   */
  reset() {
    this.pause();
    this.timeline.reset();
    this._notify();
  }

  /**
   * Subscribes a callback to receive state updates whenever step or playback changes.
   * The listener is immediately invoked with the current state.
   * @param {Function} callback - Receives current state object
   * @returns {Function} Unsubscribe function
   */
  onUpdate(callback) {
    if (typeof callback !== 'function') return () => {};

    this.listeners.push(callback);
    // Initial notification for subscriber
    callback(this.getState());

    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Compiles the current snapshot and playback metrics.
   * @returns {object}
   */
  getState() {
    const snapshot = this.timeline.getCurrentSnapshot();
    const currentIndex = this.timeline.getCurrentIndex();
    const totalSteps = this.timeline.getTotalSteps();
    const isAtEnd = this.timeline.isAtEnd();
    const isAtStart = this.timeline.isAtStart();

    return {
      snapshot,
      currentIndex,
      stepNumber: totalSteps > 0 ? currentIndex + 1 : 0,
      totalSteps,
      isPlaying: this.isPlaying(),
      isAtEnd,
      isAtStart,
      speed: this.speed
    };
  }

  /**
   * Calculates tick delay in milliseconds based on current speed.
   * @private
   */
  _getIntervalMs() {
    return Math.max(50, Math.round(this.baseDelayMs / this.speed));
  }

  /**
   * Internal timer starter.
   * @private
   */
  _startTimer() {
    this._stopTimer();
    this.timer = setInterval(() => {
      if (this.timeline.hasNext()) {
        this.timeline.next();
        this._notify();

        // If we reached the final step, stop playback automatically
        if (this.timeline.isAtEnd()) {
          this._stopTimer();
          this._notify();
        }
      } else {
        // Timeline finished
        this._stopTimer();
        this._notify();
      }
    }, this._getIntervalMs());
  }

  /**
   * Internal timer clearer.
   * @private
   */
  _stopTimer() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Broadcasts current state to all subscribers.
   * @private
   */
  _notify() {
    const state = this.getState();
    for (const listener of this.listeners) {
      try {
        listener(state);
      } catch (err) {
        // Prevent subscriber error from breaking playback loop
        console.error('Error in playback subscriber listener:', err);
      }
    }
  }

  /**
   * Cleans up timers and clears listeners.
   */
  destroy() {
    this._stopTimer();
    this.listeners = [];
  }
}

/**
 * Factory helper function to instantiate a PlaybackController.
 * @param {import('./timeline.js').Timeline} timeline
 * @param {object} [options={}]
 * @returns {PlaybackController}
 */
export function createPlaybackController(timeline, options = {}) {
  return new PlaybackController(timeline, options);
}
