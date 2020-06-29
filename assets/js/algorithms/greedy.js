/* AN IMPLEMENTATION OF A GREEDY BEST FIRST SEARCH */

/* SIMPLE IMPLEMENTATION OF A PRIORITY QUEUE */

// A priority queue ordering nodes by the heuristic value
function GreedyQueue(){
    this.queue = [];

    this.add = function(cell){
      if(this.queue.length==0){
        this.queue.push(cell);
      }else{
        var newQueue = [];
        var i=0;
        var found = false;
        var added = false;
        while(i<this.queue.length){
          // The element is less than the current and we haven't found its previous
          // Therefore, it is either the first element or less than itself
          if(cell.h<this.queue[i].h && found==false && added==false){
            newQueue.push(cell);
            added=true;
            newQueue.push(this.queue[i]);
          }
          else if(cell.x==this.queue[i].x && cell.y==this.queue[i].y){
            // If added previously then need to delete
            if(!added){
              found=true;
              newQueue.push(cell);
            }
          }
          else{
            newQueue.push(this.queue[i]);

          }
          i++
        }

        // Biggest element
        if(!added && !found){
          newQueue.push(cell);
        }

        this.queue = newQueue;

      }
    }

    // Removes and returns the first item if one exists
    this.extractMin = function(){
      if(this.queue.length>0){
        var item=this.queue[0];
        this.queue.shift();
        return item;
      }
    }

    // Clears the queue
    this.clear = function(){
      this.queue=[];
    }

    // Checks whether the queue is empty
    this.isEmpty = function(){
      if(this.queue.length==0){
        return true;
      }else{
        return false;
      }
    }

    this.empty = function(){
      this.queue=[];
    }

    // Prints all elements of the array into the console
    this.print = function(){
      for (let i =0; i<this.queue.length;i++){
        console.log("x: "+this.queue[i].x+" y: "+this.queue[i].y+" heuristic: "+this.queue[i].h);
      }
    }
}

var queue;
var finished = false;
var found = false;

let greedy = function(){
  finished = false;
  found = false;
  queue = new GreedyQueue();

  // Clears all f costs used for the algorithm (in case of any previous algorithms)
  for(let i=0;i<numRows;i++){
    for(let j=0;j<numCols;j++){
      grid[i][j].f=0;
    }
  }

  queue.add(grid[startX][startY]);
  grid[startX][startY].visited = true;
  greedyBody();
}

let greedyBody = function(){
  // Checked all squares
  if(queue.isEmpty()){
    finished = true;
  }
  else{
    var newElement = queue.extractMin();
    var x = newElement.x;
    var y = newElement.y;
    var f = newElement.f;
    console.log(f);
    if(x == endX && y==endY){
      finished = true;
      found=true;
    }else{
      var id = generateId(x,y);
      document.getElementById(id).style.cssText="background-color:#16A085";

      // Check in each of the four directions

      // Left
      if(y-1>=0 && grid[x][y-1].filled==false && grid[x][y-1].visited == false){
        grid[x][y-1].visited=true;
        grid[x][y-1].parentX=x;
        grid[x][y-1].parentY=y;

        grid[x][y-1].h = hValue(x,y-1);
        queue.add(grid[x][y-1]);

        // Set the square to light blue
        var id = generateId(x,y-1);
        document.getElementById(id).style.cssText="background-color:#A9DFBF;";
      }

      // Up
      if(x-1>=0 && grid[x-1][y].filled==false && grid[x-1][y].visited == false){
        grid[x-1][y].visited=true;
        grid[x-1][y].parentX=x;
        grid[x-1][y].parentY=y;

        grid[x-1][y].h = hValue(x-1,y);
        queue.add(grid[x-1][y]);

        var id = generateId(x-1,y);
        document.getElementById(id).style.cssText="background-color:#A9DFBF;";
      }

      // Right
      if(y+1<numCols && grid[x][y+1].filled==false && grid[x][y+1].visited == false){
        grid[x][y+1].visited=true;
        grid[x][y+1].parentX=x;
        grid[x][y+1].parentY=y;

        grid[x][y+1].h = hValue(x,y+1);
        queue.add(grid[x][y+1]);

        var id = generateId(x,y+1);
        document.getElementById(id).style.cssText="background-color:#A9DFBF;";
      }

      // Down
      if(x+1<numRows && grid[x+1][y].filled==false && grid[x+1][y].visited == false){
        grid[x+1][y].visited=true;
        grid[x+1][y].parentX=x;
        grid[x+1][y].parentY=y;

        grid[x+1][y].h = hValue(x+1,y);
        queue.add(grid[x+1][y]);

        var id = generateId(x+1,y);
        document.getElementById(id).style.cssText="background-color:#A9DFBF;";
      }
    }

  }

  if (!finished) {
    setTimeout(greedyBody,speed);
  }else{
    if(found){
      // Display the path
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

// Works out the heuristic value
let hValue = function(x,y){
  return Math.abs(endX - x) + Math.abs(endY - y);
}
