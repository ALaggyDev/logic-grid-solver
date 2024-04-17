import { Game, Pos, Cell } from '.';
import { verify_connected_rule, verify_area_rule } from './rules';
import {
  verify_area_symbol,
  verify_dart_symbol,
  verify_viewpoint_symbol,
  verify_galaxy_symbol,
  verify_lotus_symbol
} from './symbols';

export function isValid(game: Game): boolean {
  for (const rule of game.rules) {
    if (rule.kind == 'connected' && !verify_connected_rule(game.board, rule)) return false;
    if (rule.kind == 'area' && !verify_area_rule(game.board, rule)) return false;
  }

  for (const symbol of game.symbols) {
    if (symbol.kind == 'area' && !verify_area_symbol(game.board, symbol)) return false;
    if (symbol.kind == 'dart' && !verify_dart_symbol(game.board, symbol)) return false;
    if (symbol.kind == 'viewpoint' && !verify_viewpoint_symbol(game.board, symbol)) return false;
    if (symbol.kind == 'galaxy' && !verify_galaxy_symbol(game.board, symbol)) return false;
    if (symbol.kind == 'lotus' && !verify_lotus_symbol(game.board, symbol)) return false;
  }

  return true;
}

// Find the next empty cell
export function naiveNextCell(game: Game): Pos | null {
  for (let x = 0; x < game.sizeX; x++) {
    for (let y = 0; y < game.sizeY; y++) {
      if (game.board[x][y] === Cell.Empty) {
        return { x, y };
      }
    }
  }

  return null;
}

// Attempt to solve the board using a backtracking algorithm
export function solve(game: Game): boolean {
  if (!isValid(game)) return false;

  // Find the first empty cell
  let pos: Pos | null = naiveNextCell(game);
  if (!pos) return true;

  // TODO: Use a better method to determine the order
  game.board[pos.x][pos.y] = Cell.Light;
  if (solve(game)) return true;

  game.board[pos.x][pos.y] = Cell.Dark;
  if (solve(game)) return true;

  // If both fail, returns to initial state
  game.board[pos.x][pos.y] = Cell.Empty;
  return false;
}
