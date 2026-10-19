import assert from 'node:assert';
import { createScreenManager } from '../src/ui/screenManager.js';

console.log('🧪 Starting Milestone 1 Automated Tests...');

// 1. Test TUI Initialization
const tui = createScreenManager({ title: 'Test Screen' });
assert(tui.screen, 'Screen should be created');
assert(tui.panels.visualizer, 'Visualizer panel should exist');
assert(tui.panels.code, 'Code panel should exist');
assert(tui.panels.controls, 'Control bar should exist');
console.log('  ✔ Panels and screen initialized properly');

// 2. Test Content Setters
tui.panels.visualizer.setContent('Test Visualizer Content');
assert.strictEqual(tui.panels.visualizer.widget.content, 'Test Visualizer Content');

const sampleCode = ['line1()', 'line2()', 'line3()'];
tui.panels.code.setCodeView(sampleCode, 2, 'Testing line 2 explanation');
assert(tui.panels.code.widget.content.includes('line2()'), 'Code content should contain line text');
assert(tui.panels.code.widget.content.includes('Testing line 2 explanation'), 'Code panel should include explanation');

tui.panels.controls.setStatus({
  step: 2,
  totalSteps: 10,
  comparisons: 5,
  swaps: 2,
  speed: 1.5,
  isPaused: false,
  statusMessage: 'Running test'
});
assert(tui.panels.controls.widget.content.includes('Step:'), 'Control bar should contain Step counter');
assert(tui.panels.controls.widget.content.includes('2/10'), 'Control bar should contain step count 2/10');
console.log('  ✔ Panel content and formatting setters verified');

// 3. Test Responsive Layout Engine
// Test Wide Screen (>= 80 cols): Should be side-by-side
tui.handleResize({ cols: 100, rows: 40 });
assert.strictEqual(tui.panels.visualizer.widget.position.width, '55%', 'Wide screen: Visualizer width should be 55%');
assert.strictEqual(tui.panels.code.widget.position.width, '45%', 'Wide screen: Code viewer width should be 45%');
assert.strictEqual(tui.panels.code.widget.position.left, '55%', 'Wide screen: Code viewer left position should be 55%');
console.log('  ✔ Wide-screen (>=80 cols) side-by-side layout verified');

// Test Narrow Screen (< 80 cols): Should be stacked vertically
tui.handleResize({ cols: 70, rows: 30 });
assert.strictEqual(tui.panels.visualizer.widget.position.width, '100%', 'Narrow screen: Visualizer should be 100% width');
assert.strictEqual(tui.panels.code.widget.position.width, '100%', 'Narrow screen: Code viewer should be 100% width');
assert.strictEqual(tui.panels.code.widget.position.left, 0, 'Narrow screen: Code viewer left position should be 0');
console.log('  ✔ Narrow-screen (<80 cols) stacked vertical layout verified');

// 4. Test Clean Exit & Teardown
assert(typeof tui.cleanExit === 'function', 'cleanExit function should be exposed');
tui.screen.destroy();
console.log('  ✔ Screen teardown clean');

console.log('\n🎉 ALL MILESTONE 1 TESTS PASSED SUCCESSFULLY!');
process.exit(0);
