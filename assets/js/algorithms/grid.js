// Intitialises some variables for use across the system
var numRows;
var numCols;

// The speed at which each algorithm runs
var speed = 30;

// Stores a grid of cell objects
var grid = [];
var startX;
var startY;

var endX;
var endY;

// Used to store when the algorithm is running, so new walls cannot be added
var running = false;
var moveStart = false;
var moveGoal = false;

var html = document.getElementsByTagName("html")[0];

var downFlag = false;
var position = {
  X: 0,
  Y: 0
};

html.onmousedown = function (down) {
  downFlag = true;
  // Record click position
  position.X = down.clientX;
  position.Y = down.clientY;

  try {
    var cords = getCoordinates(event.srcElement.id);
    var x = cords[0];
    var y = cords[1];

    if(x == startX && y == startY){
      moveStart = true;
    }

    if(x == endX && y == endY){
      moveGoal = true;
    }
  }
  catch (e){
  }


};

html.onmouseup = function (up) {
  downFlag = false;
  moveStart = false;
  moveGoal = false;
};

// Colors tile black when the mouse drags over them
let move = function(){
  // If moving the start tile
  // If dragging a square we need to release it
  if(moveStart){
    try {
      var cords = getCoordinates(event.srcElement.id);
      var x = cords[0];
      var y = cords[1];

      var id = generateId(startX,startY);
      document.getElementById(id).style.cssText = "background-color:white;";
      id = generateId(x,y);
      document.getElementById(id).style.cssText = "background-color:purple;";

      startX = x;
      startY = y;
    }
    catch (e){
    }
  }

  if(moveGoal){
    try {
      var cords = getCoordinates(event.srcElement.id);
      var x = cords[0];
      var y = cords[1];

      var id = generateId(endX,endY);
      document.getElementById(id).style.cssText = "background-color:white;";
      id = generateId(x,y);
      document.getElementById(id).style.cssText = "background-color:purple;";

      endX = x;
      endY = y;
    }
    catch (e){
    }
  }

  if(downFlag && !running && !moveStart && !moveGoal){
    //alert("here");
    var cords = getCoordinates(event.srcElement.id);
    var x = cords[0];
    var y = cords[1];

    if(! ((x==startX && y==startY) || (x==endX && y==endY))){
      var id = event.srcElement.id;
      var td = document.getElementById(id);
      td.style.cssText = "background-color:#262626;";
      grid[x][y].filled=true;
    }

  }
}

// Clears the board except for the start and end positions
let clearBoard = function(){
  for(let i=0;i<numRows;i++){
    for(let j=0;j<numCols;j++){
      if((i==startX && j==startY) || (i==endX && j==endY)){
        var id = generateId(i,j);
        document.getElementById(id).style.cssText = "background-color:purple;";
      }else{
        var id = generateId(i,j);
        document.getElementById(id).style.cssText = "background-color:white;";
        grid[i][j].filled = false;
        grid[i][j].visited=false;
        grid[i][j].cost=0;
      }
    }
  }
  grid[endX][endY].visited=false;
}

// Clears the board except for start and end, and walls (removes the blue trails from various algorithms)
let clearTrail = function(){
  for(let i=0;i<numRows;i++){
    for(let j=0;j<numCols;j++){
      if((i==startX && j==startY) || (i==endX && j==endY) || grid[i][j].filled==true){
        continue;
      }else{

        // Restores the topography that was present
        if(grid[i][j].cost==5){
          var id = generateId(i,j);
          document.getElementById(id).style.cssText = "background-color:red;";
        }else if(grid[i][j].cost==2){
          makePink(i,j);
        }else if(grid[i][j].cost==1){
          makeLightPink(i,j);
        }else{
          var id = generateId(i,j);
          document.getElementById(id).style.cssText = "background-color:white;";
        }

        // Reset the tile for the new algorithm
        grid[i][j].visited=false;
      }
    }
  }

  // Set the goal node back to purple (turned yellow by the path discovered )
  var id = generateId(endX,endY);
  document.getElementById(id).style.cssText = "background-color:purple;";
  id = generateId(startX,startY);
  document.getElementById(id).style.cssText = "background-color:purple;";

  // Set the goal node to unvisited
  grid[endX][endY].visited=false;
}

// Resets the positions of the start and end goal nodes
let reset = function(){
  clearTrail();

  grid[startX][startY].start = false;
  grid[endX][endY].end = false;

  id = generateId(startX,startY);
  document.getElementById(id).style.cssText = "background-color:white;";
  var id = generateId(endX,endY);
  document.getElementById(id).style.cssText = "background-color:white;";

  startY = 1+Math.floor(Math.random()*6);
  startX = 2+ Math.floor(Math.random()*10);

  // Repeat until a non wall is selected
  while(grid[startX][startY].filled == true){
    startY = 1+Math.floor(Math.random()*6);
    startX = 2+ Math.floor(Math.random()*10);
  }

  endY = numCols - 2- Math.floor(Math.random()*6);
  endX = 2+ Math.floor(Math.random()*10);

  // Repeat until a non wall is selected
  while(grid[endX][endY].filled == true){
    endY = 1+Math.floor(Math.random()*6);
    endX = 2+ Math.floor(Math.random()*10);
  }

  id = generateId(startX,startY);
  document.getElementById(id).style.cssText = "background-color:purple;";
  id = generateId(endX,endY);
  document.getElementById(id).style.cssText = "background-color:purple;";
}

// Takes a table elements id and converts it into co-ordinates for the grid array
let getCoordinates = function(id){
  var x='';
  var y='';
  var flag = true;
  for(let i=0;i<id.length;i++){
    // Still on x part
    if(flag){
      x+=id.charAt(i);
    }else{
      y+=id.charAt(i);
    }
    if(id.charAt(i)=="_"){
      flag=false;
    }
  }

  return [parseInt(x),parseInt(y)];
}

// Takes a pair of co-ordinates and generates the id for them
let generateId = function(x,y){
  return x.toString()+"_"+y.toString();
}

// Called when the user clicks on a square to turn it to or from a wall
let insertWall = function(){
  if(!running){
    var cords = getCoordinates(event.srcElement.id);
    var x = cords[0];
    var y = cords[1];
    var id = event.srcElement.id;
    var td = document.getElementById(id);

    // Doesn't allow the start or end node to change
    if(! ((x==startX && y==startY) || (x==endX && y==endY))){
      // If filled, then unfill
      if(grid[x][y].filled == true){
        td.style.cssText = "background-color:white;";
        grid[x][y].filled=false;
      }else{
        td.style.cssText = "background-color:#262626;";
        grid[x][y].filled=true;
      }
    }
  }
}

// Disables the clearboard, run and reset positions buttons while the algorithm is running
let disableButtons = function(){
  document.getElementById('run').style.cssText  = "pointer-events:none;";
  document.getElementById('clearboard').style.cssText  = "pointer-events:none;";
  document.getElementById('reset').style.cssText  = "pointer-events:none;";
  document.getElementById('topography').style.cssText  = "pointer-events:none;";
  document.getElementById('clearTrail').style.cssText  = "pointer-events:none;";
  document.getElementById('walls').style.cssText  = "pointer-events:none;";

  running = true;
}

// Re-enables the buttons
let renableButtons = function(){
  document.getElementById('run').style.cssText  = "pointer-events:auto;";
  document.getElementById('clearboard').style.cssText  = "pointer-events:auto;";
  document.getElementById('reset').style.cssText  = "pointer-events:auto;";
  document.getElementById('topography').style.cssText  = "pointer-events:auto;";
  document.getElementById('clearTrail').style.cssText  = "pointer-events:auto;";
  document.getElementById('walls').style.cssText  = "pointer-events:auto;";

  running = false;
}

// This function is called when the run button is pressed
let runAlgorithm = function(){

  // Disable the buttons so they cannot influence the search
  disableButtons();
  // Clear any previous trails
  clearTrail();
  //var choice = document.getElementById('algorithms').value;
  var choice = document.getElementById('algorithmSelectBox').value;
  switch(choice){
    case "a":
      astar();
      break;
    case "dj":
      dijkstra();
      break;
    case "bfs":
      bfs();
      break;
    case "dfs":
      dfs();
      break;
    case "greedy":
      greedy();
      break;
    case "low":
      lowestcost();
      break;
  }

}


// This function creates the table on the screen
let createTable = function(){
  var table = document.querySelector("table");
  for(let i=0;i<numRows;i++){
    var row = table.createTHead().insertRow();
    for(let j=0;j<numCols;j++){
      var td = document.createElement("td");
      var att = document.createAttribute("class");
      att.value = "table_data";
      td.setAttributeNode(att);
      var id = document.createAttribute("id");
      id.value = i.toString()+"_"+j.toString();
      td.setAttributeNode(id);
      var omm = document.createAttribute("onmousemove");
      omm.value = "move()";
      td.setAttributeNode(omm);
      var omc = document.createAttribute("onclick");
      omc.value = "insertWall()";
      td.setAttributeNode(omc);
      row.appendChild(td);
    }
  }
}


// This is the main function being run when the page is loaded
let generateGrid = function(){
  var width = 0.8 * window.innerWidth;
  var height = (0.7 * window.innerHeight);

  numRows = Math.floor(height/20);
  numCols = Math.floor(width/20);

  // Creates the table depending on the width of the screen
  createTable();


  for(let i=0;i<numRows;i++){
    var newRow =[];
    for(let j=0;j<numCols;j++){
      var newCell = new Cell();
      newCell.x=i;
      newCell.y=j;
      newCell.cost=0;
      newRow.push(newCell);
    }
    grid.push(newRow);
  }

  // Selects a random location for the start and end
  startY = 1+Math.floor(Math.random()* (numCols/3));
  startX = 2+ Math.floor(Math.random()* (numRows-3));

  endY = numCols - 2- Math.floor(Math.random()*(numCols/3));
  endX = 2+ Math.floor(Math.random()*(numRows -3));


  // Colours the start and end squares
  grid[startX][startY].start=true;
  grid[endX][endY].end=true;
  var id = generateId(startX,startY);
  document.getElementById(id).style.cssText = "background-color:purple;";
  id = generateId(endX,endY);
  document.getElementById(id).style.cssText = "background-color:purple;";

}
