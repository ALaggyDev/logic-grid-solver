import {
  Board,
  Rule,
  Symbol,
  Pos,
  Cell,
  verify_connected_rule,
  verify_and_update_area_symbol,
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
  Color,
  verify_and_update_ri_viewpoint_symbol,
  verify_area_rule,
  AreaSymbol,
  isCellColorMatch
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

interface AreaRI {
  symbol: AreaSymbol;
  affected_cells: Pos[];
}

interface DartRI {
  symbol: DartSymbol;
  affected_cells: Pos[];
}

export interface ViewpointRI {
  symbol: ViewpointSymbol;
  affected_cells: Pos[];
}

type RI = AreaRI | DartRI | ViewpointRI;

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
    if (symbol.kind == 'area') {
      let result = verify_and_update_area_symbol(game.board, symbol);
      if (!result) return false;
      riList.push({ symbol, affected_cells: result });
    }

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

    if (symbol.kind == 'viewpoint') {
      let result = verify_and_update_ri_viewpoint_symbol(game.board, symbol);
      if (!result) return false;
      riList.push({ symbol, affected_cells: result });
    }
  }

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

export function isValidAdvanced(
  game: Game,
  lookup: (RI[] | null)[][],
  placed: Pos,
  placedColor: Color
): [boolean, [RI, Pos[]][]] {
  // We save all the changes made into this variable, so that we can reverse the changes if it backtracks
  let originalRIs: [RI, Pos[]][] = [];

  if (lookup[placed.x][placed.y]) {
    for (const ri of lookup[placed.x][placed.y]!) {
      if (ri.symbol.kind == 'area') {
        const affected_cells = verify_and_update_area_symbol(game.board, ri.symbol);
        if (!affected_cells) return [false, originalRIs];

        // Save affected cells
        originalRIs.push([ri, ri.affected_cells]);
        ri.affected_cells = affected_cells;
      }
      if (ri.symbol.kind == 'dart' && !verify_dart_symbol(game.board, ri.symbol)) return [false, originalRIs];
      if (ri.symbol.kind == 'viewpoint') {
        const affected_cells = verify_and_update_ri_viewpoint_symbol(game.board, ri.symbol);
        if (!affected_cells) return [false, originalRIs];

        // Save affected cells
        originalRIs.push([ri, ri.affected_cells]);
        ri.affected_cells = affected_cells;
      }
    }
  }

  for (const symbol of game.symbols) {
    // Opposite color case
    // Placing a cell can potentially invalidate an area symbol even if the cell is not on affected cells
    if (symbol.kind == 'area') {
      const symbolCell = game.board[symbol.pos.x][symbol.pos.y];
      if (
        symbolCell == Cell.Empty ||
        isCellColorMatch(symbolCell, placedColor) ||
        lookup[placed.x][placed.y]?.find(ri => ri.symbol == symbol)
      )
        continue;

      if (!verify_and_update_area_symbol(game.board, symbol)) return [false, originalRIs];
    }
    if (symbol.kind == 'galaxy' && !verify_galaxy_symbol(game.board, symbol)) return [false, originalRIs];
    if (symbol.kind == 'lotus' && !verify_lotus_symbol(game.board, symbol)) return [false, originalRIs];
  }

  for (const rule of game.rules) {
    if (rule.kind == 'connected' && !verify_connected_rule(game.board, rule)) return [false, originalRIs];
    if (rule.kind == 'area' && !verify_area_rule(game.board, rule)) return [false, originalRIs];
  }

  return [true, originalRIs];
}

function reverseRiChange(originalRIs: [RI, Pos[]][]) {
  for (const [ri, affected_cells] of originalRIs) {
    ri.affected_cells = affected_cells;
  }
}

export function backtrack(game: Game, riList: RI[]): boolean {
  let lookup = buildRiLookup(game, riList);

  // Find the first empty cell
  let pos: Pos | null = next_cell(game, lookup);
  if (!pos) return true;

  // TODO: Use a better method to determine the order

  {
    game.board[pos.x][pos.y] = Cell.Light;
    let result = isValidAdvanced(game, lookup, pos, Color.Light);
    if (result[0] && backtrack(game, riList)) {
      return true;
    } else {
      reverseRiChange(result[1]);
    }
  }

  {
    game.board[pos.x][pos.y] = Cell.Dark;
    let result = isValidAdvanced(game, lookup, pos, Color.Dark);
    if (result[0] && backtrack(game, riList)) {
      return true;
    } else {
      reverseRiChange(result[1]);
    }
  }

  // If both fail, returns to initial state
  game.board[pos.x][pos.y] = Cell.Empty;
  return false;
}
