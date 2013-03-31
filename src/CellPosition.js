var CellPosition = (function(){
  function CellPosition(x,y){
    this.x = x;
    this.y = y;
  }
  CellPosition.prototype.toString = function(){
    return this.x.toString() +","+ this.y.toString();
  };
  return CellPosition;
})();