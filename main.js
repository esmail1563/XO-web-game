const boardEl = document.getElementById('board');
const cells = Array.from(boardEl.querySelectorAll('.cell'));
const turnText = document.getElementById('turnText');
const dot = document.getElementById('dot');
const resetBtn = document.getElementById('reset');
const clearScoreBtn = document.getElementById('clearScore');
const starterToggle = document.getElementById('starterToggle');
const toast = document.getElementById('toast');

const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreDEl = document.getElementById('scoreD');

const lineWrap = document.getElementById('winLine');
const lineEl = document.getElementById('line');

const WINS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let board = Array(9).fill('');
let current = 'X';
let locked = false;
let score = { X: 0, O: 0, D: 0 };

// أدوات
const speak = msg => {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1600);
};

const setTurn = p => {
    current = p;
    turnText.textContent = 'دور: ' + p;
    dot.style.background = p === 'X' ? 'var(--x)' : 'var(--o)';
};

const drawBoard = () => {
    board.forEach((v, i) => {
        cells[i].textContent = v;
        cells[i].classList.toggle('X', v === 'X');
        cells[i].classList.toggle('O', v === 'O');
    });
};

const resetRound = (keepStarter = true) => {
    board = Array(9).fill('');
    locked = false;
    cells.forEach(c => c.classList.remove('disabled'));
    drawBoard();
    hideWinLine();
    if (!keepStarter) {
        const active = starterToggle.querySelector('button.active').dataset.start;
        setTurn(active);
    }
};

const clearScore = () => {
    score = { X: 0, O: 0, D: 0 };
    renderScore();
    speak('تم تصفير النقاط');
};

const renderScore = () => {
    scoreXEl.textContent = score.X;
    scoreOEl.textContent = score.O;
    scoreDEl.textContent = score.D;
};

const checkWinner = () => {
    for (const combo of WINS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], combo };
        }
    }
    if (board.every(v => v)) return { winner: 'D', combo: null };
    return null;
};


const showWinLine = (combo) => {
    if (!combo) return;
    const rect = boardEl.getBoundingClientRect();
    const positions = combo.map(i => cells[i].getBoundingClientRect());
    const mid = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    const [p1, p2, p3] = positions.map(mid);
    const start = p1, end = p3; // نفس الخط
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    const wrapRect = boardEl.getBoundingClientRect();
    const localX = (start.x - wrapRect.left);
    const localY = (start.y - wrapRect.top);

    lineEl.style.width = len + 'px';
    lineEl.style.left = localX + 'px';
    lineEl.style.top = localY + 'px';
    lineEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    lineEl.classList.add('show');
};
const hideWinLine = () => {
    lineEl.classList.remove('show');
    lineEl.style.width = '0px';
};

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const idx = +cell.dataset.idx;
        if (locked || board[idx]) return;
        board[idx] = current;
        cell.classList.add(current);
        cell.textContent = current;

        const res = checkWinner();
        if (res) {
            locked = true;
            cells.forEach(c => c.classList.add('disabled'));
            if (res.winner === 'D') {
                score.D++;
                renderScore();
                speak('تعادل! جولة جميلة.');
            } else {
                score[res.winner]++;
                renderScore();
                speak(`فاز ${res.winner}!`);
                showWinLine(res.combo);
            }
            return;
        }

        setTurn(current === 'X' ? 'O' : 'X');
    });
});


resetBtn.addEventListener('click', () => {
    resetRound(false);
    speak('تم بدء جولة جديدة');
});
clearScoreBtn.addEventListener('click', clearScore);

starterToggle.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
        starterToggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        setTurn(btn.dataset.start);
    });
});


resetRound(false);
renderScore();