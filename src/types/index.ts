export interface BoardCell {
  value: number | '💣';
  revealed: boolean;
  flagged: boolean;
}

export interface CellCoords {
  x: number;
  y: number;
}
