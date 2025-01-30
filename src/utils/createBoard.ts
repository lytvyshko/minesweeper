import { BoardCell } from '../types';

export function createBoard(
  rows: number,
  cols: number,
  mines: number
): BoardCell[][] {
  const board: BoardCell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      value: 0,
      revealed: false,
      flagged: false,
    }))
  );

  let mineCount = 0;
  while (mineCount < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (board[r][c].value !== '💣') {
      board[r][c] = { ...board[r][c], value: '💣' };
      mineCount++;

      // Update numbers around mines
      for (const rowOffset of [-1, 0, 1]) {
        for (const columnOffset of [-1, 0, 1]) {
          const newRow = r + rowOffset;
          const newColumn = c + columnOffset;
          if (
            newRow >= 0 &&
            newRow < rows &&
            newColumn >= 0 &&
            newColumn < cols &&
            board[newRow][newColumn].value !== '💣'
          ) {
            board[newRow][newColumn] = {
              ...board[newRow][newColumn],
              value: board[newRow][newColumn].value + 1,
            };
          }
        }
      }
    }
  }

  return board;
}
