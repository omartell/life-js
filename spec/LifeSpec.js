var CellPosition = (function(){
  function CellPosition(x,y){
    this.x = x;
    this.y = y;
  }
  CellPosition.prototype.toString = function() {
    return this.x.toString() +","+ this.y.toString();
  };
  return CellPosition;
})();

var Life = (function() {
  var ALIVE = 1;

  function Life(seed) {
    this.seed = seed;
    this.livingCells = this.findLivingCells();;
  }

  Life.prototype.findNewCells = function(neighborsPerCell) {
    var newLiving = _.chain(neighborsPerCell)
      .map(function(numberOfNeighbors, cellPositionStr){
        if(numberOfNeighbors === 3){
          return new CellPosition(+cellPositionStr[0], +cellPositionStr[2]);
        }
      }).compact().value();
    return newLiving;
  };

  Life.prototype.findSurvivors = function(neighborsPerCell) {
    return _.chain(this.livingCells).filter(function(cellPosition){
      var neighbors = neighborsPerCell[cellPosition.toString()];
      return  neighbors === 2 || neighbors === 3;
    }).value();
  };

  Life.prototype.findLivingCells = function() {
    var living = [];
    _.each(this.seed, function(row, row_index){
      _.each(row, function(cell, col_index){
        if(cell === ALIVE){
          return living.push(new CellPosition(col_index,row_index));
        }
      });
    });
    return living;
  };

  Life.prototype.nextGeneration = function() {
    var neighborsPerCell = new NeighborFinder().neighborsPerCellPosition(this.livingCells);
    var survivors = this.findSurvivors(neighborsPerCell);
    var allCells = survivors.concat(this.findNewCells(neighborsPerCell));

    this.livingCells = _.uniq(allCells, false, function(c){ return c.toString(); });

    return this.livingCells;
  };

  Life.prototype.generationAsGrid = function(){
    var row_size = this.seed.length;
    var column_size = this.seed[0].length;
    var grid = emptyGrid(row_size, column_size);
    _.each(this.livingCells, function(cellPosition){
      grid[cellPosition.y][cellPosition.x] = ALIVE;
    });
    return grid;
  }

  function emptyGrid(row_size, column_size){
    var grid = new Array(row_size);
    _.times(row_size, function(n){
      grid[n] = new Array(column_size);
    });
    return grid;
  }

  return Life;
})();

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

describe("Life", function() {
  var _ = undefined;
  it("Finds the living cells from the initial seed", function() {
    var seed = [
      [_,_,_,_],
      [_,_,_,_],
      [_,1,_,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var life = new Life(seed);
    expect(life.findLivingCells()).toEqual([{ x: 1, y: 2}]);
  });

  it("Retuns a generation that is unique, cells are not duplicated", function(){
    var seed = [
      [_,_,_,_],
      [_,1,_,_],
      [_,1,1,_],
      [_,1,_,_],
      [_,_,_,_]
    ];

    var life = new Life(seed);
    var nextGeneration = life.nextGeneration()
    var expected = [{ x: 0, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 1 },
    { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 2 } ];

    expect(nextGeneration.length).toEqual(expected.length);
  })
})

describe("Conway's game of life", function() {
  var _ = undefined;
  var empty = [
    [_,_,_,_],
    [_,_,_,_],
    [_,_,_,_],
    [_,_,_,_],
    [_,_,_,_]
  ];

  it("Given an empty seed, then there's no next generation", function() {
    var seed = [
      [_,_,_,_],
      [_,_,_,_],
      [_,_,_,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var life = new Life(seed);
    life.nextGeneration()
    expect(life.generationAsGrid()).toEqual(empty);
  });

  it("A cell with no neighbors dies on the next generation", function() {
    var seed = [
      [_,_,_,_],
      [_,_,_,_],
      [_,1,_,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var life = new Life(seed);
    life.nextGeneration()
    expect(life.generationAsGrid()).toEqual(empty);
  });

  it("A cell with two or three neighbors lives onto the next generation", function() {
    var seed = [
      [_,1,_,_],
      [_,1,_,_],
      [_,1,_,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var nextGeneration = [
      [_,_,_,_],
      [1,1,1,_],
      [_,_,_,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var life = new Life(seed);
    life.nextGeneration()
    expect(life.generationAsGrid()).toEqual(nextGeneration);
  });

  it("A cell with more than three neighbors dies on the next generation", function() {
    var seed = [
      [_,1,_,_],
      [_,1,_,_],
      [1,1,1,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var nextGeneration = [
      [_,_,_,_],
      [_,_,_,_],
      [1,1,1,_],
      [_,1,_,_],
      [_,_,_,_]
    ];

    var life = new Life(seed);
    life.nextGeneration()
    expect(life.generationAsGrid()).toEqual(nextGeneration);
  });

  it("A dead cell with three neighbors lives on the next generation", function() {
    var seed = [
      [_,_,_,_],
      [_,_,1,_],
      [_,1,1,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var nextGeneration = [
      [_,_,_,_],
      [_,1,1,_],
      [_,1,1,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var life = new Life(seed);
    life.nextGeneration()
    expect(life.generationAsGrid()).toEqual(nextGeneration);
  });
});