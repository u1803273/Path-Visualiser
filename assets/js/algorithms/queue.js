function Queue(){
  this.queue = [];

  this.add = function(element){
    this.queue.push(element);
  }

  this.dequeue = function(){
    var e = this.queue.shift();
    return e;
  }

  this.isEmpty = function(){
    if (this.queue.length==0){
      return true;
    }
    return false;
  }

  this.empty = function(){
    this.queue = [];
  }
}
