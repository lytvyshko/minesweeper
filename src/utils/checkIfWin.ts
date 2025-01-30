import { BoardCell } from '../types';

export function checkIfWin(board: BoardCell[][]) {
  return board.every((row) =>
    row.every(
      (cell) =>
        (cell.value === '💣' && !cell.revealed) ||
        (cell.value !== '💣' && cell.revealed)
    )
  );
}
