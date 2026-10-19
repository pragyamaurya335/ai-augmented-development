import { spawn } from 'node:child_process';
import assert from 'node:assert';

function testKeyExit(keyToSend, keyName) {
  return new Promise((resolve, reject) => {
    console.log(`🧪 Testing interactive keyboard exit (${keyName})...`);

    const child = spawn(process.execPath, ['index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let exited = false;

    child.on('exit', (code, signal) => {
      exited = true;
      console.log(`  ✔ Process exited cleanly with code: ${code}, signal: ${signal}`);
      assert.strictEqual(code, 0, `Exit code should be 0 when ${keyName} is pressed`);
      resolve();
    });

    setTimeout(() => {
      console.log(`  -> Sending "${keyName}" to child process stdin...`);
      child.stdin.write(keyToSend);
    }, 1000);

    setTimeout(() => {
      if (!exited) {
        child.kill('SIGTERM');
        reject(new Error(`Test failed: Application did not exit after pressing ${keyName}`));
      }
    }, 5000);
  });
}

async function runAll() {
  await testKeyExit('q', 'q key');
  await testKeyExit('\x03', 'Ctrl+C');
  console.log('🎉 All interactive keyboard quit tests passed!\n');
  process.exit(0);
}

runAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
