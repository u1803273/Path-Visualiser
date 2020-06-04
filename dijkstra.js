/* A SIMPLE IMPLEMENTATION OF DIJKSTRA'S ALGORITHM */

var queue;
var finished = false;
var found = false;

let dijkstra = function(){
  queue = new PriorityQueue();
  finished = false;
  found = false;
  queue.add(grid[startX][startY]);

  // Reinitialise every nodes distance to positive infinity
  for(let i=0;i<numRows;i++){
    for(let j=0;j<numCols;j++){
      grid[i][j].distance=Number.POSITIVE_INFINITY;
    }
  }

  // Set the start nodes distance to 0
  grid[startX][startY].distance=0;
  dj();
}

// Runs the body of the Dijkstra's algorithm
let dj = function(){
  if(queue.isEmpty()){
    finished = true;
  }else{

    var element = queue.extractMin();
    if(element.x==endX && element.y==endY){
      finished=true;
      found = true;
      queue.empty();
    }else{
      grid[element.x][element.y].visited=true;
      var cost = element.distance;
      var x = element.x;
      var y = element.y;

      var id = generateId(element.x,element.y);
      document.getElementById(id).style.cssText = "background-color:#16A085";

      // Recalculate every adjacent distance and update if necessary

      // Left
      if(y-1>=0 && grid[x][y-1].visited == false && grid[x][y-1].filled == false){
        // Shorter distance via this new path
        if(cost+grid[x][y-1].cost < grid[x][y-1].distance){
          // Update new lesser cost
          grid[x][y-1].distance = cost+grid[x][y-1].cost;
          // Update the priority queue
          queue.add(grid[x][y-1]);
          // Set it to light blue as its now on the frontier
          id = generateId(x,y-1);
          document.getElementById(id).style.cssText="background-color:#A9DFBF;";

          // Set the parents
          grid[x][y-1].parentX=x;
          grid[x][y-1].parentY=y;
        }
      }

      // Up
      if(x-1>=0 && grid[x-1][y].visited == false && grid[x-1][y].filled == false){
        // Shorter distance via this new path
        if(cost+grid[x-1][y].cost < grid[x-1][y].distance){
          // Update new lesser cost
          grid[x-1][y].distance = cost+grid[x-1][y].cost;
          // Update the priority queue
          queue.add(grid[x-1][y]);
          id = generateId(x-1,y);
          document.getElementById(id).style.cssText="background-color:#A9DFBF;";
          // Set the parents
          grid[x-1][y].parentX=x;
          grid[x-1][y].parentY=y;
        }
      }

      // Right
      if(y+1<numCols && grid[x][y+1].visited == false &&  grid[x][y+1].filled == false){
        // Shorter distance via this new path
        if(cost+grid[x][y+1].cost < grid[x][y+1].distance){
          // Update new lesser cost
          grid[x][y+1].distance = cost+grid[x][y+1].cost;
          // Update the priority queue
          queue.add(grid[x][y+1]);
          id = generateId(x,y+1);
          document.getElementById(id).style.cssText="background-color:#A9DFBF;";
          // Set the parents
          grid[x][y+1].parentX=x;
          grid[x][y+1].parentY=y;
        }
      }

      // Down
      if(x+1<numRows && grid[x+1][y].visited == false && grid[x+1][y].filled == false){
        // Shorter distance via this new path
        if(cost+grid[x+1][y].cost < grid[x+1][y].distance){
          // Update new lesser cost
          grid[x+1][y].distance = cost+grid[x+1][y].cost;
          // Update the priority queue
          queue.add(grid[x+1][y]);
          id = generateId(x+1,y);
          document.getElementById(id).style.cssText="background-color:#A9DFBF;";
          // Set the parents
          grid[x+1][y].parentX=x;
          grid[x+1][y].parentY=y;
        }
      }


    }

  }


  if (!finished) {
    setTimeout(dj, speed);
  }else{
    if(found){
      // Show the path
      var currentCell = grid[endX][endY];
      while(!(currentCell.x==startX && currentCell.y==startY)){
        // Colour yellow
        document.getElementById(generateId(currentCell.x,currentCell.y)).style.cssText = "background-color:#F7DC6F;";
        currentCell = grid[currentCell.parentX][currentCell.parentY];
      }
      document.getElementById(generateId(currentCell.x,currentCell.y)).style.cssText = "background-color:#F7DC6F;";
    }
    renableButtons();
  }
}
