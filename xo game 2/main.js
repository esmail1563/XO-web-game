const boardEl=document.getElementById('board');
const infoEl=document.getElementById('info');
const resetBtn=document.getElementById('reset');
const scoreXEl=document.getElementById('scoreX');
const scoreOEl=document.getElementById('scoreO');
const scoreDEl=document.getElementById('scoreD');

let board=Array(9).fill('');
let current='X';
let locked=false;
let score={X:0,O:0,D:0};

function drawBoard(){
  boardEl.innerHTML='';
  board.forEach((val,i)=>{
    const cell=document.createElement('div');
    cell.className='cell';
    cell.dataset.idx=i;
    cell.textContent=val;
    if(val) cell.classList.add(val);
    cell.addEventListener('click',()=>handleMove(i));
    boardEl.appendChild(cell);
  });
}
function setInfo(msg){ infoEl.textContent=msg; }

function handleMove(i){
  if(locked||board[i]) return;
  board[i]=current;
  drawBoard();
  const res=checkWinner();
  if(res){ endGame(res); return; }
  current=current==='X'?'O':'X';
  setInfo('دور: '+current);
}
function checkWinner(){
  const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(const [a,b,c] of wins){
    if(board[a]&&board[a]===board[b]&&board[a]===board[c]){
      return board[a];
    }
  }
  if(board.every(v=>v)) return 'D';
  return null;
}
function endGame(res){
  locked=true;
  if(res==='D'){ setInfo('تعادل!'); score.D++; }
  else { setInfo('فاز '+res+'!'); score[res]++; }
  renderScore();
}
function renderScore(){
  scoreXEl.textContent=score.X;
  scoreOEl.textContent=score.O;
  scoreDEl.textContent=score.D;
}
resetBtn.onclick=()=>{
  board=Array(9).fill('');
  current='X'; locked=false;
  drawBoard(); setInfo('دور: X');
};
drawBoard();