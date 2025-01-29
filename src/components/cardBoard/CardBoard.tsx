import { Smile, Frown, Flag } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { createBoard } from '../../utils.ts';
import styles from './cardBoard.module.css';

enum Colors {
  blue = 1,
  green,
  red,
  purple,
  maroon,
  teal,
  black,
  silver,
}

export const CardBoard = () => {
  const [board, setBoard] = useState(() => createBoard(10, 10, 30));
  const [gameOver, setGameOver] = useState(false);

  const handleReset = () => {
    setBoard(createBoard(10, 10, 30));
    setGameOver(false);
  };

  const markFlagged = (rowIndex: number, colIndex: number) => {
    if (board[rowIndex][colIndex].revealed) {
      return;
    }

    const newBoard = board.map((row, rIndex) =>
      row.map((cell, cIndex) => {
        if (rIndex === rowIndex && cIndex === colIndex) {
          return { ...cell, flagged: !cell.flagged };
        }

        return { ...cell };
      })
    );

    setBoard(newBoard);
  };

  const handleBtnClick = (rowIndex: number, colIndex: number) => {
    if (board[rowIndex][colIndex].value === '💣') {
      setGameOver(true);
    }
    if (
      board[rowIndex][colIndex].revealed ||
      board[rowIndex][colIndex].flagged ||
      gameOver
    ) {
      return;
    }

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    const floodFill = (r, c) => {
      if (r < 0 || r >= 10 || c < 0 || c >= 10 || newBoard[r][c].revealed) {
        return;
      }

      newBoard[r][c].revealed = true;

      // If the cell has 0 value, continue revealing neighbors
      if (newBoard[r][c].value === 0) {
        for (const dr of [-1, 0, 1]) {
          for (const dc of [-1, 0, 1]) {
            if (dr !== 0 || dc !== 0) {
              // Skip the current cell
              floodFill(r + dr, c + dc);
            }
          }
        }
      }
    };

    // Start flood-fill from the clicked cell
    floodFill(rowIndex, colIndex);
    setBoard(newBoard);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className="">40</div>
        <button onClick={handleReset}>
          {gameOver ? <Frown /> : <Smile />}
        </button>
        <div>time</div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: `repeat(${board.length})`,
          gridTemplateColumns: `repeat(${board[0].length}, 1fr)`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <button
              className={clsx(
                styles.boardCell,
                cell.revealed && styles.revealedCell
              )}
              style={
                typeof cell.value === 'number'
                  ? { color: Colors[cell.value] }
                  : undefined
              }
              disabled={gameOver}
              key={`${rowIndex}-${cellIndex}`}
              onClick={() => handleBtnClick(rowIndex, cellIndex)}
              onContextMenu={(e) => {
                e.preventDefault();
                markFlagged(rowIndex, cellIndex);
              }}
            >
              {cell.flagged && (
                <Flag width={20} height={20} color={Colors[3]} />
              )}
              {cell.revealed ? cell.value || '' : ''}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
