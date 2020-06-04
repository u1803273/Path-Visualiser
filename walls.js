/* GENERATES THE RANDOM MAZES AND WALLS */

var finishedMaze;
var filled;
var squares;

let mazeChangeSmall = function(){
  finishedMaze=false;
  filled=0;
  //var choice = document.getElementById("mazeselect").value;
  var select = document.getElementById("mazeselectsmall");
  var choice = select.options[select.selectedIndex].value;
  switch(choice){
    case "random":
      randomMaze();
      break;
    case "recursive":
      recursiveMaze();
      break;
  }
}

// Handles the changing maze select box
let mazeChangeLarge = function(){
  finishedMaze=false;
  filled=0;
  //var choice = document.getElementById("mazeselect").value;
  var select = document.getElementById("mazeselectlarge");
  var choice = select.options[select.selectedIndex].value;
  switch(choice){
    case "random":
      randomMaze();
      break;
    case "recursive":
      recursiveMaze();
      break;
  }
}

let randomMaze = function(){
  clearBoard();
  squares = [];
  for(let i=0;i<numRows;i++){
    var newRow = [];
    for(let j=0;j<numCols;j++){
      // Already filled then set validity to false as it should not be in contention
      if(grid[i][j].filled==true){
        newRow.push({valid:false});
        filled ++;
      }else{
        newRow.push({valid:true,x:i,y:j});
      }
    }
    squares.push(newRow);
  }

  disableButtons();
  random();
}

// Repeats until the maze meets a certain density
let random = function(){
  var percentage = filled/(numCols*numRows);

  // Do not want any more than 40% of the squares to be filled
  if(percentage>0.4){
    finishedMaze=true;
  }
  // Add some more squares
  else{
    // Select a random square from the squares grid, as long as it is legal
    var row = Math.floor(Math.random()*numRows);
    var col = Math.floor(Math.random()*numCols);
    var square = squares[row][col];
    //alert("selected square: "+square.x+" "+square.y);
    // While this square wasn't valid
    while(!checkSquare(square.x,square.y) && squares.length>1){
      // As not valid, remove from future contention
      squares[row][col].valid = false;
      // Generate a new square
      row = Math.floor(Math.random()*numRows);
      col = Math.floor(Math.random()*numCols);
      square = squares[row][col];
    }

    //alert("found square: "+square.x+" "+square.y);

    // Color the square
    var id = generateId(square.x,square.y);
    document.getElementById(id).style.cssText = "background-color:#262626;";
    grid[square.x][square.y].filled=true;

    var currentSquare = square;
    var neighbours = [];
    var iteration = 2;
    var doneExpanding = false;
    do{
      filled++;
      currentSquare.valid=false;

      // Add the four neighbours to the array (assuming they're legal)
      if(checkSquare(currentSquare.x-1,currentSquare.y)){neighbours.push(squares[currentSquare.x-1][currentSquare.y]);}
      if(checkSquare(currentSquare.x+1,currentSquare.y)){neighbours.push(squares[currentSquare.x+1][currentSquare.y]);}
      if(checkSquare(currentSquare.x,currentSquare.y-1)){neighbours.push(squares[currentSquare.x][currentSquare.y-1]);}
      if(checkSquare(currentSquare.x,currentSquare.y+1)){neighbours.push(squares[currentSquare.x][currentSquare.y+1]);}

      // No valid squares around the current square
      if(neighbours.length==0){
        doneExpanding = true;
      }else{
        // Now we determine the probability of colouring another square
        var probability = Math.random();
        if(Math.random()<(1/iteration)){
          var neighbourIndex = Math.floor(Math.random()*neighbours.length);
          var neighbour = neighbours[neighbourIndex];
          id = generateId(neighbour.x,neighbour.y);
          document.getElementById(id).style.cssText = "background-color:#262626;";
          grid[neighbour.x][neighbour.y].filled=true;

          currentSquare = neighbour;
        }else{
          doneExpanding = true;
        }
      }
    }while(doneExpanding==false);


  }

  if(!finishedMaze){
    setInterval(random,100);
    renableButtons();
  }
}

// A helper function that takes a square and checks it is legal
let checkSquare = function(x,y){
  if(x>=0 && x<numRows && y>=0 && y<numCols && squares[x][y].valid==true && !(x==startX && y==startY) && !(x==endX && y==endY)){
    return true;
  }
  return false;
}

// Generates the mazes recursively
let recursiveMaze = function(){
  // Clear the existing board
  clearBoard();

  // Set the borders to black
  borders();

  recursiveMazeGeneration(1,numRows-2,1,numCols-2);

  // Set the start and goal nodes
  var id = generateId(startX,startY);
  document.getElementById(id).style.cssText = "background-color:purple;";
  grid[startX][startY].filled = false;

  // If the four surrounding walls are walls remove them
  if(grid[startX-1])

  id = generateId(endX,endY);
  document.getElementById(id).style.cssText = "background-color:purple;";
  grid[endX][endY].filled = false;

}

let borders = function(){
  for(let i=0;i<numRows;i++){
    if(i==0 || i==numRows-1){
      for(let j =0;j<numCols;j++){
        var id = generateId(i,j);
        document.getElementById(id).style.cssText = "background-color:#262626;";
        grid[i][j].filled = true;
      }
    }else{
      var id = generateId(i,0);
      document.getElementById(id).style.cssText = "background-color:#262626;";
      grid[i][0].filled = true;
      id = generateId(i,numCols-1);
      document.getElementById(id).style.cssText = "background-color:#262626;";
      grid[i][numCols-1].filled=true;
    }
  }
}

// The recursive algorithm
// Takes the start and end x and y co-ordinates to recursively generate the maze between them
let recursiveMazeGeneration = function(sx, ex,sy,ey){
  if(ex-sx <2 || ey-sy<2){
    return true;
  }
  else{
    // console.log("");
    // console.log("in: ",sx,ex,sy,ey);

    var width=ex-sx;
    var height = ey-sy;
    var direction;
    if(width<height){
      direction="down";
    }
    else{
      direction = "across";
    }

    // Switch based on direction
    switch(direction){
      case "down":
        // console.log("down");
        // Randomly chose the point to drop dowm
        var point = Math.floor(Math.random()*height) + sy;
        drawVertLine(point,sx,ex);
        // Chose a random point to make a gap
        var gap = Math.floor(Math.random()*width) + sx;
        var id = generateId(gap,point);
        document.getElementById(id).style.cssText = "background-color:white;";
        grid[gap][point].filled = false;

        // LHS
        recursiveMazeGeneration(sx,ex,sy,point-2);
        // RHS
        recursiveMazeGeneration(sx,ex,point+2,ey);

        // console.log("---down---");
        // console.log("point: "+point);
        // console.log("gap: "+gap);
        // console.log(sx,gap-1,sy,point-1);
        // console.log(gap+1,ex,sy,point-1);
        // console.log(sx,gap-1,point+1,ey);
        // console.log(gap+1,ex,point+1,ey);
        //
        // recursiveMazeGeneration(sx,gap-1,sy,point-1);
        // recursiveMazeGeneration(gap+1,ex,sy,point-1);
        // recursiveMazeGeneration(sx,gap-1,point+1,ey);
        // recursiveMazeGeneration(gap+1,ex,point+1,ey);

        break;
      case "across":
        // console.log("across");
        // Randomly chose the point to go across
        var point = Math.floor(Math.random()*width) + sx;
        drawHorLine(point,sy,ey);
        // Chose a random point to make a gap
        var gap = Math.floor(Math.random()*height) + sy;
        var id = generateId(point,gap);
        document.getElementById(id).style.cssText = "background-color:white;";
        grid[point][gap].filled = false;

        // ABOVE
        recursiveMazeGeneration(sx,point-1,sy,ey);
        // BELOW
        recursiveMazeGeneration(point+1,ex,sy,ey);

        // console.log("---across---");
        // console.log("point: "+point);
        // console.log("gap: "+gap);
        // console.log(sx,point-1,sy,gap-1);
        // console.log(point+1,ex,sy,gap-1);
        // console.log(sx,point-1,gap+1,sy);
        // console.log(point+1,ex,gap+1,sy);
        //
        // recursiveMazeGeneration(sx,point-1,sy,gap-1);
        // recursiveMazeGeneration(point+1,ex,sy,gap-1);
        // recursiveMazeGeneration(sx,point-1,gap+1,ey);
        // recursiveMazeGeneration(point+1,ex,gap+1,ey);

        break;
    }
  }
}


// Draws a vertical line
let drawVertLine = function(y,sx,ex){
  for(let i=sx;i<=ex;i++){
    var id = generateId(i,y);
    document.getElementById(id).style.cssText = "background-color:#262626;";
    grid[i][y].filled = true;
  }
}

// Draws a horizontal line
let drawHorLine = function(x,sy,ey){
  for(let i=sy;i<=ey;i++){
    var id = generateId(x,i);
    document.getElementById(id).style.cssText = "background-color:#262626;";
    grid[x][i].filled = true;
  }
}
