const mazeBoard = document.querySelector('#maze-board');
const panelCode = document.querySelector('#panel-code');
const panelTitle = document.querySelector('#panel-title');
const panelCopy = document.querySelector('#panel-copy');
const panelCommand = document.querySelector('#panel-command');
const roomCount = document.querySelector('#room-count');

const maze = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

const rooms = {
  '1-1': { code: '01', title: 'START POINT', copy: 'The path begins with a question: how can technology feel simpler for the person using it?', command: 'MOVE TO PROFILE' },
  '1-2': { code: '02', title: 'PROFILE', copy: 'Ten years of support, systems and people. Discover the operator behind the interface.', command: 'OPEN PROFILE' },
  '1-3': { code: '03', title: 'WORK LOG', copy: 'A career that moved from telecom and desktop support toward packaging and endpoint engineering.', command: 'OPEN WORK LOG' },
  '2-3': { code: '04', title: 'DIAGNOSE', copy: 'Every good solution starts by isolating the real problem.', command: 'FOLLOW THE FLOW' },
  '3-3': { code: '05', title: 'SYSTEMS', copy: 'A support practice built as a chain: understand, secure, deploy, document.', command: 'OPEN SYSTEMS' },
  '3-4': { code: '06', title: 'STACK', copy: 'Intune, SCCM, PowerShell, Microsoft 365, Active Directory and CyberArk EPM.', command: 'OPEN STACK' },
  '3-5': { code: '07', title: 'EXIT', copy: 'You found the connection point. There is a real person at the other end.', command: 'OPEN CONTACT' },
  '4-5': { code: '08', title: 'CONTACT', copy: 'Have a system to improve or a team to strengthen? Start a conversation.', command: 'SEND MESSAGE' },
};

let player = { row: 1, column: 1 };
const discovered = new Set(['1-1']);

function renderMaze() {
  mazeBoard.innerHTML = '';
  maze.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
    const tile = document.createElement('div');
    const key = `${rowIndex}-${columnIndex}`;
    tile.className = `maze-cell ${cell ? 'wall' : 'path'} ${discovered.has(key) ? 'discovered' : ''}`;
    if (rowIndex === player.row && columnIndex === player.column) tile.classList.add('player');
    if (key === '4-5') tile.classList.add('goal');
    if (!cell) {
      tile.setAttribute('role', 'button');
      tile.setAttribute('aria-label', rooms[key]?.title || 'Path');
      tile.addEventListener('click', () => moveToward(rowIndex, columnIndex));
    }
    mazeBoard.appendChild(tile);
  }));

  const currentKey = `${player.row}-${player.column}`;
  const room = rooms[currentKey] || rooms['1-1'];
  panelCode.textContent = room.code;
  panelTitle.textContent = room.title;
  panelCopy.textContent = room.copy;
  panelCommand.textContent = room.command;
  roomCount.textContent = `ROOM ${String(room.code).padStart(2, '0')} / 08`;
}

function move(nextRow, nextColumn) {
  if (!maze[nextRow] || maze[nextRow][nextColumn] !== 0) return;
  player = { row: nextRow, column: nextColumn };
  discovered.add(`${nextRow}-${nextColumn}`);
  renderMaze();
}

function moveToward(targetRow, targetColumn) {
  const rowDelta = targetRow - player.row;
  const columnDelta = targetColumn - player.column;
  if (Math.abs(rowDelta) > Math.abs(columnDelta)) move(player.row + Math.sign(rowDelta), player.column);
  else if (columnDelta) move(player.row, player.column + Math.sign(columnDelta));
  else if (rowDelta) move(player.row + Math.sign(rowDelta), player.column);
}

function resetMaze() {
  player = { row: 1, column: 1 };
  discovered.clear();
  discovered.add('1-1');
  renderMaze();
}

const directionMap = { ArrowUp: [-1, 0], w: [-1, 0], ArrowDown: [1, 0], s: [1, 0], ArrowLeft: [0, -1], a: [0, -1], ArrowRight: [0, 1], d: [0, 1] };

document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'r') resetMaze();
  const direction = directionMap[event.key] || directionMap[event.key.toLowerCase()];
  if (!direction) return;
  event.preventDefault();
  move(player.row + direction[0], player.column + direction[1]);
});

renderMaze();

const languageButtons = document.querySelectorAll('.language-button');

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const language = button.dataset.language;
    document.documentElement.lang = language;
    document.body.classList.toggle('lang-en', language === 'en');

    languageButtons.forEach((languageButton) => {
      const isActive = languageButton === button;
      languageButton.classList.toggle('is-active', isActive);
      languageButton.setAttribute('aria-pressed', String(isActive));
    });
  });
});
