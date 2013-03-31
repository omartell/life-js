var Life = (function(){
  var ALIVE = 1;

  function Life(seed) {
    this.seed = seed;
    this.livingCells = this.findLivingCells();;
  }

  Life.prototype.start = function(timeBetweenGenerations){
    var self = this;
    var scheduleNextRun = function(){
      var action = function(){
        self.nextGeneration();
        scheduleNextRun();
      };
      this.nextRun = setTimeout(action, timeBetweenGenerations);
    }
    this.nextGeneration();
    scheduleNextRun();
  };

  Life.prototype.stop = function(){
    clearTimeout(this.nextRun);
  };

  Life.prototype.advanceGenerations = function(numberOfGenerations){
    _.times(numberOfGenerations, this.nextGeneration, this);
    return this.livingCells;
  };

  Life.prototype.nextGeneration = function(){
    var neighborsPerCell = new NeighborFinder().neighborsPerCellPosition(this.livingCells);
    var survivors = this.findSurvivors(neighborsPerCell);
    var allCells = survivors.concat(this.findNewCells(neighborsPerCell));

    this.livingCells = _.uniq(allCells, false, function(c){ return c.toString(); });

    return this.livingCells;
  };

  Life.prototype.findNewCells = function(neighborsPerCell){
    var newLiving = _.chain(neighborsPerCell)
      .map(function(numberOfNeighbors, cellPositionStr){
        if(numberOfNeighbors === 3){
          return new CellPosition(+cellPositionStr[0], +cellPositionStr[2]);
        }
      }).compact().value();
    return newLiving;
  };

  Life.prototype.findSurvivors = function(neighborsPerCell){
    return _.chain(this.livingCells).filter(function(cellPosition){
      var neighbors = neighborsPerCell[cellPosition.toString()];
      return  neighbors === 2 || neighbors === 3;
    }).value();
  };

  Life.prototype.findLivingCells = function(){
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

  Life.prototype.generationAsGrid = function(){
    var row_size = this.seed.length;
    var column_size = this.seed[0].length;
    var grid = emptyGrid(row_size, column_size);
    _.each(this.livingCells, function(cellPosition){
      grid[cellPosition.y][cellPosition.x] = ALIVE;
    });
    return grid;
  };

  function emptyGrid(row_size, column_size){
    var grid = new Array(row_size);
    _.times(row_size, function(n){
      grid[n] = new Array(column_size);
    });
    return grid;
  }

  return Life;
})();