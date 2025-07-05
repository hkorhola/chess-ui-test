let board = null;
const game = new Chess();

const WINGREETING = "Onnea, voitit robotin!";
const DRAWGREETING = "Hieno suoritus, tasapeli robottia vastaan!";
const LOSSGREETING = "Sait kuonoosi robotilta, harmi";
const PIECESCORES = {
  p: 100,
  n: 300,
  b: 500,
  r: 500,
  k: 1000,
  q: 1000,
};

// do not pick up pieces if the game is over
// only pick up pieces for White
const onDragStart = (source, piece, position, orientation) => {
  if (game.in_checkmate() === true || game.in_draw() === true ||
    piece.search(/^b/) !== -1) {
    return false;
  }
};

const makeRandomMove = () => {
  const possibleMoves = game.moves();

  // game over
  if (possibleMoves.length === 0) return;

  const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIndex]);
  board.position(game.fen());

  const message = isGameFinished(game, 'robot');
  if (message){
    $("#resultMessage").text(message);
  }
};

const onDrop = (source, target) => {
  // see if the move is legal
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';

  console.log("move is:");
  console.log(move);

  console.log("moves are:");
  console.log(game.moves({ verbose: true }));

  const message = isGameFinished(game, 'player');
  if (message){
    $("#resultMessage").text(message);
  }

  // make random legal move for black
  // window.setTimeout(makeRandomMove, 250);

  const whites = game["SQUARES"]
  .map(sq => game.get(sq))
  .filter(pos => pos && pos.color === "w");

  //console.log(blacks);
  calculateScore(whites);

  let currentBoard = game;
  const possibleMoves = game.moves({ verbose: true });
  const capturingMoves = possibleMoves.filter(move => move.captured);
  console.log(capturingMoves);
  const bestCapturingMove = capturingMoves.map(move => console.log(Math.min(PIECESCORES[move.piece]))); //eat with the least valuable piece
  console.log(bestCapturingMove);

  const currentBoardFen = game.fen();
  console.log(currentBoardFen);
    if(capturingMoves.length > 0){
        currentBoard.move(capturingMoves[0]);
    } else{
      window.setTimeout(makeRandomMove,500);
    }
  console.log(currentBoard.fen());
  const possibleMovesAfterFirstMove = 
  console.log()
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
const onSnapEnd = () => {
  board.position(game.fen());
  //game["SQUARES"].map(sq => {console.log("square " + sq + " is " + game.get(sq));})
  //game["SQUARES"].map(sq => {console.log(game.get(sq));})

};

const cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};

const calculateScore = (pieces) => {
  score = 0;

  //pieces.map(p => console.log(PIECESCORES[p.type]));
  const cumScore = pieces.reduce((accumulator, currentValue, currentIndex, array) => {return accumulator + PIECESCORES[currentValue.type]}, 0);
  console.log("cumulative score opponent: " + cumScore);
};

const isGameFinished = (game, player) => {
  //console.log(game);  
  console.log("chessmate? " + player + " " + game.in_checkmate());
  console.log("draw? " + player + " " + game.in_draw());
  if (game.in_checkmate() && player === 'player'){
    return WINGREETING;
  } else if (game.in_checkmate() && player === 'robot') {
    return LOSSGREETING;
  } else if (game.in_draw()) {
    return DRAWGREETING;
  }
  return false;
}

board = ChessBoard('board', cfg);