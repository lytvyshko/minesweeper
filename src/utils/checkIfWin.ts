import { BoardCell } from '../types';

export function checkIfWin(board: BoardCell[][]) {
  const result = board.every((row) =>
    row.every(
      (cell) =>
        (cell.value === '💣' && !cell.revealed) ||
        (cell.value !== '💣' && cell.revealed)
    )
  );
  console.log(result);
  return result;
}
