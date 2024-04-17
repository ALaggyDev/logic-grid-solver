import { Board, Color, Pos, getNeighbours, getOppositeColor } from '..';

export interface ConnectedRule {
  kind: 'connected';
  color: Color;
}

export function verifyConnectedRule(board: Board, rule: ConnectedRule): boolean {
  // Find all same cells
  const sameCells: Pos[] = [];
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[0].length; y++) {
      if (board[x][y] == rule.color) {
        sameCells.push({ x, y });
      }
    }
  }

  // If there are no same cells, return true
  if (sameCells.length === 0) return true;

  const queue: Pos[] = [sameCells[0]];
  const visited: boolean[][] = [];

  // Initialize the visited array
  for (let x = 0; x < board.length; x++) {
    visited[x] = [];
    for (let y = 0; y < board[0].length; y++) {
      visited[x][y] = false;
    }
  }

  // Perform flood fill
  visited[sameCells[0].x][sameCells[0].y] = true;

  while (queue.length > 0) {
    const curPos = queue.pop()!;

    for (const neighbour of getNeighbours(board, curPos)) {
      if (visited[neighbour.x][neighbour.y] || board[neighbour.x][neighbour.y] == getOppositeColor(rule.color)) {
        continue;
      }

      visited[neighbour.x][neighbour.y] = true;
      queue.push(neighbour);
    }
  }

  // Check if any same cell is not reachable
  for (const cell of sameCells) {
    if (!visited[cell.x][cell.y]) return false;
  }

  return true;
}
