import { ConnectedRule, AreaRule } from './rules';
import { AreaSymbol, DartSymbol, ViewpointSymbol, GalaxySymbol, LotusSymbol } from './symbols';

export interface Pos {
  x: number;
  y: number;
}

export enum Cell {
  Empty = 0,
  Light,
  Dark,
  Border
}

export type Color = Cell.Light | Cell.Dark;

export type Rule = ConnectedRule | AreaRule;

export type Symbol = AreaSymbol | DartSymbol | ViewpointSymbol | GalaxySymbol | LotusSymbol;

export type Board = Cell[][];

export interface Game {
  board: Board;
  rules: Rule[];
  symbols: Symbol[];
  sizeX: number;
  sizeY: number;
}

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right'
}

// Check if the position is within the board
export function verifyPos(board: Board, pos: Pos): boolean {
  return pos.x >= 0 && pos.x < board.length && pos.y >= 0 && pos.y < board[0].length;
}

export function getOppositeColor(color: Color): Color {
  return color == Cell.Dark ? Cell.Light : Cell.Dark;
}

export function getNeighbours(board: Board, pos: Pos): Pos[] {
  const positions: Pos[] = [];

  if (pos.x > 0) {
    if (board[pos.x - 1][pos.y] != Cell.Border) positions.push({ x: pos.x - 1, y: pos.y });
  }
  if (pos.x + 1 < board.length) {
    if (board[pos.x + 1][pos.y] != Cell.Border) positions.push({ x: pos.x + 1, y: pos.y });
  }
  if (pos.y > 0) {
    if (board[pos.x][pos.y - 1] != Cell.Border) positions.push({ x: pos.x, y: pos.y - 1 });
  }
  if (pos.y + 1 < board[0].length) {
    if (board[pos.x][pos.y + 1] != Cell.Border) positions.push({ x: pos.x, y: pos.y + 1 });
  }

  return positions;
}

export function getDirOffset(dir: Direction): [number, number] {
  switch (dir) {
    case Direction.Up:
      return [-1, 0];
    case Direction.Down:
      return [1, 0];
    case Direction.Left:
      return [0, -1];
    case Direction.Right:
      return [0, 1];
  }
}
