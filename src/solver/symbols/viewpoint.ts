import { Board, Cell, Color, Pos, getOppositeColor, verifyPos } from '..';

export interface ViewpointSymbol {
  pos: Pos;
  kind: 'viewpoint';
  count: number;
}

export function verifyViewpointSymbol(board: Board, symbol: ViewpointSymbol): Pos[] | false {
  const pos = symbol.pos;
  const cell = board[pos.x][pos.y];

  if (cell == Cell.Empty) return [symbol.pos];

  let usableCells = 1;
  let sameCells = 1;

  let affected_cells: Pos[] = [];

  function traverse(dirX: number, dirY: number): boolean {
    let connected = true;
    let x = pos.x + dirX;
    let y = pos.y + dirY;

    while (verifyPos(board, { x, y })) {
      const curCell = board[x][y];

      if (connected) {
        if (cell == curCell) {
          sameCells += 1;
          if (sameCells > symbol.count) return true;
        } else {
          if (curCell == Cell.Empty) affected_cells.push({ x, y });
          connected = false;
        }
      }

      if (getOppositeColor(cell as Color) == curCell || curCell == Cell.Border) break;

      usableCells += 1;

      x += dirX;
      y += dirY;
    }

    return false;
  }

  if (traverse(-1, 0) || traverse(1, 0) || traverse(0, -1) || traverse(0, 1)) return false;

  if (usableCells < symbol.count) return false;

  return affected_cells;
}
