var NeighborFinder = (function(){
  function NeighborFinder(){

  }

  NeighborFinder.prototype.neighborsFor = function(cellPosition){
    return _.map(findPositions(cellPosition), function(p){ return p; });
  }

  NeighborFinder.prototype.neighborsPerCellPosition = function(cellsPositions){
    var neighborsByPosition =  _.chain(cellsPositions)
      .map(function(cellPosition){
        return this.neighborsFor(cellPosition);
      }, this).flatten()
      .countBy(function(cellPosition){
        return cellPosition.toString();
      }).value();

    return neighborsByPosition;
  }

  function findPositions(cellPosition){
    function resolvePosition(fn){
      return fn(cellPosition);
    };

    return _.map([
        function(p){ return minusX(minusY(p)); },
        minusY,
        function(p){ return plusX(minusY(p)); },
        minusX,
        plusX,
        function(p){ return minusX(plusY(p)); },
        plusY,
        function(p){ return plusX(plusY(p)); }
      ],
      resolvePosition);
  }

  function plusX(p){
    return  new CellPosition(p.x + 1, p.y);
  }

  function minusX(p){
    return  new CellPosition(p.x - 1, p.y);
  }

  function minusY(p){
    return  new CellPosition(p.x, p.y - 1);
  }

  function plusY(p){
    return  new CellPosition(p.x, p.y + 1);
  }

  return NeighborFinder;
})();