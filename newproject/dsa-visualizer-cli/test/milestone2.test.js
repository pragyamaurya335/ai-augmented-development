import assert from 'node:assert';
import { Timeline, createTimeline } from '../src/engine/timeline.js';
import { PlaybackController, createPlaybackController } from '../src/engine/playbackController.js';
import { sampleCodeLines, sampleSteps } from '../src/data/sampleBubbleSort.js';
import { createScreenManager } from '../src/ui/screenManager.js';

console.log('🧪 Starting Milestone 2 Playback Engine Automated Tests...\n');

// ============================================================================
// 1. Initial Playback State
// ============================================================================
{
  console.log('1. Testing Initial Playback State...');
  const timeline = createTimeline(sampleSteps);
  const controller = createPlaybackController(timeline, { speed: 1.0 });

  assert.strictEqual(timeline.getTotalSteps(), 10, 'Timeline should have 10 steps');
  assert.strictEqual(timeline.getCurrentIndex(), 0, 'Initial index should be 0');
  assert.strictEqual(timeline.isAtStart(), true, 'Should be at start initially');
  assert.strictEqual(timeline.isAtEnd(), false, 'Should not be at end initially');

  const snapshot = timeline.getCurrentSnapshot();
  assert(snapshot, 'Current snapshot should exist');
  assert.strictEqual(snapshot.step, 1, 'Initial snapshot should be step 1');
  assert.strictEqual(snapshot.line, 3, 'Initial snapshot should target line 3');

  const state = controller.getState();
  assert.strictEqual(state.isPlaying, false, 'Playback should initially be paused');
  assert.strictEqual(state.stepNumber, 1, 'Initial step number should be 1');
  assert.strictEqual(state.totalSteps, 10, 'Total steps should be 10');
  assert.strictEqual(state.speed, 1.0, 'Initial speed should be 1.0');

  controller.destroy();
  console.log('  ✔ Initial playback state verified');
}

// ============================================================================
// 2. Next and Previous Steps
// ============================================================================
{
  console.log('2. Testing Next and Previous Steps...');
  const timeline = createTimeline(sampleSteps);
  const controller = createPlaybackController(timeline);

  // Next step
  controller.next();
  assert.strictEqual(timeline.getCurrentIndex(), 1, 'Index should be 1 after next()');
  assert.strictEqual(controller.getState().stepNumber, 2, 'Step number should be 2');

  controller.next();
  assert.strictEqual(timeline.getCurrentIndex(), 2, 'Index should be 2 after second next()');
  assert.strictEqual(timeline.getCurrentSnapshot().line, 5, 'Step 3 should target line 5');

  // Previous step
  controller.previous();
  assert.strictEqual(timeline.getCurrentIndex(), 1, 'Index should return to 1 after previous()');

  controller.previous();
  assert.strictEqual(timeline.getCurrentIndex(), 0, 'Index should return to 0 after second previous()');
  assert.strictEqual(timeline.isAtStart(), true, 'Should be back at start');

  controller.destroy();
  console.log('  ✔ Next and previous navigation verified');
}

// ============================================================================
// 3. Boundary Handling
// ============================================================================
{
  console.log('3. Testing Boundary Handling...');
  const timeline = createTimeline(sampleSteps);
  const controller = createPlaybackController(timeline);

  // Boundary 1: Previous at beginning (index 0)
  controller.previous();
  controller.previous();
  assert.strictEqual(timeline.getCurrentIndex(), 0, 'Cannot step backwards past index 0');

  // Boundary 2: Next past end
  timeline.goTo(9);
  assert.strictEqual(timeline.isAtEnd(), true, 'Should be at end at index 9');
  controller.next();
  assert.strictEqual(timeline.getCurrentIndex(), 9, 'Cannot step forward past last index');

  // Boundary 3: goTo clamps out-of-range indices
  timeline.goTo(-10);
  assert.strictEqual(timeline.getCurrentIndex(), 0, 'Negative index clamps to 0');
  timeline.goTo(999);
  assert.strictEqual(timeline.getCurrentIndex(), 9, 'Out of bounds index clamps to totalSteps - 1');

  // Boundary 4: Empty Timeline safety
  const emptyTimeline = new Timeline([]);
  assert.strictEqual(emptyTimeline.getTotalSteps(), 0, 'Empty timeline has 0 steps');
  assert.strictEqual(emptyTimeline.getCurrentSnapshot(), null, 'Empty timeline snapshot is null');
  assert.strictEqual(emptyTimeline.isAtEnd(), true, 'Empty timeline isAtEnd is true');
  assert.strictEqual(emptyTimeline.hasNext(), false, 'Empty timeline has no next');
  assert.strictEqual(emptyTimeline.hasPrevious(), false, 'Empty timeline has no prev');
  emptyTimeline.next();
  emptyTimeline.previous();
  assert.strictEqual(emptyTimeline.getCurrentIndex(), 0, 'Empty timeline index remains 0');

  controller.destroy();
  console.log('  ✔ Boundary handling (beginning, end, clamps, empty timeline) verified');
}

// ============================================================================
// 4. Reset Operation
// ============================================================================
{
  console.log('4. Testing Reset Operation...');
  const timeline = createTimeline(sampleSteps);
  const controller = createPlaybackController(timeline);

  timeline.goTo(5);
  assert.strictEqual(timeline.getCurrentIndex(), 5);

  controller.reset();
  assert.strictEqual(timeline.getCurrentIndex(), 0, 'reset() must rewind to index 0');
  assert.strictEqual(timeline.isAtStart(), true, 'isAtStart must be true after reset');
  assert.strictEqual(controller.isPlaying(), false, 'Playback should be paused after reset');

  controller.destroy();
  console.log('  ✔ Reset functionality verified');
}

// ============================================================================
// 5. Play and Pause Loop
// ============================================================================
await (async () => {
  console.log('5. Testing Play and Pause...');
  const timeline = createTimeline(sampleSteps);
  // Fast speed with 40ms interval for automated test
  const controller = createPlaybackController(timeline, { speed: 1.0, baseDelayMs: 40 });

  let updateCount = 0;
  controller.onUpdate(() => {
    updateCount++;
  });

  controller.play();
  assert.strictEqual(controller.isPlaying(), true, 'isPlaying should be true after play()');

  // Wait 100ms for ~2 ticks
  await new Promise(res => setTimeout(res, 100));

  assert(timeline.getCurrentIndex() > 0, 'Timeline should advance automatically while playing');
  const indexBeforePause = timeline.getCurrentIndex();

  controller.pause();
  assert.strictEqual(controller.isPlaying(), false, 'isPlaying should be false after pause()');

  // Wait 80ms to ensure ticks stopped
  await new Promise(res => setTimeout(res, 80));
  assert.strictEqual(timeline.getCurrentIndex(), indexBeforePause, 'Timeline must not advance while paused');

  controller.destroy();
  console.log('  ✔ Play and pause loop verified');
})();

// ============================================================================
// 6. Playback Completion at End of Timeline
// ============================================================================
await (async () => {
  console.log('6. Testing Playback Completion at End...');
  const timeline = createTimeline(sampleSteps);
  const controller = createPlaybackController(timeline, { speed: 1.0, baseDelayMs: 30 });

  // Place timeline at penultimate step (index 8 of 10)
  timeline.goTo(8);
  assert.strictEqual(timeline.getCurrentIndex(), 8);

  controller.play();
  assert.strictEqual(controller.isPlaying(), true);

  // Wait 100ms for it to reach index 9 and stop
  await new Promise(res => setTimeout(res, 100));

  assert.strictEqual(timeline.getCurrentIndex(), 9, 'Timeline should reach the final index (9)');
  assert.strictEqual(timeline.isAtEnd(), true, 'Timeline should report isAtEnd === true');
  assert.strictEqual(controller.isPlaying(), false, 'Playback must automatically stop when reaching end');

  controller.destroy();
  console.log('  ✔ Automatic playback completion at end verified');
})();

// ============================================================================
// 7. Speed Changes
// ============================================================================
{
  console.log('7. Testing Speed Changes...');
  const timeline = createTimeline(sampleSteps);
  const controller = createPlaybackController(timeline, { speed: 1.0 });

  assert.strictEqual(controller.getSpeed(), 1.0);

  controller.setSpeed(2.0);
  assert.strictEqual(controller.getSpeed(), 2.0, 'Speed should update to 2.0');

  controller.increaseSpeed();
  assert.strictEqual(controller.getSpeed(), 3.0, 'increaseSpeed should advance to 3.0');

  controller.decreaseSpeed();
  assert.strictEqual(controller.getSpeed(), 2.0, 'decreaseSpeed should step back to 2.0');

  // Boundary clamping
  controller.setSpeed(100);
  assert.strictEqual(controller.getSpeed(), 4.0, 'Speed clamps at maximum 4.0');
  controller.setSpeed(0.01);
  assert.strictEqual(controller.getSpeed(), 0.25, 'Speed clamps at minimum 0.25');

  controller.destroy();
  console.log('  ✔ Speed adjustments and boundary clamping verified');
}

// ============================================================================
// 8. Repeated Play Calls (No Duplicate Loops)
// ============================================================================
await (async () => {
  console.log('8. Testing Repeated Play Calls Prevention...');
  const timeline = createTimeline(sampleSteps);
  const controller = createPlaybackController(timeline, { speed: 1.0, baseDelayMs: 50 });

  let tickCount = 0;
  controller.onUpdate(() => {
    tickCount++;
  });

  // Rapidly press Play 5 times
  controller.play();
  controller.play();
  controller.play();
  controller.play();
  controller.play();

  assert.strictEqual(controller.isPlaying(), true, 'Should be playing');

  // Record initial tick count
  const initialTicks = tickCount;

  // Wait 120ms (should be ~2 ticks, NOT 10 ticks)
  await new Promise(res => setTimeout(res, 120));

  controller.pause();
  const ticksAfter = tickCount - initialTicks;

  // In 120ms with 50ms interval, single timer produces 2-3 ticks.
  // 5 duplicate timers would produce 10-15 ticks.
  assert(ticksAfter <= 4, `Ticks observed (${ticksAfter}) should be <= 4, proving no duplicate timers`);

  controller.destroy();
  console.log('  ✔ Repeated Play calls do not spawn duplicate timer loops');
})();

// ============================================================================
// 9. Snapshot and Active-Line Synchronization with UI
// ============================================================================
{
  console.log('9. Testing Snapshot & Active-Line Synchronization with UI...');
  const tui = createScreenManager({ title: 'Sync Test Screen' });
  const timeline = createTimeline(sampleSteps);
  const controller = createPlaybackController(timeline);

  // Hook synchronization
  controller.onUpdate((state) => {
    const s = state.snapshot;
    tui.panels.visualizer.renderBars(s.bars, `Step ${state.stepNumber}`);
    tui.panels.code.setCodeView(sampleCodeLines, s.line, s.explanation);
    tui.panels.controls.setStatus({
      step: state.stepNumber,
      totalSteps: state.totalSteps,
      comparisons: s.comparisons,
      swaps: s.swaps,
      speed: state.speed,
      isPaused: !state.isPlaying
    });
  });

  // Verify Step 1: line 3, 0 comparisons, 0 swaps
  assert(tui.panels.code.widget.content.includes('>  3 │'), 'Line 3 should be marked active in step 1');
  assert(tui.panels.controls.widget.content.includes('Step: {yellow-fg}1/10{/yellow-fg}'), 'Control bar shows Step 1/10');
  assert(tui.panels.visualizer.widget.content.includes('Step 1'), 'Visualizer title shows Step 1');

  // Advance to Step 3: line 5, 1 comparison, comparing status
  timeline.goTo(2);
  controller.setSpeed(controller.getSpeed()); // triggers notify
  assert(tui.panels.code.widget.content.includes('>  5 │'), 'Line 5 should be marked active in step 3');
  assert(tui.panels.code.widget.content.includes('Comparing arr[0] (4) and arr[1] (8)'), 'Explanation matches step 3');
  assert(tui.panels.visualizer.widget.content.includes('Comparing'), 'Visualizer bars indicate Comparing');
  assert(tui.panels.controls.widget.content.includes('Comparisons: {cyan-fg}1{/cyan-fg}'), 'Comparisons count is 1');

  // Advance to Step 6: line 6, 2 comparisons, 1 swap, swapping status
  timeline.goTo(5);
  controller.setSpeed(controller.getSpeed());
  assert(tui.panels.code.widget.content.includes('>  6 │'), 'Line 6 should be marked active in step 6 (swap)');
  assert(tui.panels.code.widget.content.includes('Swapping arr[1] and arr[2]'), 'Explanation matches step 6');
  assert(tui.panels.visualizer.widget.content.includes('Swapping'), 'Visualizer bars indicate Swapping');
  assert(tui.panels.controls.widget.content.includes('Swaps/Shifts: {magenta-fg}1{/magenta-fg}'), 'Swaps count is 1');

  // Step backwards to Step 4: line 4
  timeline.goTo(3);
  controller.setSpeed(controller.getSpeed());
  assert(tui.panels.code.widget.content.includes('>  4 │'), 'Line 4 is active when stepping back to step 4');
  assert(tui.panels.controls.widget.content.includes('Step: {yellow-fg}4/10{/yellow-fg}'), 'Control bar shows Step 4/10');

  controller.destroy();
  tui.screen.destroy();
  console.log('  ✔ Synchronized updates across all 3 panels verified forwards and backwards');
}

console.log('\n🎉 ALL MILESTONE 2 TESTS PASSED SUCCESSFULLY!');
process.exit(0);
