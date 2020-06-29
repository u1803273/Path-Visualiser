/* STORES BFS AND DFS SEARCHES */

var queue;
var finished = false;
var found = false;

let bfs = function(){
  queue = new Queue();
  finished = false;
  found = false;
  queue.add(grid[startX][startY]);
  body();
}

let dfs = function(){
  queue = new Stack();
  finished=false;
  found = false;
  queue.add(grid[startX][startY]);
  body();
}


// Runs the body of the BFS search
// Only runs the diagonal directions if the diagonal button is set
function body() {

  if(queue.isEmpty()){
    finished = true;

  }else{
    var newTile = queue.dequeue();
    var x = newTile.x;
    var y = newTile.y;
    //document.getElementById(generateId(x,y)).style.cssText = "background-color:#1455F4;";
    document.getElementById(generateId(x,y)).style.cssText = "background-color:#16A085";


    if(x==endX && y == endY){
      finished = true;
      found = true;
      queue.empty();
    }else{
      // Consider all four adjacent squares, only if they are not the edge of the board or already visited or a wall

      // Up
      if(x-1>=0 && grid[x-1][y].filled==false && grid[x-1][y].visited==false){
        //document.getElementById(generateId(x-1,y)).style.cssText = "background-color:#B3F5F0;";
        document.getElementById(generateId(x-1,y)).style.cssText = "background-color:#A9DFBF;";
        grid[x-1][y].visited=true;
        grid[x-1][y].parentX=x;
        grid[x-1][y].parentY=y;
        queue.add(grid[x-1][y]);
      }

      // Left
      if(y-1>=0 && grid[x][y-1].filled==false && grid[x][y-1].visited==false){
        document.getElementById(generateId(x,y-1)).style.cssText = "background-color:#A9DFBF;";
        grid[x][y-1].visited=true;
        grid[x][y-1].parentX=x;
        grid[x][y-1].parentY=y;
        queue.add(grid[x][y-1]);
      }

      // Down
      if(x+1<numRows && grid[x+1][y].filled==false && grid[x+1][y].visited==false){
        document.getElementById(generateId(x+1,y)).style.cssText = "background-color:#A9DFBF;";
        grid[x+1][y].visited=true;
        grid[x+1][y].parentX=x;
        grid[x+1][y].parentY=y;
        queue.add(grid[x+1][y]);
      }

      // Right
      if(y+1<numCols && grid[x][y+1].filled==false && grid[x][y+1].visited==false){
        document.getElementById(generateId(x,y+1)).style.cssText = "background-color:#A9DFBF;";
        grid[x][y+1].visited=true;
        grid[x][y+1].parentX=x;
        grid[x][y+1].parentY=y;
        queue.add(grid[x][y+1]);
      }

    }
  }


  if (!finished) {
    setTimeout(body, speed);
  }else{
    if(found){
      // Show the path
      var currentCell = grid[endX][endY];
      while(!(currentCell.x==startX && currentCell.y==startY)){
        // Colour yellow
        document.getElementById(generateId(currentCell.x,currentCell.y)).style.cssText = "background-color:#F7DC6F ";
        currentCell = grid[currentCell.parentX][currentCell.parentY];
      }
      document.getElementById(generateId(currentCell.x,currentCell.y)).style.cssText = "background-color:#F7DC6F ";
    }
    renableButtons();
  }
}
