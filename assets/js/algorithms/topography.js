/* STORES ALL THE CODE NECESSARY TO GENERATE THE RANDOM TOPOGRAPHY */

var surroundingSquares;
var finished;


// Clears the previous topography and sets all the costs back to 0
let clearTopography = function(){
  for(let i=0;i<numRows;i++){
    for(let j=0;j<numCols;j++){
      if(!(i==startX && j==startY) && !(i==endX && j==endY)){
        var id=generateId(i,j);
        document.getElementById(id).style.cssText="background-color:white";
        grid[i][j].cost=0;
      }
    }
  }
}

// Generates a random topography across the grid, and assigns costs to the various squares
let topography = function(){
  // Disables the buttons
  disableButtons();
  // Clears the previous topography
  clearTopography();

  // Sets the goal nodes to purple if they arent already
  var id=generateId(startX,startY);
  document.getElementById(id).style.cssText="background-color:purple;";
  id=generateId(endX,endY);
  document.getElementById(id).style.cssText="background-color:purple;";

  // Stores the number of peaks
  var numPeaks = 3;
  var peaks =[];
  for(let i=0;i<numPeaks;i++){
    // Randomly generate two squares to be the peaks of the topography
    var px=Math.floor(Math.random()*numRows) ;
    var py=Math.floor(Math.random()*numCols) ;
    if(px!=0){
      px=px-1;
    }
    if(py!=0){
      py=py-1;
    }

    while((px==startX && py == startY) || (px==endX && py == endY) || grid[px][py].cost!=0){
      px=Math.floor(Math.random()*numRows) ;
      py=Math.floor(Math.random()*numCols) ;
      if(px!=0){
        px=px-1;
      }
      if(py!=0){
        py=py-1;
      }
    }

    // Color the peak bright red and give it a cost of 5
    var id = generateId(px,py);
    document.getElementById(id).style.cssText = "background-color:red;";
    grid[px][py].cost=5;

    // Add to the peaks array
    peaks.push({x:px,y:py,type:5});
  }

  // This stores all the surrounding squares
  surroundingSquares = peaks;
  finished = false;
  topographyLoop();
}

// Runs the loop
let topographyLoop = function(){
  if(surroundingSquares.length ==0){
    finished = true;
  }else{
    // Type 2 is the dark pink that has a cost of 2: it spawns a neighbour of cost 2 with probability 0.5
    // and a neightbour of type 1, and cost 1, of probability 0.5.
    // Type 1 spawns a neighbour of type 1 with probability 0.8

    var currentX = surroundingSquares[0].x;
    var currentY = surroundingSquares[0].y;
    var currentType = surroundingSquares[0].type;

    // Checks that the square is within the grid, is not coloured already, is not a wall or the start or end nodes

    // Left
    if(currentY-1>=0 && grid[currentX][currentY-1].cost==0 && grid[currentX][currentY-1].filled==false && grid[currentX][currentY-1].end==false && grid[currentX][currentY-1].start==false){
        determineColour(currentX,currentY-1,currentType);
    }
    // Top Left
    if(currentY-1>=0 && currentX-1>=0 && grid[currentX-1][currentY-1].cost==0 && grid[currentX-1][currentY-1].filled==false && grid[currentX-1][currentY-1].end==false && grid[currentX-1][currentY-1].start==false){
        determineColour(currentX-1,currentY-1,currentType);
    }
    // Up
    if(currentX-1>=0 && grid[currentX-1][currentY].cost==0 && grid[currentX-1][currentY].filled==false && grid[currentX-1][currentY].end==false && grid[currentX-1][currentY].start==false){
        determineColour(currentX-1,currentY,currentType);
    }
    // Top Right
    if(currentX-1>=0 && currentY+1<numCols && grid[currentX-1][currentY+1].cost==0 && grid[currentX-1][currentY+1].filled==false && grid[currentX-1][currentY+1].end==false && grid[currentX-1][currentY+1].start==false){
        determineColour(currentX-1,currentY+1,currentType);
    }
    // Right
    if(currentY+1<numCols && grid[currentX][currentY+1].cost==0 && grid[currentX][currentY+1].filled==false && grid[currentX][currentY+1].end==false && grid[currentX][currentY+1].start==false){
        determineColour(currentX,currentY+1,currentType);
    }
    // Bottom Right
    if(currentX+1<numRows && currentY+1<numCols && grid[currentX+1][currentY+1].cost==0 && grid[currentX+1][currentY+1].filled==false && grid[currentX+1][currentY+1].end==false && grid[currentX+1][currentY+1].start==false){
        determineColour(currentX+1,currentY+1,currentType);
    }
    // Down
    if(currentX+1<numRows && grid[currentX+1][currentY].cost==0 && grid[currentX+1][currentY].filled==false && grid[currentX+1][currentY].end==false && grid[currentX+1][currentY].start==false){
        determineColour(currentX+1,currentY,currentType);
    }
    // Bottom Left
    if(currentX+1<numRows && currentY-1>=0 && grid[currentX+1][currentY-1].cost==0 && grid[currentX+1][currentY-1].filled==false && grid[currentX+1][currentY-1].end==false && grid[currentX+1][currentY-1].start==false){
        determineColour(currentX+1,currentY-1,currentType);
    }

    surroundingSquares.shift();
  }

  if (!finished) {
    setTimeout(topographyLoop, 30);
  }else{
    // renables the buttons
    renableButtons();
  }

}

// Determines which color to add to the grid
let determineColour = function(x,y,type){
  // If type ==5 then 75% chance of the neighbour being pink
  if(type==5){
    var random = Math.random();
    if(random<0.75){
      makePink(x,y);
      surroundingSquares.push({x:x,y:y,type:2});
    }
    else{
      makeLightPink(x,y);
      surroundingSquares.push({x:x,y:y,type:1});
    }
  }
  // If type ==2, then 50% chance of spawning itself
  else if(type==2){
    var random = Math.random();
    if(random<0.2){
      // Set the color to dark pink
      makePink(x,y);
      // Updates the new square in the array
      surroundingSquares.push({x:x,y:y,type:2});
    }else{
      // Set color to light pink
      makeLightPink(x,y);
      // Update the new square in the array
      surroundingSquares.push({x:x,y:y,type:1});
    }
  }

  // If type ==1 then 80% of swawning itself
  else{
    var random = Math.random();
    if(random<0.20){
      makeLightPink(x,y);
      surroundingSquares.push({x:x,y:y,type:1});
    }
  }


}

// Takes a pair of co-ordinates and sets it to pink
let makePink = function(x,y){
  grid[x][y].cost=2;
  var id = generateId(x,y);
  document.getElementById(id).style.cssText="background-color:#EC404B;";
}

// Takes a pair of co-ordinates and sets it to light pink
let makeLightPink = function(x,y){
  grid[x][y].cost=1;
  var id = generateId(x,y);
  document.getElementById(id).style.cssText="background-color:#F5A4A9;";
}
