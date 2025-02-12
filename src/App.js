import { useState } from "react";
import { JsxFlags } from "typescript";

// Create Square for tic-tac-toe
// value = X or O, depending on move #
// onSquareClick = function for when button is clicked (i.e. onClick event)
function Square({ value, winStatus, onSquareClick }) {
  return (
    <button
      className={
        "square" + " " + (winStatus ? "winningSquare" : "regularSquare")
      }
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

// Function: Game
export default function Game() {
  // Save history by initializing 9-item array with null
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // Keep track of the current move by initializing useState with 0
  const [currentMove, setCurrentMove] = useState(0);
  // Boolean: X goes on even turns, otherwise O goes on odd turns
  const xIsNext = currentMove % 2 === 0;
  // Keep track of whether list is in ascending or descending order by initializing boolean to false
  const [isDescending, setisDescending] = useState(false);
  // Keep track of the current array of square and store it as a the current move in history
  const currentSquares = history[currentMove];

  // Save the index that was just clicked
  const [currentIndex, setCurrentIndex] = useState(0);

  // Save history of indexes that was just clicked
  const [indices, setIndices] = useState([Array(9).fill(null)]);

  // Checkbox to toggle descending or ascending order
  const Checkbox = (state) => {
    return (
      <input
        type="checkbox"
        checked={state.isDescending}
        onChange={() => state.setisDescending(!isDescending)}
        // Notice the onChange and () => syntax here - important to make click functionality work!
        // Not operator (!) changes state between true and false
      />
    );
  };

  // Function: handlePlay()
  // Saves the current state of the board in history and sets next move
  function handlePlay(nextSquares, i) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; // ...history spread syntax enumerates all items in history, set to history up until that point
    const nextIndices = [...indices.slice(0, currentMove + 1), i];
    setHistory(nextHistory);
    setCurrentIndex(i);
    setIndices(nextIndices);
    setCurrentMove(nextHistory.length - 1);
  }

  // Function: jumpTo()
  // Changes the current move to the move #
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // List move history
  // Use .map() function to apply array
  const moves = history.map((squares, move) => {
    let description;
    let currentLocation;

    // index
    let index = [];
    index[0] = { row: 1, col: 1 };
    index[1] = { row: 1, col: 2 };
    index[2] = { row: 1, col: 3 };
    index[3] = { row: 2, col: 1 };
    index[4] = { row: 2, col: 2 };
    index[5] = { row: 2, col: 3 };
    index[6] = { row: 3, col: 1 };
    index[7] = { row: 3, col: 2 };
    index[8] = { row: 3, col: 3 };

    let coords = index.map(({ row, col }, i) => {
      return "Row: " + index[i].row + " Col: " + index[i].col;
    });

    if (move > 0) {
      description = "Go to move #" + move;
      if (move === 9) {
        currentLocation = "You are at the end of the game";
      } else {
        currentLocation = "You are at move #" + move;
      }
    } else {
      description = "Go to game start";
      currentLocation = "You are at game start";
    }
    return move === currentMove ? (
      <li key={move}>{currentLocation}</li>
    ) : (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
        <div class="coords">{coords[indices[move]]}</div>
      </li>
    );
  });

  // RETURN
  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          move={currentMove}
          currentIndex={currentIndex}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        {isDescending ? (
          <ol start="0" class="reversed">
            {moves}
          </ol>
        ) : (
          <ol start="0">{moves}</ol>
        )}

        <Checkbox
          isDescending={isDescending}
          setisDescending={setisDescending}
        />

        <label for="moveOrder">
          {isDescending ? (
            <>Toggle ascending order</>
          ) : (
            <>Toggle descending order</>
          )}
        </label>
      </div>
    </div>
  );
}

// Creates the Board for gameplay
function Board({ xIsNext, squares, onPlay, move, indices }) {
  // Handle the click of the button
  function handleClick(i) {
    // Return early if button is already filled or a winner has been determined
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    // Save copy of squares
    const nextSquares = squares.slice(); // slice() created a copy of array (immutability)

    // Save copy of moves
    const nextIndices = indices;

    // Change whether the square is X or O
    if (xIsNext) {
      // Whether X or O goes
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  // Determining the winner

  // Calls calculateWinner to determine if X or O won
  const winner = calculateWinner(squares);
  let status;
  let winningSquares = [];

  if (winner) {
    status = "Winner: " + winner.player;
    winningSquares = winner.line;
  } else if (!winner && move === 9) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Creating the board
  // Function: createRow()
  // Creates a row of three squares and numbers them given i
  function createRow(i) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      row.push(
        <Square
          value={squares[i + j]}
          onSquareClick={() => handleClick(i + j)}
          winStatus={winningSquares.includes(i + j)}
        />
      );
    }
    return <div className="board-row">{row}</div>;
  }

  // Function: createBoard()
  // Runs a loop for 9 iterations (9 squares) and calls createRow() at every 3rd number -> ensures each square is numbered 0-8
  function createBoard() {
    const board = [];
    const name = "board-row";
    for (let i = 0; i < 9; i++) {
      if (i % 3 === 0) {
        board.push(createRow(i));
      }
    }
    return <>{board}</>;
  }

  // RETURN
  return (
    <>
      <div className="status">{status}</div>
      {createBoard()}
    </>
  );
}

// Function: calculateWinner()
// Takes an array of 9 squares, checks for a winner, and returns 'X', 'O', or null
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
