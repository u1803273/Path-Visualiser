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

  // Now we've cleared the board, we have to restore the topography that was present
  // for(let i=0;i<numRows;i++){
  //   for(let j=0;j<numCols;j++){
  //     if(grid[i][j].cost==5){
  //       var id = generateId(i,j);
  //       document.getElementById(id).style.cssText = "background-color:red;";
  //     }else if(grid[i][j].cost==2){
  //       makePink(i,j);
  //     }else if(grid[i][j].cost==1){
  //       makeLightPink(i,j);
  //     }
  //   }
  // }

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
  document.getElementById('randomWalls').style.cssText  = "pointer-events:none;";

  running = true;
}

// Re-enables the buttons
let renableButtons = function(){
  document.getElementById('run').style.cssText  = "pointer-events:auto;";
  document.getElementById('clearboard').style.cssText  = "pointer-events:auto;";
  document.getElementById('reset').style.cssText  = "pointer-events:auto;";
  document.getElementById('topography').style.cssText  = "pointer-events:auto;";
  document.getElementById('clearTrail').style.cssText  = "pointer-events:auto;";
  document.getElementById('randomWalls').style.cssText  = "pointer-events:auto;";

  running = false;
}

// This function is called when the run button is pressed
let runAlgorithm = function(){

  // Disable the buttons so they cannot influence the search
  disableButtons();
  // Clear any previous trails
  clearTrail();
  var choice = document.getElementById('algorithms').value;
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

// Used to listen to changing select events
let infoChange = function(){
  var select = document.getElementById("algorithms");
  var value = select.options[select.selectedIndex].value;
  if (value == "a"){
    astarInfo();
  }else if(value=="dj"){
    djInfo();
  }else if(value=="bfs"){
    bfsInfo();
  }else{
    dfsInfo();
  }
}

// This sets the information on the LHS to be about hill climb
let hillClimbInfo = function(){
  document.getElementById("title").innerHTML = "HILL CLIMB";
  document.getElementById("subtitle").innerHTML = "A greedy search that finds a maximum point";
  document.getElementById("text-para1").innerHTML = "A hill climb has no goal, and no intuition of a 'path' to follow. It simply examines all of it's neighbours, and moves to the one with the greatest cost (aiming to find a peak).";
  document.getElementById("text-para2").innerHTML = "However, a hill climb may get stuck at local maxima, where all surrounding squares are worse. The agent has no way to determine if there is a greater peak somewhere else.";
  document.getElementById("text-para3").innerHTML = "It may also get stuck on a plateau. Run the hill climb algorithm on a blank grid and it will wander aimlessly. The algorithm cuts off after twenty steps without improvement.";
}

// This sets the information on the LHS to be about A* search
let astarInfo = function(){
  document.getElementById("title").innerHTML = "A* SEARCH";
  document.getElementById("subtitle").innerHTML = "An optimal search utilising heuristics";
  document.getElementById("text-para1").innerHTML = "A* search combines "+"g".italics()+" and "+"h".italics()+" costs to determine the cost of each cell.";
  document.getElementById("text-para2").innerHTML = "Each cell has the distance from the source, the cost of that square (determined by the topography) and an estimated distance to the goal summed together, and at each turn, the square with the smallest value is selected.";
  document.getElementById("text-para3").innerHTML = "It will always find the shortest route, as it hones in on the target, always picking the square closest to leading it to the target";
}

// This sets the infomation on the LHS to be about Dijkstra's algorithm
let djInfo = function(){
  document.getElementById("title").innerHTML = "DIJKSTRA";
  document.getElementById("subtitle").innerHTML = "Finds the path of least cost but not necessarily of shortest length";
  document.getElementById("text-para1").innerHTML = "Dijkstra's algorithm assigns each square a distance, intitially of positive infinity. Unvisited squares are considered in order, the square with the smallest current distance prioritised. ";
  document.getElementById("text-para2").innerHTML = "For each square, the distance of the new path is calculated (by summing the path cost, and the cost of that square). If this is less than the current cost, the cost is updated. This guarantees that the shortest path is found from the start square, to every other square on the grid.";
  document.getElementById("text-para3").innerHTML = "When ran on a weighted topography, the algorithm will find the path of least cost, avoiding expensive peaks. When run on a blank grid, it operates the same way as a BFS search.";

}

// This sets the infomation on the LHS to be about BFS algorithm
let bfsInfo = function(){
  document.getElementById("title").innerHTML = "BREADTH FIRST SEARCH";
  document.getElementById("subtitle").innerHTML = "Guaranteed to find the optimal path";
  document.getElementById("text-para1").innerHTML = "BFS visits square in an uninformed manner. It has no intuition of which square is 'best', or which square is more likely to lead to the goal.";
  document.getElementById("text-para2").innerHTML = "Adjacent squares are stored in a queue, and are visited in turn, examined to check whether the goal has been reached, and if not, then are added to the back of the queue. If run on amaze, the algorithm will branch down multiple pathways simultaneously.";
  document.getElementById("text-para3").innerHTML = "The algorithm also has no intuition of path cost, and so if run on a topography, will ignore any associated path costs and treat the grid as if it were blank.";

}

// This sets the infomation on the LHS to be about DFS algorithm
let dfsInfo = function(){
  document.getElementById("title").innerHTML = "DEPTH FIRST SEARCH";
  document.getElementById("subtitle").innerHTML = "Not guaranteed to find the optimal path";
  document.getElementById("text-para1").innerHTML = "DFS visits square in an uninformed manner. It has no intuition of which square is 'best', or which square is more likely to lead to the goal.";
  document.getElementById("text-para2").innerHTML = "Squares are stored in a stack, with the most recently visited squares the first to be explored. This causes the algorithm to branch, and then pursue a single branch until it cannot move any further, upon which the algorithm backtracks. If run on a maze, the algorithm will pursue a single branch way until either the goal is met or it hits a dead end, before backtracking and trying a different direction. ";
  document.getElementById("text-para3").innerHTML = "The algorithm also has no intuition of path cost, and so if run on a topography, will ignore any associated path costs and treat the grid as if it were blank.";

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

/* This pertains to the modal windows */

// Get the modal
var modal = document.getElementById("modal1");

// Get the <span> element that closes the modal
var span1 = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close")[1];
var span3 = document.getElementsByClassName("close")[2];

// When the user clicks on <span> (x), close the modal
span1.onclick = function() {
  modal.style.display = "none";
}

span2.onclick = function() {
  modal.style.display = "none";
}

span3.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Moves from the first modal to the second
let modal2 = function(){
  // Set the current modal to display none
  modal.style.display = "none";

  // Get the new modal
  modal = document.getElementById("modal2");
  // set to display block
  modal.style.display = "block";
}

// Moves from the first modal to the second
let modal3 = function(){
  // Set the current modal to display none
  modal.style.display = "none";

  // Get the new modal
  modal = document.getElementById("modal3");
  // set to display block
  modal.style.display = "block";
}

// Closes the modal window
let closeModal = function(){
  modal.style.display = "none";
}

// Opens the modal window
let openModal = function(){
  modal = document.getElementById("modal1");
  modal.style.display="block";
}

// This is the main function being run when the page is loaded
let main = function(){
  var width = (0.95 * window.innerWidth);
  var height = (0.9 * window.innerHeight) - document.querySelector(".smallScreen").offsetHeight - document.querySelector(".bigScreen").offsetHeight - document.querySelector("#algo-choice").offsetHeight - document.querySelector("#run").offsetHeight;

  numRows = Math.floor(height/20);
  numCols = Math.floor(width/20);

  // Creates the table depending on the width of the screen
  createTable();

  // Opens the modal window
  modal.style.display = "block";

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
