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
9. [What We Will Build in Milestone 2](#9-what-we-will-build-in-milestone-2)

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
├── src/                      # Source code for the Terminal CLI
│   └── ui/
│       ├── screenManager.js  # The "brain" coordinating the terminal screen & resizing
│       ├── visualizerPanel.js# Left box (where bars, graphs & trees will show)
│       ├── codePanel.js      # Right box (code viewer with line numbers & pointer)
│       └── controlBar.js     # Bottom box (controls & counters)
│
├── public/                   # Files for the Browser (Web) version
│   ├── index.html            # Web page structure
│   ├── style.css             # Dark-theme styling & glassmorphism
│   └── app.js                # Browser interactivity & animation logic
│
└── test/                     # Automated tests verifying our code works
    ├── milestone1.test.js    # Tests layout boxes, resizing & getters
    └── keyPressExit.test.js  # Tests that pressing 'q' or 'Ctrl+C' exits cleanly
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

*(Note: On Windows PowerShell, if typing `npm` gives an execution policy error, always use `npm.cmd`)*

---

## 9. What We Will Build in Milestone 2

Now that our foundation (Milestone 1) is solid, here is what comes next in **Milestone 2**:

1. **The Shared Timeline Engine (`src/engine/timeline.js`)**:
   - A module that takes an array of step snapshots and manages the current position (`currentIndex`).
2. **The Playback Controller (`src/engine/playbackController.js`)**:
   - Manages the timer loop, play, pause, speed adjustments, and emitting events whenever the step changes.
3. **Connecting Keyboard Shortcuts to the Engine**:
   - Making `Space`, `→`, `←`, and `R` drive the highlighted code line in the CLI, matching what we already previewed in the browser!

---

*Take your time to read through this guide and inspect the code files. Whenever you feel comfortable and ready to move forward, let me know and we will begin Milestone 2!*
