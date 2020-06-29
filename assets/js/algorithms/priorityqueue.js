/* SIMPLE IMPLEMENTATION OF A PRIORITY QUEUE */

function PriorityQueue(){
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
          if(cell.distance<this.queue[i].distance && found==false && added==false){
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
        console.log("x: "+this.queue[i].x+" y: "+this.queue[i].y+" cost: "+this.queue[i].distance);
      }
    }
}
