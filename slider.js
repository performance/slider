// ref:
// http://www.sitepoint.com/image-manipulation-with-html5-canvas-a-sliding-puzzle-2/
// http://www.homeandlearn.co.uk/JS/html5_canvas_keyboard_keys.html
// http://www.ibm.com/developerworks/library/wa-games/

// alert( "welcome to js land");

// enhancements:
// 0. randomize the image with an input seed [ default 0 ]
// 1. display the target to the right of the puzzle
// 2. another input area to enter desired moves  <-- DONE
// 3. button to play it back.
// 4. some way to control playback speed
// 5. track speeds, time taken etc.
// 6. ability to change the image.
// 7. share with friends

// alert( "slide.js loaded ");

var context = document.getElementById('puzzle').getContext('2d');

var target_context = document.getElementById('puzzle_final').getContext('2d');

var img = new Image();
img.src = 'http://tcktcktck.org/wp-content/uploads/2013/01/3226723901_1ca63f09cb_b.jpg'
// web search for creative commons images of flowers
// 'http://www.brucealderman.info/Images/dimetrodon.jpg';
img.addEventListener('load', drawOnImageLoad, false);

var puzzleWidth = document.getElementById('puzzle').width;
var tilesPerSide = 3; // document.getElementById('scale').value;

var tileSize = puzzleWidth / tilesPerSide;

var clickLoc = new Object;
clickLoc.x = 0;
clickLoc.y = 0;

var emptyLoc = new Object;
emptyLoc.x = 0;
emptyLoc.y = 0;

var solved = false;

var gridOfTiles;
createGridOfTiles();
renderGridOfTiles();


// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.offsetLeft
document.getElementById('puzzle').onclick = function(e)
{
  document.getElementById("puzzle").focus();
  clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize);
  clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize);
  var input = neighbor( clickLoc, emptyLoc );
  if ( input.isNeighbor )
  {
    executeMove( input.move )
    // swapTiles( emptyLoc, clickLoc );
    renderGridOfTiles();
  }
  showSolvedMessage();
};

function neighbor( clickLoc, emptyLoc )
{
  var isNeighbor = false;
  var move = '';
  var distance = Math.abs(clickLoc.x - emptyLoc.x) + Math.abs(clickLoc.y - emptyLoc.y);
  if ( 1 == distance )
    isNeighbor = true;

  if ( isNeighbor )
  {
    if( clickLoc.x > emptyLoc.x )
    {
      move = 'L';
    }
    else if ( clickLoc.x < emptyLoc.x )
    {
      move = 'H';
    }
    else if ( clickLoc.y > emptyLoc.y )
    {
      move = 'J';
    }
    else if ( clickLoc.y < emptyLoc.y )
    {
      move = 'K';
    }
  }
  return { isNeighbor : isNeighbor, move: move };
}


// function handleKeyPressed( event )
// window.addEventListener( "keypress", handleKeyPressed, false );

// http://www.w3.org/WAI/WCAG20/Techniques/working-examples/SCR29/action-on-div.html
document.getElementById("main").onkeyup = handleOnKeyUp;
document.getElementById("input_moves").onkeyup = handleOnKeyUp;

function handleOnKeyUp(event)
{
  // alert( " in on key up handler ");
  var e = event;
  if ( window.event )
  {
    e = window.event;
  }

  // alert( e.keyCode );

  if ( ( 106 == e.keyCode ) || ( 74 == e.keyCode ) ) // 'J'
  {
    if ( emptyLoc.y < ( tilesPerSide -1 ) )
    {
      clickLoc.x = emptyLoc.x;
      clickLoc.y = emptyLoc.y + 1;
    }
  }
  else if ( ( 107 == e.keyCode ) || ( 75 == e.keyCode ) ) // 'K'
  {
    if ( 0 < emptyLoc.y )
    {
      clickLoc.x = emptyLoc.x;
      clickLoc.y = emptyLoc.y - 1;
    }
  }
  else if ( ( 104 == e.keyCode ) || ( 72 == e.keyCode ) ) // 'H'
  {
    if ( emptyLoc.x > 0 )
    {
      clickLoc.x = emptyLoc.x - 1;
      clickLoc.y = emptyLoc.y;
    }
  }
  else if ( ( 108 == e.keyCode ) || ( 76 == e.keyCode ) ) // 'L'
  {
    if ( emptyLoc.x < ( tilesPerSide -1 ) )
    {
      clickLoc.x = emptyLoc.x + 1;
      clickLoc.y = emptyLoc.y;
    }
  }
  var input = neighbor( clickLoc, emptyLoc );
  if ( input.isNeighbor )
  {
    executeMove( input.move );
    renderGridOfTiles();
  }
  showSolvedMessage();
}

function showSolvedMessage()
{
  // alert( " puzzle state is: " + solved );
  if (solved)
  {
    var moves_made = document.getElementById("moves_made").innerHTML;
    setTimeout(
      function()
      {
        alert("You solved it! in " + moves_made.length - 1 );
      },
      500
    ); // wait half a second
  }
}

function createGridOfTiles() {
  gridOfTiles = new Array(tilesPerSide);
  // alert( " gridOfTiles allocated ");
  for (var i = 0; i < tilesPerSide; ++i) {
    gridOfTiles[i] = new Array(tilesPerSide);
    for (var j = 0; j < tilesPerSide; ++j) {
      gridOfTiles[i][j] = new Object;
      gridOfTiles[i][j].x = (tilesPerSide - 1) - i;
      gridOfTiles[i][j].y = (tilesPerSide - 1) - j;
    }
  }
  emptyLoc.x = gridOfTiles[tilesPerSide - 1][tilesPerSide - 1].x;
  emptyLoc.y = gridOfTiles[tilesPerSide - 1][tilesPerSide - 1].y;
  solved = false;
}

function renderGridOfTiles() {
  context.clearRect ( 0 , 0 , puzzleWidth , puzzleWidth );
  for (var i = 0; i < tilesPerSide; ++i) {
    for (var j = 0; j < tilesPerSide; ++j) {
      var x = gridOfTiles[i][j].x;
      var y = gridOfTiles[i][j].y;
      if(i != emptyLoc.x || j != emptyLoc.y || solved == true) {
        context.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize,
            i * tileSize, j * tileSize, tileSize, tileSize);
      }
    }
  }
}

function drawOnImageLoad() {
  renderGridOfTiles();
  target_context.clearRect ( 0 , 0 , puzzleWidth , puzzleWidth );
  target_context.drawImage(img, 0,0 );
}

function executeMove( move )
{
  if (!solved) {
    var blankTile   = emptyLoc;
    var selectedTile = clickLoc;
    if ( 'H' == move )
    {
      selectedTile.x = blankTile.x - 1;
      selectedTile.y = blankTile.y    ;
    }
    else if ( 'L' == move )
    {
      selectedTile.x = blankTile.x + 1;
      selectedTile.y = blankTile.y    ;
    }
    else if ( 'J' == move )
    {
      selectedTile.x = blankTile.x    ;
      selectedTile.y = blankTile.y + 1;
    }
    else if ( 'K' == move )
    {
      selectedTile.x = blankTile.x    ;
      selectedTile.y = blankTile.y - 1;
    }

    swapTiles(blankTile, selectedTile);
    document.getElementById("moves_made").innerHTML += move;
  }

}
function checkIfSolved() {
  var flag = true;
  for (var i = 0; ( ( flag ) && ( i < tilesPerSide ) ); ++i) {
    for (var j = 0; j < tilesPerSide; ++j) {
      if (gridOfTiles[i][j].x != i || gridOfTiles[i][j].y != j) {
//        alert( " i = " + i  + " j = " + j + "gtx,y = " + gridOfTiles[i][j].x + "," + gridOfTiles[i][j].y );
        flag = false;
        break;
      }
    }
  }
  solved = flag;
}


function swapTiles(blankTile, selectedTile) {
  if (!solved) {
    gridOfTiles[blankTile.x][blankTile.y].x = gridOfTiles[selectedTile.x][selectedTile.y].x;
    gridOfTiles[blankTile.x][blankTile.y].y = gridOfTiles[selectedTile.x][selectedTile.y].y;
    gridOfTiles[selectedTile.x][selectedTile.y].x = tilesPerSide - 1;
    gridOfTiles[selectedTile.x][selectedTile.y].y = tilesPerSide - 1;
    blankTile.x = selectedTile.x;
    blankTile.y = selectedTile.y;
    checkIfSolved();
    // var keyPressed = '';
    // if ( blankTile.x > selectedTile.x )
    // {
    //   keyPressed = 'H';
    // }
    // else if ( blankTile.x < selectedTile.x )
    // {
    //   keyPressed = 'L';
    // }
    // else if ( blankTile.y > selectedTile.y )
    // {
    //   keyPressed = 'K';
    // }
    // else if ( blankTile.y < selectedTile.y )
    // {
    //   keyPressed = 'J';
    // }
    // document.getElementById("moves_made").innerHTML += keyPressed;
  }
}

