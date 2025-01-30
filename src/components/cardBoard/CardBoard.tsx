import { Smile, Frown, Flag, Laugh } from 'lucide-react';
import clsx from 'clsx';
import React, { useState, useMemo, useEffect } from 'react';
import { createBoard } from '../../utils.ts';
import styles from './cardBoard.module.css';
import { BoardCell } from '../../types';
import Confetti from 'react-confetti';

interface Props {
  board: BoardCell[][];
  setBoard: (board: BoardCell[][]) => void;
}

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

export const CardBoard: React.FC<Props> = ({ board, setBoard }) => {
  const [gameOver, setGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [time, setTime] = useState(+new Date());
  const [isRunning, setIsRunning] = useState(false);
  console.log(isVictory);

  const height = board.length;
  const width = board[0].length;

  const { mines, flagged, revealed } = useMemo(() => {
    const boardStats = { mines: 0, flagged: 0, revealed: 0 };

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].flagged) boardStats.flagged++;
        if (board[i][j].revealed) boardStats.revealed++;
        if (board[i][j].value === '💣') boardStats.mines++;
      }
    }

    return boardStats;
  }, [board]);

  useEffect(() => {
    if (revealed === 0) {
      setIsRunning(false);
      setIsVictory(false);
    }
    if (height * width - revealed === mines) {
      setIsVictory(true);
      setIsRunning(false);
    }
  }, [height, mines, revealed, width]);

  useEffect(() => {
    let timer: number;
    if (isRunning) {
      timer = setInterval(() => {
        setTime(+new Date());
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup on unmount
  }, [isRunning]);

  const handleReset = () => {
    setBoard(createBoard(height, width, mines));
    setGameOver(false);
    setIsVictory(false);
    setStartTime(null);
  };

  const markFlagged = (rowIndex: number, colIndex: number) => {
    if (board[rowIndex][colIndex].revealed || gameOver) {
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
    if (!isRunning && !isVictory) {
      setIsRunning(true);
      setStartTime(+new Date());
    }
    if (
      board[rowIndex][colIndex].revealed ||
      board[rowIndex][colIndex].flagged ||
      gameOver ||
      isVictory
    ) {
      return;
    }

    if (board[rowIndex][colIndex].value === '💣') {
      setGameOver(true);
      setIsRunning(false);
    }

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    const floodFill = (rowIndex: number, colIndex: number) => {
      if (
        rowIndex < 0 ||
        rowIndex >= height ||
        colIndex < 0 ||
        colIndex >= width ||
        newBoard[rowIndex][colIndex].revealed
      ) {
        return;
      }

      newBoard[rowIndex][colIndex].revealed = true;

      // If the cell has 0 value, continue revealing neighbors
      if (newBoard[rowIndex][colIndex].value === 0) {
        for (const rowOffset of [-1, 0, 1]) {
          for (const colOffset of [-1, 0, 1]) {
            if (rowOffset !== 0 || colOffset !== 0) {
              // Skip the current cell
              floodFill(rowIndex + rowOffset, colIndex + colOffset);
            }
          }
        }
      }
    };

    // Start flood-fill from the clicked cell
    floodFill(rowIndex, colIndex);
    setBoard(newBoard);
  };

  const runningTime = useMemo(() => {
    if (startTime && startTime < time) {
      if (Math.floor((+time - +startTime) / 1000) > 999) {
        return 999;
      }

      return Math.floor((+time - +startTime) / 1000);
    } else {
      return 0;
    }
  }, [startTime, time]);

  return (
    <div className={styles.wrapper}>
      {isVictory && <Confetti />}
      <div className={styles.header}>
        <div className={styles.minesCount}>{mines - flagged}</div>
        <button className={styles.resetBtn} onClick={handleReset}>
          {isVictory ? <Laugh /> : gameOver ? <Frown /> : <Smile />}
        </button>
        <div className={styles.clock}>{runningTime}</div>
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
              {cell.flagged && <Flag width={20} height={20} color="red" />}
              {cell.revealed ? cell.value || '' : ''}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
