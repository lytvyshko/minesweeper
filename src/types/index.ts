export interface BoardCell {
  value: number | '💣';
  revealed: boolean;
  flagged: boolean;
}
