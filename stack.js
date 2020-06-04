/* A SIMPLE STACK IMPLEMENTATION */

function Stack(){
  this.stack = [];

  this.add = function(element){
    this.stack.unshift(element);
  }

  this.dequeue = function(){
    var e = this.stack.shift();
    return e;
  }

  this.isEmpty = function(){
    if (this.stack.length==0){
      return true;
    }
    return false;
  }

  this.empty = function(){
    this.stack=[];
  }
}
