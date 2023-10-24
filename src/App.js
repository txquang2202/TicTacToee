import { useState } from "react";
import ReactSwitch from "react-switch";

function Square(props) {
  var newClass;
  if (props.iswinning) newClass = "square winning-line";
  else if (props.value === "X") newClass = "square X";
  else newClass = "square O";
  return (
    <button
      className={newClass}
      onClick={props.onSquareClick}
      iswinning={props.iswinning}
    >
      {props.value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }
  function squareRender(i) {
    const winningPlayer = calculateWinner(squares);
    const winningLine = winningPlayer ? winningPlayer.line : null;
    const iswinning = winningLine && winningLine.includes(i);
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        iswinning={iswinning}
        key={i}
      />
    );
  }

  function CreateBoard() {
    const FullBoard = [];

    for (let i = 0; i < 3; i++) {
      const rowBoard = [];
      for (let j = 0; j < 3; j++) {
        rowBoard.push(squareRender(i * 3 + j));
      }

      FullBoard.push(
        <div className="board-row" key="">
          {rowBoard}
        </div>
      );
    }
    return FullBoard;
  }
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner.winner;
  } else if (Array.isArray(squares) && squares.every((square) => square)) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <CreateBoard />
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), index: -1 },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const [checked, setChecked] = useState(true);

  function handlePlay(nextSquares, i) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, index: i },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  const moves = history.map((turnInfo, move) => {
    let description;
    let moveInfo = "";
    if (move > 0) {
      const row = Math.floor(turnInfo.index / 3);
      const col = turnInfo.index % 3;
      moveInfo = " - (" + (row + 1) + ", " + (col + 1) + ")";
      description = "Go to move #" + move + moveInfo;
    } else {
      description = "Go to game start";
    }

    return (
      <>
        <li key={move}>
          {move === currentMove ? (
            <p>
              You are at #{move}
              {moveInfo} move
            </p>
          ) : (
            <button onClick={() => jumpTo(move)}>{description}</button>
          )}
        </li>
      </>
    );
  });
  function SortChanging() {
    setChecked(!checked);
  }
  return (
    <>
      <div className="container">
        <div className="game">
          <div className="game-board">
            <Board
              xIsNext={xIsNext}
              squares={currentSquares}
              onPlay={handlePlay}
            />
          </div>
          <div className="game-info">
            <div className="app" style={{ textAlign: "center" }}>
              <h4>Sort Toggle</h4>
              <ReactSwitch checked={checked} onChange={SortChanging} />
            </div>
            <ol>{checked ? moves : moves.reverse()}</ol>
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>QuangTX©️</p>
      </footer>
    </>
  );
}

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
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
