import { Pos, Game, Cell, Color, Symbol } from '.';
import { isValid, naiveNextCell } from './backtrackNaive';
import { verify_connected_rule, verify_area_rule } from './rules';
import {
  verify_area_symbol,
  verify_viewpoint_symbol,
  verify_dart_symbol,
  verify_galaxy_symbol,
  verify_lotus_symbol
} from './symbols';
import { buildDartAdjacency } from './symbols/dart';

// This interface stores cells that are "near" to a symbol. ("near" means able to influence the result of a symbol)
// For example, if the symbol is an area symbol, affected cells will store the position of the empty cells on the border of the symbol.
interface Adjacency {
  symbol: Symbol;
  affectedCells: Pos[];
}

// This function chooses the next empty cell to search.
// The logic is that cells that are more "near" to symbols should be searched first (more constrained).
// This help reduces the search space.
function advancedNextCell(game: Game, adjLookup: (Adjacency[] | null)[][]): Pos | null {
  // Find the cell with the most constraints in the lookup
  let highest: number = 0;
  let cell: Pos | null = null;
  for (let x = 0; x < game.sizeX; x++) {
    for (let y = 0; y < game.sizeY; y++) {
      if (!adjLookup[x][y]) continue;

      if (adjLookup[x][y]!.length > highest) {
        highest = adjLookup[x][y]!.length;
        cell = { x, y };
      }
    }
  }
  if (cell) return cell;

  // Fallback to naive next cell
  return naiveNextCell(game);
}

function buildAdjacencyLookup(game: Game, adjList: Adjacency[]): (Adjacency[] | null)[][] {
  let adjLookup: (Adjacency[] | null)[][] = [];

  // Initialize the map
  for (let x = 0; x < game.sizeX; x++) {
    adjLookup[x] = [];
    for (let y = 0; y < game.sizeY; y++) {
      adjLookup[x][y] = null;
    }
  }

  for (const adj of adjList) {
    for (const cell of adj.affectedCells) {
      if (game.board[cell.x][cell.y] != Cell.Empty) continue;

      if (!adjLookup[cell.x][cell.y]) adjLookup[cell.x][cell.y] = [];
      adjLookup[cell.x][cell.y]!.push(adj);
    }
  }

  return adjLookup;
}

// This function checks if the guess is valid or not.
// The game should be valid before the guess.
export function isValidAdvanced(
  game: Game,
  adjLookup: (Adjacency[] | null)[][],
  placed: Pos,
  placedColor: Color,
  originalAdj: [Adjacency, Pos[]][]
): boolean {
  // We save all the adjacency changes made into original adjacency, so that we can reverse the changes if it backtracks

  // Loop through all symbols that are "near" to this cell
  // For most symbols, only cells that are "near" can make the symbol invalid, so only those cells should be checked

  if (adjLookup[placed.x][placed.y]) {
    for (const adj of adjLookup[placed.x][placed.y]!) {
      if (adj.symbol.kind == 'dart') {
        // Dart
        // For dart, we don't need to rebuild adjacency
        if (!verify_dart_symbol(game.board, adj.symbol)) return false;
      } else {
        // For other symbols, we do need to rebuild adjacency
        let affected_cells: Pos[] | false;

        if (adj.symbol.kind == 'area') {
          // Area
          affected_cells = verify_area_symbol(game.board, adj.symbol);
        } else if (adj.symbol.kind == 'viewpoint') {
          // Viewpoint
          affected_cells = verify_viewpoint_symbol(game.board, adj.symbol);
        } else if (adj.symbol.kind == 'galaxy') {
          // Galaxy
          affected_cells = verify_galaxy_symbol(game.board, adj.symbol);
        } else if (adj.symbol.kind == 'lotus') {
          // Lotus
          affected_cells = verify_lotus_symbol(game.board, adj.symbol);
        }

        if (!affected_cells!) return false;

        // Save affected cells
        originalAdj.push([adj, adj.affectedCells]);
        // Update adjacency
        adj.affectedCells = affected_cells;
      }
    }
  }

  // Area symbol special case
  for (const symbol of game.symbols) {
    // Opposite color case
    // A cell can potentially invalidate an area symbol even if the cell is not "near" to the symbol
    if (symbol.kind == 'area') {
      const symbolCell = game.board[symbol.pos.x][symbol.pos.y];
      if (
        symbolCell == Cell.Empty ||
        symbolCell == placedColor ||
        adjLookup[placed.x][placed.y]?.find(ri => ri.symbol == symbol)
      )
        continue;

      if (!verify_area_symbol(game.board, symbol)) return false;
    }
  }

  for (const rule of game.rules) {
    // Connected
    if (rule.kind == 'connected' && !verify_connected_rule(game.board, rule)) return false;

    // Area
    if (rule.kind == 'area' && !verify_area_rule(game.board, rule)) return false;
  }

  return true;
}

// Reverse all adjacency changes made.
function reverseAdjChange(originalAdj: [Adjacency, Pos[]][]) {
  for (const [adj, affected_cells] of originalAdj) {
    adj.affectedCells = affected_cells;
  }
}

// Attempt to solve the board using a backtracking algorithm that uses some optimiziations.
export function solveAdvanced(game: Game): boolean {
  if (!isValid(game)) return false;

  const adjacencies: Adjacency[] = [];

  // Generate adjacencies

  for (const symbol of game.symbols) {
    let result: Pos[] | false;
    if (symbol.kind == 'area') {
      result = verify_area_symbol(game.board, symbol);
    } else if (symbol.kind == 'dart') {
      result = buildDartAdjacency(game.board, symbol);
    } else if (symbol.kind == 'viewpoint') {
      result = verify_viewpoint_symbol(game.board, symbol);
    } else if (symbol.kind == 'galaxy') {
      result = verify_galaxy_symbol(game.board, symbol);
    } else if (symbol.kind == 'lotus') {
      result = verify_lotus_symbol(game.board, symbol);
    }

    if (!result!) return false;
    adjacencies.push({ symbol, affectedCells: result });
  }

  return backtrack(game, adjacencies);
}

export function backtrack(game: Game, adjacencies: Adjacency[]): boolean {
  // Build an adjacency lookup grid
  // TODO: Do not build this lookup grid on every backtrack
  let adjLookup = buildAdjacencyLookup(game, adjacencies);

  // Find the first empty cell
  let pos: Pos | null = advancedNextCell(game, adjLookup);
  if (!pos) return true;

  // TODO: Use a better method to determine the order

  {
    const originalAdj: [Adjacency, Pos[]][] = [];

    // Guess
    game.board[pos.x][pos.y] = Cell.Light;
    if (isValidAdvanced(game, adjLookup, pos, Cell.Light, originalAdj) && backtrack(game, adjacencies)) return true;

    // Reverse adjacency changes
    reverseAdjChange(originalAdj);
  }

  {
    const originalAdj: [Adjacency, Pos[]][] = [];

    // Guess
    game.board[pos.x][pos.y] = Cell.Dark;
    if (isValidAdvanced(game, adjLookup, pos, Cell.Dark, originalAdj) && backtrack(game, adjacencies)) return true;

    // Reverse adjacency changes
    reverseAdjChange(originalAdj);
  }

  // If both fail, returns to initial state
  game.board[pos.x][pos.y] = Cell.Empty;
  return false;
}
