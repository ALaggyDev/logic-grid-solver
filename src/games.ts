// let game: Game = JSON.parse(
//   `{"board":[[2,2,2,2,2,2,2,2,2],[2,1,0,0,0,0,1,0,2],[2,0,1,0,0,0,0,1,2],[2,0,0,1,0,0,0,0,2],[2,0,0,0,1,0,0,0,2],[2,0,0,0,0,1,0,0,2],[2,1,0,0,0,0,1,0,2],[2,0,1,0,0,0,0,1,2],[2,2,2,2,2,2,2,2,2]],"rules":[{"kind":"connected","color":1},{"kind":"connected","color":0}],"symbols":[{"pos":{"x":1,"y":1},"kind":"viewpoint","count":3},{"pos":{"x":2,"y":2},"kind":"viewpoint","count":6},{"pos":{"x":3,"y":3},"kind":"viewpoint","count":4},{"pos":{"x":4,"y":4},"kind":"viewpoint","count":4},{"pos":{"x":5,"y":5},"kind":"viewpoint","count":4},{"pos":{"x":6,"y":6},"kind":"viewpoint","count":3},{"pos":{"x":7,"y":7},"kind":"viewpoint","count":6},{"pos":{"x":6,"y":1},"kind":"viewpoint","count":4},{"pos":{"x":7,"y":2},"kind":"viewpoint","count":7},{"pos":{"x":1,"y":6},"kind":"viewpoint","count":3},{"pos":{"x":2,"y":7},"kind":"viewpoint","count":6}],"sizeX":9,"sizeY":9}`
// );
// let game: Game = {
//   board: [],
//   rules: [
//     { kind: 'connected', color: Color.Black },
//     { kind: 'connected', color: Color.White }
//   ],
//   symbols: [
//     { pos: { x: 1, y: 1 }, kind: 'viewpoint', count: 3 },
//     { pos: { x: 2, y: 2 }, kind: 'viewpoint', count: 6 },
//     { pos: { x: 3, y: 3 }, kind: 'viewpoint', count: 4 },
//     { pos: { x: 4, y: 4 }, kind: 'viewpoint', count: 4 },
//     { pos: { x: 5, y: 5 }, kind: 'viewpoint', count: 4 },
//     { pos: { x: 6, y: 6 }, kind: 'viewpoint', count: 3 },
//     { pos: { x: 7, y: 7 }, kind: 'viewpoint', count: 6 },
//     { pos: { x: 6, y: 1 }, kind: 'viewpoint', count: 4 },
//     { pos: { x: 7, y: 2 }, kind: 'viewpoint', count: 7 },
//     { pos: { x: 1, y: 6 }, kind: 'viewpoint', count: 3 },
//     { pos: { x: 2, y: 7 }, kind: 'viewpoint', count: 6 }
//   ],
//   sizeX: 9,
//   sizeY: 9
// };

// let game: Game = JSON.parse(
//   `{"board":[[0,0,0,1,0,1,0,0,2],[2,0,0,0,0,0,0,0,1],[1,0,1,0,0,1,0,0,0],[0,0,0,0,0,0,0,1,0],[0,0,0,0,0,0,0,0,0],[1,0,0,2,0,0,0,0,0],[1,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0]],"rules":[{"kind":"connected","color":1}],"symbols":[{"pos":{"x":1,"y":1},"kind":"area","count":5},{"pos":{"x":2,"y":1},"kind":"dart","direction":"down","count":5},{"pos":{"x":1,"y":2},"kind":"viewpoint","count":5},{"pos":{"x":3,"y":3},"kind":"area","count":5},{"pos":{"x":4,"y":3},"kind":"dart","direction":"right","count":5},{"pos":{"x":3,"y":4},"kind":"viewpoint","count":5},{"pos":{"x":6,"y":6},"kind":"area","count":5},{"pos":{"x":7,"y":6},"kind":"dart","direction":"up","count":5},{"pos":{"x":6,"y":7},"kind":"viewpoint","count":5}],"sizeX":8,"sizeY":9}`
// );
// let game: Game = {
//   board: [],
//   rules: [
//     {
//       kind: 'connected',
//       color: Color.Black
//     }
//   ],
//   symbols: [
//     { pos: { x: 1, y: 1 }, kind: 'area', count: 5 },
//     { pos: { x: 2, y: 1 }, kind: 'dart', count: 5, direction: Direction.Down },
//     { pos: { x: 1, y: 2 }, kind: 'viewpoint', count: 5 },
//     { pos: { x: 3, y: 3 }, kind: 'area', count: 5 },
//     { pos: { x: 4, y: 3 }, kind: 'dart', count: 5, direction: Direction.Right },
//     { pos: { x: 3, y: 4 }, kind: 'viewpoint', count: 5 },
//     { pos: { x: 6, y: 6 }, kind: 'area', count: 5 },
//     { pos: { x: 7, y: 6 }, kind: 'dart', count: 5, direction: Direction.Up },
//     { pos: { x: 6, y: 7 }, kind: 'viewpoint', count: 5 }
//   ],
//   sizeX: 8,
//   sizeY: 9
// };

// let game: Game = JSON.parse(
//   `{"board":[[0,0,1,0,0,1,0,0,1,0,0,1],[0,0,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,0,0,1,0,0,1,0],[0,0,0,0,0,0,0,0,1,0,0,0],[1,0,0,1,0,0,1,0,0,1,0,0]],"rules":[],"symbols":[{"pos":{"x":4,"y":0},"kind":"area","count":4},{"pos":{"x":2,"y":1},"kind":"area","count":4},{"pos":{"x":0,"y":2},"kind":"area","count":4},{"pos":{"x":4,"y":3},"kind":"area","count":3},{"pos":{"x":2,"y":4},"kind":"area","count":3},{"pos":{"x":0,"y":5},"kind":"area","count":3},{"pos":{"x":4,"y":6},"kind":"area","count":4},{"pos":{"x":2,"y":7},"kind":"area","count":4},{"pos":{"x":0,"y":8},"kind":"area","count":4},{"pos":{"x":4,"y":9},"kind":"area","count":6},{"pos":{"x":2,"y":10},"kind":"area","count":6},{"pos":{"x":0,"y":11},"kind":"area","count":6}],"sizeX":5,"sizeY":12}`
// );
// let game: Game = {
//   board: [],
//   rules: [],
//   symbols: [
//     { pos: { x: 4, y: 0 }, kind: 'area', count: 4 },
//     { pos: { x: 2, y: 1 }, kind: 'area', count: 4 },
//     { pos: { x: 0, y: 2 }, kind: 'area', count: 4 },
//     { pos: { x: 4, y: 3 }, kind: 'area', count: 3 },
//     { pos: { x: 2, y: 4 }, kind: 'area', count: 3 },
//     { pos: { x: 0, y: 5 }, kind: 'area', count: 3 },
//     { pos: { x: 4, y: 6 }, kind: 'area', count: 4 },
//     { pos: { x: 2, y: 7 }, kind: 'area', count: 4 },
//     { pos: { x: 0, y: 8 }, kind: 'area', count: 4 },
//     { pos: { x: 4, y: 9 }, kind: 'area', count: 6 },
//     { pos: { x: 2, y: 10 }, kind: 'area', count: 6 },
//     { pos: { x: 0, y: 11 }, kind: 'area', count: 6 }
//   ],
//   sizeX: 5,
//   sizeY: 12
// };

// let game: Game = JSON.parse(`{"board":[[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,1,0,0,1,0,0,2],[2,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2],[2,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,2],[2,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,1,0,2],[2,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,2],[2,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,2],[2,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,2],[2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,2],[2,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,2],[2,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,2],[2,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,2],[2,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,2],[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,2],[2,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2],[2,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,2],[2,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,2],[2,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,2],[2,0,1,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,2],[2,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,2],[2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,2],[2,0,0,1,0,0,1,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]],"rules":[{"kind":"connected","color":1},{"kind":"connected","color":1}],"symbols":[{"kind":"viewpoint","pos":{"x":3,"y":1},"count":2},{"kind":"viewpoint","pos":{"x":2,"y":2},"count":6},{"kind":"viewpoint","pos":{"x":2,"y":4},"count":3},{"kind":"viewpoint","pos":{"x":2,"y":6},"count":3},{"kind":"viewpoint","pos":{"x":1,"y":7},"count":3},{"kind":"viewpoint","pos":{"x":1,"y":10},"count":4},{"kind":"viewpoint","pos":{"x":1,"y":15},"count":5},{"kind":"viewpoint","pos":{"x":1,"y":17},"count":3},{"kind":"viewpoint","pos":{"x":1,"y":20},"count":3},{"kind":"viewpoint","pos":{"x":2,"y":21},"count":2},{"kind":"viewpoint","pos":{"x":4,"y":4},"count":7},{"kind":"viewpoint","pos":{"x":5,"y":5},"count":3},{"kind":"viewpoint","pos":{"x":4,"y":8},"count":4},{"kind":"viewpoint","pos":{"x":3,"y":11},"count":9},{"kind":"viewpoint","pos":{"x":4,"y":12},"count":8},{"kind":"viewpoint","pos":{"x":3,"y":14},"count":8},{"kind":"viewpoint","pos":{"x":4,"y":16},"count":5},{"kind":"viewpoint","pos":{"x":5,"y":18},"count":7},{"kind":"viewpoint","pos":{"x":4,"y":19},"count":7},{"kind":"viewpoint","pos":{"x":4,"y":21},"count":2},{"kind":"viewpoint","pos":{"x":6,"y":21},"count":3},{"kind":"viewpoint","pos":{"x":7,"y":22},"count":5},{"kind":"viewpoint","pos":{"x":6,"y":1},"count":5},{"kind":"viewpoint","pos":{"x":8,"y":1},"count":3},{"kind":"viewpoint","pos":{"x":7,"y":4},"count":8},{"kind":"viewpoint","pos":{"x":9,"y":3},"count":6},{"kind":"viewpoint","pos":{"x":7,"y":8},"count":2},{"kind":"viewpoint","pos":{"x":9,"y":7},"count":2},{"kind":"viewpoint","pos":{"x":5,"y":10},"count":5},{"kind":"viewpoint","pos":{"x":6,"y":12},"count":3},{"kind":"viewpoint","pos":{"x":7,"y":14},"count":4},{"kind":"viewpoint","pos":{"x":8,"y":16},"count":6},{"kind":"viewpoint","pos":{"x":8,"y":19},"count":2},{"kind":"viewpoint","pos":{"x":10,"y":22},"count":5},{"kind":"viewpoint","pos":{"x":11,"y":20},"count":6},{"kind":"viewpoint","pos":{"x":10,"y":18},"count":5},{"kind":"viewpoint","pos":{"x":12,"y":19},"count":6},{"kind":"viewpoint","pos":{"x":12,"y":17},"count":6},{"kind":"viewpoint","pos":{"x":11,"y":13},"count":3},{"kind":"viewpoint","pos":{"x":10,"y":11},"count":7},{"kind":"viewpoint","pos":{"x":12,"y":10},"count":10},{"kind":"viewpoint","pos":{"x":13,"y":12},"count":3},{"kind":"viewpoint","pos":{"x":11,"y":6},"count":5},{"kind":"viewpoint","pos":{"x":11,"y":4},"count":3},{"kind":"viewpoint","pos":{"x":12,"y":3},"count":3},{"kind":"viewpoint","pos":{"x":13,"y":5},"count":5},{"kind":"viewpoint","pos":{"x":13,"y":1},"count":10},{"kind":"viewpoint","pos":{"x":15,"y":4},"count":8},{"kind":"viewpoint","pos":{"x":15,"y":7},"count":6},{"kind":"viewpoint","pos":{"x":16,"y":9},"count":6},{"kind":"viewpoint","pos":{"x":16,"y":1},"count":10},{"kind":"viewpoint","pos":{"x":17,"y":2},"count":2},{"kind":"viewpoint","pos":{"x":19,"y":2},"count":10},{"kind":"viewpoint","pos":{"x":21,"y":2},"count":9},{"kind":"viewpoint","pos":{"x":22,"y":3},"count":4},{"kind":"viewpoint","pos":{"x":19,"y":4},"count":7},{"kind":"viewpoint","pos":{"x":18,"y":5},"count":8},{"kind":"viewpoint","pos":{"x":19,"y":7},"count":11},{"kind":"viewpoint","pos":{"x":22,"y":6},"count":3},{"kind":"viewpoint","pos":{"x":22,"y":8},"count":5},{"kind":"viewpoint","pos":{"x":20,"y":9},"count":7},{"kind":"viewpoint","pos":{"x":19,"y":11},"count":12},{"kind":"viewpoint","pos":{"x":17,"y":11},"count":11},{"kind":"viewpoint","pos":{"x":20,"y":12},"count":7},{"kind":"viewpoint","pos":{"x":18,"y":13},"count":8},{"kind":"viewpoint","pos":{"x":22,"y":13},"count":9},{"kind":"viewpoint","pos":{"x":19,"y":15},"count":11},{"kind":"viewpoint","pos":{"x":22,"y":16},"count":9},{"kind":"viewpoint","pos":{"x":21,"y":17},"count":3},{"kind":"viewpoint","pos":{"x":21,"y":19},"count":3},{"kind":"viewpoint","pos":{"x":21,"y":21},"count":3},{"kind":"viewpoint","pos":{"x":20,"y":22},"count":9},{"kind":"viewpoint","pos":{"x":19,"y":19},"count":7},{"kind":"viewpoint","pos":{"x":18,"y":18},"count":5},{"kind":"viewpoint","pos":{"x":16,"y":19},"count":9},{"kind":"viewpoint","pos":{"x":17,"y":22},"count":4},{"kind":"viewpoint","pos":{"x":15,"y":22},"count":3},{"kind":"viewpoint","pos":{"x":14,"y":20},"count":5},{"kind":"viewpoint","pos":{"x":14,"y":16},"count":11},{"kind":"viewpoint","pos":{"x":16,"y":15},"count":6}],"sizeX":24,"sizeY":24}`);
