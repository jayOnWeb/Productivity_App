const { spawn } = require('child_process');
const path = require('path');

console.log("\x1b[36m%s\x1b[0m", "🚀 Starting FocusFlow AI Platform (Backend + Frontend)...");

// Colors for terminal logs
const CYAN = "\x1b[36m";
const VIOLET = "\x1b[35m";
const RESET = "\x1b[0m";
const RED = "\x1b[31m";

const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  shell: true,
  stdio: 'pipe'
});

const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  shell: true,
  stdio: 'pipe'
});

backend.stdout.on('data', (data) => {
  process.stdout.write(`${CYAN}[Backend]${RESET} ${data}`);
});

backend.stderr.on('data', (data) => {
  process.stderr.write(`${RED}[Backend Error]${RESET} ${data}`);
});

frontend.stdout.on('data', (data) => {
  process.stdout.write(`${VIOLET}[Frontend]${RESET} ${data}`);
});

frontend.stderr.on('data', (data) => {
  process.stderr.write(`${VIOLET}[Frontend]${RESET} ${data}`);
});

const cleanup = () => {
  console.log("\n\x1b[33m%s\x1b[0m", "🛑 Shutting down FocusFlow servers...");
  backend.kill();
  frontend.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
