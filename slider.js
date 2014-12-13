// ref:
// http://www.sitepoint.com/image-manipulation-with-html5-canvas-a-sliding-puzzle-2/
// http://www.sitepoint.com/image-manipulation-with-html5-canvas-a-sliding-puzzle-2/
// http://www.homeandlearn.co.uk/JS/html5_canvas_keyboard_keys.html
// http://www.ibm.com/developerworks/library/wa-games/

// alert( "welcome to js land");

// enhancements:
// 0. randomize the image with an input seed [ default 0 ]
// 1. display the target to the right of the puzzle
// 2. another input area to enter desired moves
// 3. button to play it back.
// 4. some way to control playback speed
// 5. track speeds, time taken etc.
// 6. ability to change the image.
// 7. share with friends
var puzzle_context = document.getElementById('puzzle').getContext('2d');
var target_context = document.getElementById('target').getContext('2d');
var img = new Image();
// img.src = 'https://www.jigsawexplorer.com/puzzles/subjects/lotus-flower-383x300.jpg'
img.addEventListener('load', onImageLoad, false);

img.src = 'http://tcktcktck.org/wp-content/uploads/2013/01/3226723901_1ca63f09cb_b.jpg'
// img.src = 'http://www.brucealderman.info/Images/dimetrodon.jpg';
// img.addEventListener('load', drawTiles, false);
// web search for creative commons images of flowers

var boardSize = document.getElementById('puzzle').width;
var numTiles = 3; // document.getElementById('scale').value;

var tileSize = boardSize / numTiles;

var selectedTile = new Object;
selectedTile.x = 0;
selectedTile.y = 0;

var blankTile = new Object;
blankTile.x = 0;
blankTile.y = 0;

var solved = false;

var gridOfTiles;
createGridOfTiles();
drawTiles();




window.addEventListener( "keypress", doKeyDown, false );

function doKeyDown( e )
{
  // alert( "hi neelu : " + e + " code is : " + e.keyCode  );



         if ( 108 == e.keyCode )
  {
    selectedTile.x = blankTile.x + 1;
    selectedTile.y = blankTile.y;
  } else if ( 107 == e.keyCode )
  {
    selectedTile.x = blankTile.x;
    selectedTile.y = blankTile.y - 1;
  } else if ( 106 == e.keyCode )
  {
    selectedTile.x = blankTile.x;
    selectedTile.y = blankTile.y + 1;
  } else if ( 104 == e.keyCode )
  {
    selectedTile.x = blankTile.x - 1;
    selectedTile.y = blankTile.y;
  }

  // alert( " blankTile (" + blankTile.x + "," + blankTile.y + ")" +
  //        " selectedTile (" + selectedTile.x + "," + selectedTile.y + ")"
  //      );

  swapTiles( blankTile, selectedTile );
  drawTiles();
  if (solved) {
    setTimeout(function() {alert("You solved it!");}, 500);
  }
}

document.getElementById('puzzle').onclick = function(e) {
  selectedTile.x = Math.floor((e.pageX - this.offsetLeft) / tileSize);
  selectedTile.y = Math.floor((e.pageY - this.offsetTop) / tileSize);
  if ( neighbours( blankTile, selectedtile ) ) {
    swapTiles(blankTile, selectedTile);
    drawTiles();
  }
  if (solved) {
    setTimeout(function() {alert("You solved it!");}, 500);
  }
};

function createGridOfTiles() {
  // alert( "board set " + numTiles );

  gridOfTiles = new Array(numTiles);
  for (var i = 0; i < numTiles; ++i) {
    gridOfTiles[i] = new Array(numTiles);
    for (var j = 0; j < numTiles; ++j) {
      gridOfTiles[i][j] = new Object;
      gridOfTiles[i][j].x = (numTiles - 1) - i;
      gridOfTiles[i][j].y = (numTiles - 1) - j;
    }
  }
  blankTile.x = gridOfTiles[numTiles - 1][numTiles - 1].x;
  blankTile.y = gridOfTiles[numTiles - 1][numTiles - 1].y;
  solved = false;
}

function drawTiles() {
  // alert( "drawing tiles");
  puzzle_context.clearRect ( 0 , 0 , boardSize , boardSize );
  for (var i = 0; i < numTiles; ++i) {
    for (var j = 0; j < numTiles; ++j) {
      var x = gridOfTiles[i][j].x;
      var y = gridOfTiles[i][j].y;
      if(i != blankTile.x || j != blankTile.y || solved == true) {
        // api doc from http://www.w3schools.com/tags/canvas_drawimage.asp
        puzzle_context.drawImage(
          img,          // img              Specifies the image, canvas, or video element to use
          x * tileSize, // sx      Optional. The x coordinate where to start clipping
          y * tileSize, // sy      Optional. The y coordinate where to start clipping
          tileSize,     // swidth  Optional. The width  of the clipped image
          tileSize,     // sheight Optional. The height of the clipped image
          i * tileSize, // x                 The x coordinate where to place the image on the canvas
          j * tileSize, // y                 The y coordinate where to place the image on the canvas
          tileSize,     // width   Optional. The width  of the image to use (stretch or reduce the image)
          tileSize      // height  Optional. The height of the image to use (stretch or reduce the image)
        );
      }
    }
  }
}



function onImageLoad() {

  console.log( "image loaded ");
  createGridOfTiles();
  drawTiles();
  console.log( "tiles drawn " );
  target_context.drawImage( img, 0, 0 );
  console.log( "target drawn " );


}


function neighbours( emptyTile, selectedTile )
{
  var x1 = emptyTile.x;
  var x2 = selectedTile.x;
  var y1 = emptyTile.y;
  var y2 = selectedTile.y;
  var distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);
  var flag = ( 1 == distance );
  return flag;

}

function swapTiles(emptyTile, neighbouringTile) {
  if (!solved) {
    var keyPressed = '';
    gridOfTiles[emptyTile.x][emptyTile.y].x = gridOfTiles[neighbouringTile.x][neighbouringTile.y].x;
    gridOfTiles[emptyTile.x][emptyTile.y].y = gridOfTiles[neighbouringTile.x][neighbouringTile.y].y;
    gridOfTiles[neighbouringTile.x][neighbouringTile.y].x = numTiles - 1;
    gridOfTiles[neighbouringTile.x][neighbouringTile.y].y = numTiles - 1;
    // check which way they moved.
    // this needs to be decoupled and tested.
    if ( emptyTile.x > neighbouringTile.x )
    {
      keyPressed = 'H';
    }
    else if ( emptyTile.x < neighbouringTile.x )
    {
      keyPressed = 'L';
    }
    if ( emptyTile.y > neighbouringTile.y )
    {
      keyPressed = 'K';
    }
    else if ( emptyTile.y < neighbouringTile.y )
    {
      keyPressed = 'J';
    }
    document.getElementById("moves_made").innerHTML += keyPressed;
    emptyTile.x = neighbouringTile.x;
    emptyTile.y = neighbouringTile.y;
    checkIfSolved();
  }
}

function checkIfSolved() {
  var flag = true;
  for (var i = 0; i < numTiles; ++i) {
    for (var j = 0; j < numTiles; ++j) {
      if (gridOfTiles[i][j].x != i || gridOfTiles[i][j].y != j) {
        flag = false;
      }
    }
  }
  solved = flag;
}
