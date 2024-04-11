import {
  Board,
  Rule,
  SymbolType,
  Pos,
  Cell,
  verify_connected_rule,
  verify_area_symbol,
  verify_viewpoint_symbol,
  verify_dart_symbol,
  SymbolInfo as SymbolPair
} from '.';

function isValid(board: Board, rules: Rule[], symbols: SymbolPair[]): boolean {
  for (const rule of rules) {
    if (rule.kind == 'connected' && !verify_connected_rule(board, rule)) return false;
  }

  for (const pair of symbols) {
    if (pair.symbol.kind == 'area' && !verify_area_symbol(board, pair.pos, pair.symbol)) return false;
    if (pair.symbol.kind == 'viewpoint' && !verify_viewpoint_symbol(board, pair.pos, pair.symbol)) return false;
    if (pair.symbol.kind == 'dart' && !verify_dart_symbol(board, pair.pos, pair.symbol)) return false;
  }

  return true;
}

// Find the next empty cell
function naive_next_cell(board: Board): Pos | null {
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[0].length; y++) {
      if (board[x][y] === Cell.Empty) {
        return { x, y };
      }
    }
  }
  return null;
}

// Find the next empty cell with the Minimum Remaining Values
function mrv_next_cell(board: Board, rules: Rule[]): Pos | null {
  // TODO: Impl
  return null;
}

// Attempt to solve the board using a backtracking algorithm
export function solve(board: Board, rules: Rule[], symbols: SymbolPair[]): boolean {
  if (!isValid(board, rules, symbols)) return false;

  // Find the first empty cell
  let pos: Pos | null = naive_next_cell(board);
  if (!pos) return true;

  const r = Math.random() < 0.5;

  // Try one
  board[pos.x][pos.y] = r ? Cell.Black : Cell.White;
  if (solve(board, rules, symbols)) return true;

  // Try two
  board[pos.x][pos.y] = r ? Cell.White : Cell.Black;
  if (solve(board, rules, symbols)) return true;

  // If both fail, returns to initial state
  board[pos.x][pos.y] = Cell.Empty;
  return false;
}
