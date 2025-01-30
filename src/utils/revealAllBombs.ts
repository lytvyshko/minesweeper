import { BoardCell } from '../types';

export function revealAllBombs(board: BoardCell[][]) {
  return board.map((row) =>
    row.map((cell) => {
      if (cell.value === '💣') {
        return { ...cell, revealed: true };
      }

      return { ...cell };
    })
  );
}
