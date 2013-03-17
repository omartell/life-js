var Life = (function() {
  function Life(seed) {
    this.seed = seed;
    this.initializeLivingCells();
  }

  Life.prototype.initializeLivingCells = function() {
    var livingCells = this.findLivingCells();
    var neighborFinder = new NeighborFinder(this.seed);
    this.nextLiving = this
      .findSurvivors(livingCells, neighborFinder)
      .concat(this.findNewCells(livingCells, neighborFinder));
  };

  Life.prototype.findNewCells = function(living, neighborFinder) {
    var newLiving = _.chain(living)
      .map(function(cellPosition){
        return neighborFinder.neighbors(cellPosition);
      })
      .flatten()
      .countBy(function(cellPosition){
        return [cellPosition.x, cellPosition.y];
      })
      .map(function(value, key, list){
        if(value === 3){
          return { x: +key[0], y: +key[2]}; 
        }
      }).compact().value();
    return newLiving;
  };

  Life.prototype.findSurvivors = function(living, neighborFinder) {
    var survivors = _.chain(living)
      .map(function(cellPosition){
        var livingNumber = neighborFinder.livingNeighbors(cellPosition).length;
        if(livingNumber === 2 || livingNumber === 3){
          return cellPosition;
        }
      }, this).compact().value();

    return survivors;
  };

  Life.prototype.findLivingCells = function() {
    var living = [];
    _.each(this.seed, function(row, row_index){
      _.each(row, function(cell, col_index){
        if(cell === 1){
          return living.push({ y: row_index, x: col_index});
        }
      });
    });
    return living;
  };

  Life.prototype.nextGeneration = function() {
    var grid = emptyGrid(this.seed.length - 1);
    _.each(this.nextLiving, function(cellPosition){
      grid[cellPosition.y][cellPosition.x] = 1;
    });
    return grid;
  };

  function emptyGrid(size){
    var grid = new Array(size);
    _.times(size + 1, function(n){
      grid[n] = new Array(size); 
    });
    return grid;
  }

  return Life;
})();

var NeighborFinder = (function(){
  function NeighborFinder(environment){
    this.environment = environment;
  }

  NeighborFinder.prototype.neighbors = function(cellPosition){
    return _.map(findPositions(cellPosition), function(p){ 
              return p; 
            });
  }

  NeighborFinder.prototype.livingNeighbors = function(cellPosition) {
    return _.chain(findPositions(cellPosition))
      .map(function(p){
        var row  = this.environment[p.y];
        if(row && row[p.x] == 1){
          return p;
        }
      }, this)
      .compact()
      .value();
  };

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
  };

  function plusX(p){
    return { x: p.x + 1, y: p.y };
  }

  function minusX(p){
    return { x: p.x - 1, y: p.y };
  }

  function minusY(p){
    return { x: p.x, y: p.y - 1 };
  }

  function plusY(p){
    return { x: p.x, y: p.y + 1 };
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
})

describe("NeighborFinder", function() {
  var _ = undefined;
  it("Finds the living neighbors of a cell", function() {
    var environment = [
      [_,_,_,_],
      [_,1,_,_],
      [_,1,1,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var neighborFinder = new NeighborFinder(environment);
    expect(neighborFinder.livingNeighbors({x: 2, y: 2})).toEqual([{x: 1,y: 1}, {x: 1,y: 2}]);
  });
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
    expect(life.nextGeneration()).toEqual(empty);
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
    expect(life.nextGeneration()).toEqual(empty);
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
    expect(life.nextGeneration()).toEqual(nextGeneration);
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
    expect(life.nextGeneration()).toEqual(nextGeneration);
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
    expect(life.nextGeneration()).toEqual(nextGeneration);
  });
});