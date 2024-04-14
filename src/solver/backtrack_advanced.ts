import {
  Board,
  Rule,
  Symbol,
  Pos,
  Cell,
  verify_connected_rule,
  verify_area_symbol,
  verify_viewpoint_symbol,
  verify_dart_symbol,
  Game,
  DartSymbol,
  ViewpointSymbol,
  get_dir,
  LetterSymbol,
  get_neighbours,
  verify_galaxy_symbol,
  verify_lotus_symbol,
  Color
} from '.';
import { isValid, naive_next_cell } from './backtrack';

// interface LettersInfo {
//   letters: LetterSymbol[];
//   lettersCount: number[];
// }

// Advanced backtracking:
// 1. The algorithm build a relational info (RI) between each constraints (rules & symbols) and the cells that are (potentially) affected by it
//    This is done such that selecting empty cells to search, checking validity and early checking are done in a more efficient way
// 2. The algorithm maintains the relational info at each step.

interface DartRI {
  symbol: DartSymbol;
  affected_cells: Pos[];
}

interface ViewpointRI {
  symbol: ViewpointSymbol;
  affected_cells: Pos[];
}

type RI = DartRI | ViewpointRI;

// // Handle letter
// function buildLettersInfo(game: Game): LettersInfo {
//   const letters: LetterSymbol[] = game.symbols.filter(symbol => symbol.kind == 'letter') as LetterSymbol[];
//   const maxLetter = letters.reduce((max, symbol) => Math.max(max, symbol.letter), -1);

//   const lettersCount = new Array(maxLetter + 1).fill(0);

//   for (const symbol of letters) {
//     lettersCount[symbol.letter] += 1;
//   }

//   return { letters, lettersCount };
// }

// Attempt to solve the board using a backtracking algorithm that uses advanced heuristics
export function solveAdvanced(game: Game): boolean {
  if (!isValid(game)) return false;

  const riList: RI[] = [];

  for (const symbol of game.symbols) {
    if (symbol.kind == 'dart') {
      const ri: DartRI = { symbol, affected_cells: [symbol.pos] };
      riList.push(ri);

      let [dirX, dirY] = get_dir(symbol.direction);
      let x = symbol.pos.x + dirX;
      let y = symbol.pos.y + dirY;

      while (x >= 0 && x < game.sizeX && y >= 0 && y < game.sizeY) {
        if (game.board[x][y] == Cell.Empty) {
          ri.affected_cells.push({ x, y });
        }

        x += dirX;
        y += dirY;
      }
    }
    // TODO: Build this in a more efficient way
    // TODO: Also stop when an opposite color is in the way
    if (symbol.kind == 'viewpoint') {
      const ri: ViewpointRI = { symbol, affected_cells: [symbol.pos] };
      riList.push(ri);

      for (let x = symbol.pos.x - 1; x >= 0; x--) {
        if (symbol.pos.x - x > symbol.count) break;
        if (game.board[x][symbol.pos.y] != Cell.Empty) continue;
        ri.affected_cells.push({ x, y: symbol.pos.y });
      }
      for (let x = symbol.pos.x + 1; x < game.sizeX; x++) {
        if (x - symbol.pos.x > symbol.count) break;
        if (game.board[x][symbol.pos.y] != Cell.Empty) continue;
        ri.affected_cells.push({ x, y: symbol.pos.y });
      }
      for (let y = symbol.pos.y - 1; y >= 0; y--) {
        if (symbol.pos.y - y > symbol.count) break;
        if (game.board[symbol.pos.x][y] != Cell.Empty) continue;
        ri.affected_cells.push({ x: symbol.pos.x, y });
      }
      for (let y = symbol.pos.y + 1; y < game.sizeY; y++) {
        if (y - symbol.pos.y > symbol.count) break;
        if (game.board[symbol.pos.x][y] != Cell.Empty) continue;
        ri.affected_cells.push({ x: symbol.pos.x, y });
      }
    }
  }

  console.log(riList);

  return backtrack(game, riList);
}

// TODO: Do not build this lookup grid every time
function buildRiLookup(game: Game, riList: RI[]): (RI[] | null)[][] {
  let map: (RI[] | null)[][] = [];
  // Initialize the map
  for (let x = 0; x < game.sizeX; x++) {
    map[x] = [];
    for (let y = 0; y < game.sizeY; y++) {
      map[x][y] = null;
    }
  }

  for (const ri of riList) {
    for (const cell of ri.affected_cells) {
      if (game.board[cell.x][cell.y] != Cell.Empty) continue;

      if (!map[cell.x][cell.y]) map[cell.x][cell.y] = [];
      map[cell.x][cell.y]!.push(ri);
    }
  }

  return map;
}

function next_cell(game: Game, lookup: (RI[] | null)[][]): Pos | null {
  // Find the cell with the most constraints in the lookup
  let highest: number = 0;
  let cell: Pos | null = null;
  for (let x = 0; x < lookup.length; x++) {
    for (let y = 0; y < lookup[0].length; y++) {
      if (!lookup[x][y]) continue;

      if (lookup[x][y]!.length > highest) {
        highest = lookup[x][y]!.length;
        cell = { x, y };
      }
    }
  }
  if (cell) return cell;

  // Fallback to naive next cell
  return naive_next_cell(game.board);
}

export function isValidAdvanced(game: Game, lookup: (RI[] | null)[][], placed: Pos, placedColor: Color): boolean {
  if (lookup[placed.x][placed.y]) {
    for (const ri of lookup[placed.x][placed.y]!) {
      if (ri.symbol.kind == 'dart' && !verify_dart_symbol(game.board, ri.symbol)) return false;
      if (ri.symbol.kind == 'viewpoint' && !verify_viewpoint_symbol(game.board, ri.symbol)) return false;
    }
  }

  for (const symbol of game.symbols) {
    if (symbol.kind == 'area' && !verify_area_symbol(game.board, symbol)) return false;
    if (symbol.kind == 'galaxy' && !verify_galaxy_symbol(game.board, symbol)) return false;
    if (symbol.kind == 'lotus' && !verify_lotus_symbol(game.board, symbol)) return false;
  }

  for (const rule of game.rules) {
    if (rule.kind == 'connected' && rule.color != placedColor && !verify_connected_rule(game.board, rule)) return false;
  }

  return true;
}

export function backtrack(game: Game, riList: RI[]): boolean {
  let lookup = buildRiLookup(game, riList);

  // Find the first empty cell
  let pos: Pos | null = next_cell(game, lookup);
  if (!pos) return true;

  // TODO: Use a better method to determine the order
  game.board[pos.x][pos.y] = Cell.White;
  if (isValidAdvanced(game, lookup, pos, Color.White) && backtrack(game, riList)) return true;

  game.board[pos.x][pos.y] = Cell.Black;
  if (isValidAdvanced(game, lookup, pos, Color.Black) && backtrack(game, riList)) return true;

  // If both fail, returns to initial state
  game.board[pos.x][pos.y] = Cell.Empty;
  return false;
}
