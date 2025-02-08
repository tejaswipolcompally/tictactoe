import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const isNext = currentMove % 2 === 0;
  const squares = history[currentMove];

  function handleClick(index) {
    if (calculateWinner(squares) || squares[index]) {
      return;
    }

    const newSquares = squares.slice();
    newSquares[index] = isNext ? "X" : "O";

    const newHistory = [...history.slice(0, currentMove + 1), newSquares];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  const moves = history.map((_, move) => (
    <li key={move} className="mb-2">
      <button
        onClick={() => jumpTo(move)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
      >
        {move ? `Go to move #${move}` : "Go to game start"}
      </button>
    </li>
  ));

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Tic-Tac-Toe</h1>
      <Board squares={squares} onPlay={handleClick} isNext={isNext} />
      <div className="game-info mt-6">
        <ol className="list-none">{moves}</ol>
      </div>
    </div>
  );
}

function Board({ squares, onPlay, isNext }) {
  function handleClick(index) {
    onPlay(index);
  }

  const winner = calculateWinner(squares);
  let status = winner ? `Winner: ${winner}` : `Next player: ${isNext ? "X" : "O"}`;

  return (
    <div className="text-center">
      <div className="text-2xl font-semibold mb-4 text-gray-700">{status}</div>
      <div className="space-y-3">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="flex space-x-3 justify-center">
              {Array(3)
                .fill(null)
                .map((_, j) => {
                  let index = i * 3 + j;
                  return (
                    <Button key={index} value={squares[index]} setXO={() => handleClick(index)} />
                  );
                })}
            </div>
          ))}
      </div>
    </div>
  );
}

function Button({ value, setXO }) {
  return (
    <button
      onClick={setXO}
      className="w-24 h-24 text-3xl font-bold flex items-center justify-center border-4 border-gray-800 bg-white hover:bg-gray-300 transition"
    >
      {value}
    </button>
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
      return squares[a];
    }
  }
  return null;
}
