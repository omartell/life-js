var Life = (function() {
  function Life(seed) {
    this.seed = seed;
    this.initializeLivingCells();
  }

  Life.prototype.initializeLivingCells = function() {
    var living = this.findLivingCells();
    var neighborFinder = new NeighborFinder(this.seed);
    this.nextLiving = _.chain(living)
      .map(function(cellPosition){
        var livingNumber = neighborFinder.livingNeighbors(cellPosition).length;
        if(livingNumber === 2 || livingNumber === 3){
          return cellPosition;
        }
      }, this)
      .compact()
      .value();
    // Find the neighbors for those living cells
    // Determine if they are alive or dead 
    // Determine if the cell is alive or dead
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
    _.times(size+1, function(n){
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
    return _.chain(findPositions(cellPosition))
            .map(function(p){
              var row  = this.environment[p.y];
              if(row && row[p.x] == 1){
                return p;
              }
            }, this)
            .value();
  }

  NeighborFinder.prototype.livingNeighbors = function(cellPosition) {
    return _.compact(this.neighbors(cellPosition));
  };

  function findPositions(cellPosition){
    function resolvePosition(fn){
      return fn(cellPosition);
    };

    return _.map([plusX, minusX,  plusY, minusY,
        function(p){ return plusX(minusY(p)); },
        function(p){ return plusX(plusY(p)); },
        function(p){ return plusY(minusX(p)); },
        function(p){ return plusY(plusX(p)); }
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
      [_,1,_,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var neighborFinder = new NeighborFinder(environment);
    expect(neighborFinder.livingNeighbors({x: 1, y: 2})).toEqual([{x: 1,y: 1}]);
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
      [_,1,_,_],
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
      [_,1,1,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var nextGeneration = [
      [_,_,_,_],
      [_,_,_,_],
      [_,1,1,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var life = new Life(seed);
    expect(life.nextGeneration()).toEqual(nextGeneration);
  });


  xit("Given the following seed", function() {
    var seed = [
      [_,_,1,_],
      [_,1,_,_],
      [_,1,_,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var nextGeneration = [
      [_,_,_,_],
      [_,1,1,_],
      [_,_,_,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var life = new Life(seed);
    expect(life.nextGeneration()).toEqual(nextGeneration);
  });
});