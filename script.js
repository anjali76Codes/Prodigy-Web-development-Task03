let arr = Array(9).fill(null); // at starting game container is null
let currentPlayer = "X";
let gameEnded = false;
let selectedOpponent = "withfriend"; // Default value

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner() {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (arr[a] && arr[a] === arr[b] && arr[a] === arr[c]) {
      return arr[a];
    }
  }

  return arr.includes(null) ? null : "draw";
}

function handleGameResult(result) {
  const winnerBox = document.getElementById("winnerBox");
  gameEnded = true;

  if (result === "draw") {
    winnerBox.innerText = `It's a Draw!`;
  } else {
    winnerBox.innerText = `Winner is ${result}`;

    // Highlight the winning squares in red
    const winningCombination = getWinningCombination();
    for (const index of winningCombination) {
      const winningSquare = document.getElementById(String(index));
      winningSquare.style.backgroundColor = "red";
    }
  }

  // Change the text of the "Reset" button to "New Game"
  const resetButton = document.getElementById("reset");
  resetButton.innerText = "New Game";
  resetButton.removeEventListener("click", resetGame);
  resetButton.addEventListener("click", resetGame);
}

function getWinningCombination() {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (arr[a] && arr[a] === arr[b] && arr[a] === arr[c]) {
      return [a, b, c];
    }
  }
  return [];
}

function resetGame() {
  // Reset the game state
  arr = Array(9).fill(null);
  currentPlayer = "X";
  gameEnded = false;

  // Clear the display, assuming you have elements with ids from '0' to '8'
  for (let i = 0; i < 9; i++) {
    const square = document.getElementById(String(i));
    square.innerText = "";
    square.style.backgroundColor = ""; // Reset background color
  }

  // Reset the winner box
  const winnerBox = document.getElementById("winnerBox");
  winnerBox.innerText = "";

  // Change the text of the "New Game" button back to "Reset"
  const resetButton = document.getElementById("reset");
  resetButton.innerText = "Reset";
  resetButton.removeEventListener("click", resetGame);
  resetButton.addEventListener("click", resetGame);

  updateTurnDisplay();

  if (selectedOpponent === "withAI" && currentPlayer === "O") {
    // If playing against AI and it's AI's turn, make AI move
    makeAIMove();
  }
}

function updateTurnDisplay() {
  const currentPlayerDisplay = document.getElementById("currentPlayerDisplay");
  currentPlayerDisplay.innerText = currentPlayer;
  const turnDisplay = document.getElementById("turnDisplay");
  turnDisplay.style.backgroundColor =
    currentPlayer === "X" ? "#ffff00" : "#FA8072";
}

function handleClick(el) {
  const id = Number(el.id);
  const winnerBox = document.getElementById("winnerBox");

  if (gameEnded || arr[id] !== null) {
    // If the game has ended or the box is already filled, do nothing
    return;
  }

  arr[id] = currentPlayer;
  el.innerText = currentPlayer;
  const result = checkWinner();

  if (result !== null) {
    handleGameResult(result);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    updateTurnDisplay();

    if (selectedOpponent === "withAI" && currentPlayer === "O" && !gameEnded) {
      // If playing against AI and it's AI's turn, make AI move using Minimax with a delay
      setTimeout(() => makeAIMove(), 500); // Delay AI move by 500 milliseconds
    }
  }
}

function makeAIMove() {
  // Get the best move for the AI using Minimax
  const bestMove = getBestMove();

  // Simulate AI clicking the box
  const aiBox = document.getElementById(String(bestMove));
  handleClick(aiBox);
}

function getBestMove() {
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === null) {
      arr[i] = "O";
      let score = minimax(arr, 0, false);
      arr[i] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

function minimax(board, depth, isMaximizing) {
  let scores = {
    X: -1,
    O: 1,
    draw: 0,
  };

  let result = checkWinner();
  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Add an event listener to the select element
document.getElementById("select").addEventListener("change", function () {
  selectedOpponent = this.value;
  resetGame();
});
// Initialize the turn display
updateTurnDisplay();
