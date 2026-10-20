# 🎓 DSA Visualizer: Beginner's Complete Guide

Welcome! If you are a student learning JavaScript, Node.js, and Data Structures & Algorithms, this document is written for you. It explains **everything** we have built so far, why each piece exists, and how the code works under the hood.

---

## 📌 Table of Contents
1. [The Big Picture](#1-the-big-picture)
2. [Key Concepts to Understand First](#2-key-concepts-to-understand-first)
3. [The Project Structure](#3-the-project-structure)
4. [File-by-File Deep Dive](#4-file-by-file-deep-dive)
5. [How the Terminal (CLI) Version Works](#5-how-the-terminal-cli-version-works)
6. [How the Browser (Web) Version Works](#6-how-the-browser-web-version-works)
7. [Why and How We Wrote Automated Tests](#7-why-and-how-we-wrote-automated-tests)
8. [Commands Cheat Sheet](#8-commands-cheat-sheet)
9. [How Milestone 2 Works: The Playback Engine](#9-how-milestone-2-works-the-playback-engine)
10. [How Future Algorithms Provide Snapshots](#10-how-future-algorithms-provide-snapshots)
11. [How Milestone 3 Works: The Sorting Algorithms Suite](#11-how-milestone-3-works-the-sorting-algorithms-suite)
12. [Algorithm Comparison Matrix](#12-algorithm-comparison-matrix)
13. [What Comes Next in Milestone 4](#13-what-comes-next-in-milestone-4)

---

## 1. The Big Picture

### What are we building?
We are building a tool that helps you **learn algorithms visually**. 

Usually, when you run an algorithm in code, it finishes in a few milliseconds and you only see the final result. You never get to "see" what happened inside the loops.

Our visualizer solves that:
- On the **Left Panel**: You see the data structure (like an array of numbers represented as bars `████`).
- On the **Right Panel**: You see the actual JavaScript code. As the algorithm runs, the visualizer points to the exact line being executed and explains what that line is doing (e.g., *"Comparing 8 and 2"* or *"Swapping 8 and 2"*).
- On the **Bottom Bar**: You have step-by-step controls (`Next`, `Previous`, `Play`, `Pause`, `Reset`, and speed adjustment).

We built **two ways** to experience this:
1. **In your Terminal (CLI)**: Using a special library called `neo-blessed`.
2. **In your Browser**: Using a local web server with HTML, CSS, and JavaScript.

---

## 2. Key Concepts to Understand First

Before looking at the code, here are a few simple definitions:

### 1. Node.js
- **What is it?** Normally, JavaScript runs inside web browsers (like Chrome or Edge). Node.js is an engine that allows JavaScript to run directly on your computer's operating system (in PowerShell or Terminal), without needing a browser.
- **Why do we use it?** It allows us to read/write files, create terminal applications, and start local web servers.

### 2. ES Modules (`import` and `export`)
In older JavaScript, you used `require()` and `module.exports`. In modern JavaScript (ES Modules), we use:
- `export function myFunc() { ... }` $\rightarrow$ Share a function with other files.
- `import { myFunc } from './myFile.js'` $\rightarrow$ Bring that function into this file.
We enabled this by setting `"type": "module"` in `package.json`.

### 3. TUI (Terminal User Interface)
- A regular CLI just prints text line-by-line (like running `console.log`).
- A **TUI** turns the terminal into an interactive dashboard with bordered boxes, colors, and live keyboard interaction (like pressing `q` to quit or arrows to navigate).
 
### 4. What is `neo-blessed`?
`neo-blessed` is a Node.js library that manages terminal windows. It gives you "widgets" (boxes, buttons, text areas) and lets you position them using percentages (like `width: '55%'`).

---

## 3. The Project Structure

Here is how your project is organized:

```text
dsa-visualizer-cli/
├── package.json              # Project settings & dependencies list
├── .gitignore                # Tells Git which files to ignore (like node_modules)
├── index.js                  # The main launcher for the Terminal (CLI) version
├── server.js                 # The local Web Server that serves the Browser version
│
├── src/                      # Source code for the application
│   ├── algorithms/           # Algorithm implementations & snapshot generators (Milestone 3)
│   │   └── sorting/
│   │       ├── bubbleSort.js     # Bubble Sort implementation & generator
│   │       ├── selectionSort.js  # Selection Sort implementation & generator
│   │       ├── insertionSort.js  # Insertion Sort implementation & generator
│   │       ├── mergeSort.js      # Merge Sort implementation & generator
│   │       ├── quickSort.js      # Quick Sort implementation & generator
│   │       └── index.js          # Registry of all sorting algorithms & randomizer
│   │
│   ├── engine/               # Core playback and snapshot engine (Milestone 2)
│   │   ├── timeline.js           # Manages ordered snapshots and navigation
│   │   └── playbackController.js # Manages play/pause timer, speed, & events
│   │
│   ├── data/                 # Demonstration datasets
│   │   └── sampleBubbleSort.js   # Deterministic sample steps
│   │
│   └── ui/                   # Terminal user interface widgets (Milestone 1)
│       ├── screenManager.js      # Coordinates terminal screen, resizing, and exit
│       ├── visualizerPanel.js    # Left box (array bars, graphs, & tree states)
│       ├── codePanel.js          # Right box (code viewer with active pointer & explanation)
│       └── controlBar.js         # Bottom box (controls, counters, & status)
│
├── public/                   # Files for the Browser (Web) version
│   ├── index.html            # Web page structure
│   ├── style.css             # Dark-theme styling & glassmorphism
│   └── app.js                # Browser interactivity & animation logic
│
└── test/                     # Automated test suites
    ├── milestone1.test.js    # Tests layout boxes, resizing & getters
    ├── keyPressExit.test.js  # Tests that pressing 'q', 'Q', or 'Ctrl+C' exits cleanly
    ├── milestone2.test.js    # Tests timeline, playback loop, speed, & UI sync
    └── milestone3.test.js    # Tests all 5 sorting algorithms & switching
```

---

## 4. File-by-File Deep Dive

### 📄 `package.json`
Think of this as the "ID card" and instruction manual of your project:
- `"name": "dsa-visualizer-cli"`: The project name.
- `"type": "module"`: Tells Node.js to use modern `import` / `export` syntax.
- `"scripts"`: Shortcuts you can run from your terminal:
  - `npm.cmd start` $\rightarrow$ runs `node index.js` (CLI version).
  - `npm.cmd run web` $\rightarrow$ runs `node server.js` (Browser version).
  - `npm.cmd test` $\rightarrow$ runs our automated test suite.
- `"dependencies"`: Lists `neo-blessed`, the only external library we installed.

---

### 📄 `src/ui/visualizerPanel.js` (The Left Box)
- **Responsibility**: Creates the left container on the terminal screen.
- **How it works**:
  - Uses `blessed.box()` to create a box with:
    - `width: '55%'` (takes up 55% of the screen width).
    - `height: '100%-3'` (leaves 3 rows at the bottom for controls).
    - `border: { type: 'line' }` with a cyan color.
    - `tags: true`: Allows us to use blessed color tags like `{yellow-fg}Text{/yellow-fg}`.
  - Exposes two main helper functions:
    - `setContent(text)`: Changes the text inside the box and calls `screen.render()`.
    - `updateBounds(bounds)`: Changes its size/position dynamically when the window is resized.

---

### 📄 `src/ui/codePanel.js` (The Right Box)
- **Responsibility**: Displays source code with line numbers and highlights the currently executing line.
- **Key Function: `setCodeView(codeLines, activeLineNumber, explanation)`**:
  - Takes an array of code lines (e.g. `["function bubbleSort() {", "  ..."]`).
  - Loops over each line. If the line number equals `activeLineNumber`:
    - It prefixes it with `{yellow-fg}> {lineNum}{/yellow-fg}`.
    - It gives the code text a yellow background: `{black-fg}{yellow-bg} ... {/yellow-bg}`.
  - Appends the **Operation Explanation** at the bottom in cyan text.

---

### 📄 `src/ui/controlBar.js` (The Bottom Bar)
- **Responsibility**: Shows shortcuts and real-time statistics.
- **Key Function: `setStatus({ step, totalSteps, comparisons, swaps, speed, isPaused })`**:
  - Formats line 1: `Controls: [Space] Play/Pause | [→] Next | [←] Prev | [R] Reset | [Q] Quit`
  - Formats line 2: `Status: Step: 1/18 | Comparisons: 3 | Swaps: 1 | Speed: 1.0x [PAUSED]`
  - Renders it inside a 3-row box at `top: '100%-3'`.

---

### 📄 `src/ui/screenManager.js` (The Coordinator)
- **Responsibility**: Glues the three panels together, handles window resizing, and handles exit keys.
- **Important Code Details**:
  1. **Screen creation**:
     ```javascript
     const screen = blessed.screen({ smartCSR: true, title: 'DSA Visualizer CLI' });
     ```
     `smartCSR` stands for *Smart Clear Screen Redraw*. It prevents the terminal from flickering when updates happen.
  2. **Responsive Resizing (`handleResize`)**:
     - When you drag your terminal to make it smaller or larger, `screen.on('resize')` fires.
     - If the terminal width is **$\ge 80$ columns**: Panels sit side-by-side (55% left, 45% right).
     - If the terminal width is **$< 80$ columns**: It stacks them vertically (visualizer on top, code on bottom) so lines don't get squished and become unreadable!
  3. **Clean Exit (`cleanExit`)**:
     - Listens to `['q', 'Q', 'C-c']`.
     - When pressed, it destroys the screen and runs:
       ```javascript
       process.stdout.write('\x1b[?25h');
       process.exit(0);
       ```
       *Why `\x1b[?25h`?* When full-screen terminal programs run, they hide your blinking typing cursor. If you quit without restoring it, your terminal prompt will be missing its cursor! This special ANSI escape code forces the terminal to turn the cursor back on.

---

### 📄 `index.js` (The CLI Entry Point)
This is the file you run when you type `node index.js`.
- It calls `createScreenManager()`.
- It sets initial preview content on the left panel (the welcome banner and sample bars).
- It sets sample Bubble Sort code on the right panel with line 5 highlighted.
- It initializes the status bar.
- It calls `tui.render()` to paint everything onto your terminal.

---

## 5. How the Terminal (CLI) Version Works

When you run `node index.js`:
1. Node loads `neo-blessed`.
2. Blessed takes control of your terminal's standard output (`process.stdout`).
3. It uses **ANSI Escape Codes** (special invisible text commands like `\x1b[31m` for red text or `\x1b[2J` to clear the screen) to draw crisp borders (`┌`, `─`, `┐`, `│`).
4. It sets up an event listener on `process.stdin` (your keyboard) so that when you press `q`, it immediately exits cleanly.

---

## 6. How the Browser (Web) Version Works

When you requested to run it in the browser, we added a web layer:

### 1. `server.js` (Local HTTP Server)
- Built with **zero third-party dependencies** using Node’s built-in `http` and `fs` (file system) modules.
- When you open `http://localhost:3000` in your browser:
  - Your browser sends an HTTP request: `"GET /"`.
  - `server.js` reads `public/index.html` from your hard drive and sends it back with `Content-Type: text/html`.
  - When the browser sees `<link rel="stylesheet" href="style.css">`, it asks for `/style.css`, and `server.js` sends the stylesheet.

### 2. `public/index.html` & `public/style.css`
- Uses **CSS Grid** (`grid-template-columns: 55fr 45fr`) to create the exact same side-by-side panels.
- Uses a sleek dark color palette (`#0b0f19`) with glassmorphism (`backdrop-filter: blur(16px)`).
- Has media queries so that on mobile or narrow windows, it collapses into a single column.

### 3. `public/app.js`
- Contains an array of 10 sample step snapshots of Bubble Sort.
- Each snapshot defines:
  - Which line of code is active (`line: 5`).
  - What the array looks like at that instant (`[{ val: 4 }, { val: 8, status: 'comparing' }]`).
  - The explanation text.
- Provides functions:
  - `nextStep()`: Increments the index and redraws.
  - `prevStep()`: Decrements the index and redraws (backward stepping!).
  - `play()` / `pause()`: Uses `setTimeout` to automatically advance steps at the chosen speed (`0.5x`, `1.0x`, `2.0x`).
- Listens to both button clicks **and** keyboard events (`Space`, `ArrowRight`, `ArrowLeft`, `R`).

---

## 7. Why and How We Wrote Automated Tests

In software engineering, you never want to guess if your code works; you want proof.

We created two test files in the `test/` directory:

1. **`test/milestone1.test.js` (Unit & Layout Test)**:
   - Uses Node's built-in `node:assert` library.
   - Tests that all three widgets exist.
   - Tests that setting content actually stores the content.
   - Tests the resize logic by simulating wide screens (100 columns) and narrow screens (70 columns), making sure the panels resize properly.

2. **`test/keyPressExit.test.js` (Integration / Keyboard Test)**:
   - Launches `index.js` in a real child process using `node:child_process`.
   - Sends the character `'q'` into the running process's input.
   - Verifies that the program exits cleanly with code `0`.
   - Repeats the test with `Ctrl+C` (`\x03`).

When you run `npm.cmd test`, both test scripts run and confirm that everything is healthy.

---

## 8. Commands Cheat Sheet

Run these commands in PowerShell inside your project folder (`c:\Users\coding\Desktop\New folder\newproject\dsa-visualizer-cli`):
*(Tip: Type `cd newproject\dsa-visualizer-cli` first if you are in the root directory)*

| Task | Command |
| :--- | :--- |
| **Run the Terminal (CLI) visualizer** | `node index.js` |
| **Run the Browser (Web) version** | `npm.cmd run web` *(then open http://localhost:3000)* |
| **Run all Automated Tests** | `npm.cmd test` |
| **Check Git status** | `git status` |

### 🕹️ Interactive Terminal Keybindings
| Key | Action |
| :--- | :--- |
| **`[Space]`** | Play / Pause automatic step animation |
| **`[→]` / `[N]`** | Step forward one snapshot |
| **`[←]` / `[P]`** | Step backward one snapshot |
| **`[R]`** | Reset to Step 1 |
| **`[1]`** | Switch to **Bubble Sort** |
| **`[2]`** | Switch to **Selection Sort** |
| **`[3]`** | Switch to **Insertion Sort** |
| **`[4]`** | Switch to **Merge Sort** |
| **`[5]`** | Switch to **Quick Sort** |
| **`[M]`** | Cycle to the next algorithm in order |
| **`[G]`** | Generate and load a new randomized input array |
| **`[+]` / `[-]`** | Increase / Decrease playback speed |
| **`[Q]` / `Ctrl+C`** | Cleanly exit back to your prompt |

*(Note: On Windows PowerShell, if typing `npm` gives an execution policy error, always use `npm.cmd`)*

---

## 9. How Milestone 2 Works: The Playback Engine

In **Milestone 2**, we built the core engine that drives animations forward and backward while keeping all visual panels in 100% lockstep.

### The Architecture: Why Separate Timeline from Playback?
In clean software design, we separate **Data State** from **Playback Timing**:
1. **`Timeline` (`src/engine/timeline.js`)**:
   - Acts like a video tape. It holds an array of snapshots and knows where the current "playhead" is (`currentIndex`).
   - It has simple, pure methods: `next()`, `previous()`, `reset()`, `goTo(index)`, `hasNext()`, and `hasPrevious()`.
   - It doesn't know about timers, setInterval, or Blessed UI. It only cares about data and boundaries (never letting you step below 0 or beyond the last step).

2. **`PlaybackController` (`src/engine/playbackController.js`)**:
   - Acts like the remote control. It controls the `setInterval` timer loop.
   - It handles `play()`, `pause()`, `togglePlay()`, `reset()`, and `setSpeed()`.
   - **Key Safety Features**:
     - *No duplicate loops*: If you press Play multiple times, it ignores repeated calls so your playback speed doesn't spiral out of control.
     - *Automatic finish*: When playback reaches the final step, it automatically clears the timer and pauses.
     - *Boundary rewind*: If you hit Play when already at the end, it gracefully rewinds to Step 1 and plays from the start.
     - *Immediate speed changes*: Changing speed while playing dynamically re-arms the timer without interrupting playback.

3. **UI Synchronization (`controller.onUpdate(...)` in `index.js`)**:
   - The UI subscribes to the controller. Whenever a step changes:
     1. The **Left Panel** calls `renderBars(snapshot.bars)` to redraw the ASCII bars with colors (`Comparing`, `Swapping`, `Sorted`).
     2. The **Right Panel** calls `setCodeView(sampleCodeLines, snapshot.line, snapshot.explanation)` to place the `> ` pointer and yellow highlight on the executing code line.
     3. The **Bottom Bar** calls `setStatus(...)` to update the step counter (`Step: 5/10`), comparisons, swaps, and speed.
     4. Blessed renders the updated buffer to your terminal.
   - Because all three calls happen in the same single update callback, **the code pointer and visualization can never fall out of sync**.

---

## 10. How Future Algorithms Will Provide Snapshots

In upcoming milestones, you will write algorithms like **Selection Sort**, **Insertion Sort**, **Binary Search**, **Breadth-First Search (BFS)**, and **AVL Trees**.

Here is how any new algorithm plugs into this playback engine:

### Step 1: Define the Source Code
Write the algorithm code as an array of strings:
```javascript
export const binarySearchCode = [
  "function binarySearch(arr, target) {",
  "  let low = 0, high = arr.length - 1;",
  "  while (low <= high) {",
  "    const mid = Math.floor((low + high) / 2);",
  "    if (arr[mid] === target) return mid;",
  "    if (arr[mid] < target) low = mid + 1;",
  "    else high = mid - 1;",
  "  }",
  "  return -1;",
  "}"
];
```

### Step 2: Record Snapshots During Execution
Instead of simply executing the algorithm instantly, your algorithm function records a "snapshot" at each important operation:

```javascript
export function generateBinarySearchSnapshots(arr, target) {
  const snapshots = [];
  let low = 0;
  let high = arr.length - 1;

  // Snapshot 1: Function entry
  snapshots.push({
    line: 2, // Line 2 is executing
    explanation: `Initialized search range: low = ${low}, high = ${high}`,
    comparisons: 0,
    elements: arr.map((val, idx) => ({
      val,
      status: (idx >= low && idx <= high) ? 'active-range' : 'dimmed'
    }))
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    // Snapshot 2: Inspecting midpoint
    snapshots.push({
      line: 4, // Line 4: Calculate mid
      explanation: `Calculated midpoint at index ${mid} (value: ${arr[mid]})`,
      comparisons: 1,
      elements: arr.map((val, idx) => ({
        val,
        status: idx === mid ? 'comparing' : (idx >= low && idx <= high ? 'active-range' : 'dimmed')
      }))
    });

    if (arr[mid] === target) {
      // Snapshot 3: Target found!
      snapshots.push({
        line: 5,
        explanation: `Target ${target} found at index ${mid}!`,
        elements: arr.map((val, idx) => ({ val, status: idx === mid ? 'sorted' : 'dimmed' }))
      });
      break;
    }
    // ... continue for other branches
  }

  return snapshots;
}
```

### Step 3: Pass Snapshots to Timeline
```javascript
const snapshots = generateBinarySearchSnapshots([1, 3, 5, 7, 9, 11], 7);
const timeline = createTimeline(snapshots);
const controller = createPlaybackController(timeline);
```
That's it! Because the playback engine only cares about `{ line, explanation, ... }`, **any algorithm in the world can be animated with zero changes to the playback engine**.

---

## 11. How Milestone 3 Works: The Sorting Algorithms Suite

In **Milestone 3**, we implemented a comprehensive sorting algorithms suite under `src/algorithms/sorting/`:

### 1. The Algorithm Registry (`src/algorithms/sorting/index.js`)
All sorting algorithms share a common interface and are registered centrally:
- **`sortingAlgorithms`**: Array of algorithm definitions.
- **`getSortingAlgorithm(id)`**: Retrieves an algorithm by key (`'bubble'`, `'selection'`, `'insertion'`, `'merge'`, `'quick'`).
- **`generateRandomArray(size, min, max)`**: Generates randomized numeric test data on demand.

### 2. The Five Sorting Algorithms
1. **Bubble Sort (`bubbleSort.js`)**:
   - Compares adjacent pairs `arr[j]` and `arr[j+1]`.
   - Swaps them if out of order so larger values "bubble" to the end.
   - Highlights: `comparing` (yellow), `swapping` (magenta), `sorted` (green).

2. **Selection Sort (`selectionSort.js`)**:
   - Finds the minimum value across the unsorted subarray and places it at index `i`.
   - Highlights the current candidate minimum as `pivot` (cyan ★) while inspecting elements in `comparing` (yellow).

3. **Insertion Sort (`insertionSort.js`)**:
   - Picks element `arr[i]` as the `key` and shifts preceding elements rightward until finding its correct sorted position.
   - Highlights the key as `pivot` (cyan ★) and shifted elements as `swapping` (magenta ⇄).

4. **Merge Sort (`mergeSort.js`)**:
   - Divide-and-conquer algorithm splitting the array recursively at midpoints, then merging sorted halves.
   - Highlights the active subarray range being merged and elements being copied into position.

5. **Quick Sort (`quickSort.js`)**:
   - Selects a pivot element (Lomuto partitioning scheme) and partitions the array into values smaller than pivot (left) and greater (right).
   - Recursively sorts both sides. Highlights pivot in cyan (★) and swaps into position.

### 3. Dynamic Algorithm Switcher in the CLI
Pressing **`1`**, **`2`**, **`3`**, **`4`**, **`5`**, or **`M`** dynamically:
- Pauses any running playback timer.
- Re-generates snapshots for the newly chosen algorithm.
- Updates the left panel title with time and space complexity metrics.
- Replaces source code in the right panel and resets the playback timeline to Step 1.

---

## 12. Algorithm Comparison Matrix

| Algorithm | Best Time | Average Time | Worst Time | Space | Stable? | Key Characteristic |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Bubble Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes | Simple adjacent comparisons & bubble swaps. |
| **Selection Sort** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | No | Minimizes total number of write/swap operations. |
| **Insertion Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes | Extremely efficient on nearly-sorted data. |
| **Merge Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | Yes | Guaranteed $O(n \log n)$ performance with stable ordering. |
| **Quick Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | No | Cache-friendly in-place partitioning; industry standard. |

---

## 13. What Comes Next in Milestone 4

With the sorting suite and switcher complete, Milestone 4 will focus on:
1. **Interactive Custom Array Input**:
   - Allowing students to type their own numbers (e.g. `[12, 3, 45, 7]`) directly via a modal input box.
2. **Step-Back Execution History Graph**:
   - Visualizing the comparison vs swap timeline graph.
3. **Graph Traversal Visualizations**:
   - Introducing BFS and DFS on adjacency lists.
