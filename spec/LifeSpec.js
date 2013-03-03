var Life = (function() {

  function Life(seed) {
    this.cells = seed;
  }

  Life.prototype.nextGeneration = function() {
    
  };

  return Life;

})();

var Cell = (function(){
  function Cell(){
    this.neighbors = [];
  }

  return Cell;
});

describe("Conway's game of life", function() {

  it("Given an empty seed, then there's no next generation", function() {
    var empty = [
      [ , , , ],
      [ , , , ],
      [ , , , ],
      [ , , , ],
      [ , , , ]
    ];

    var life = new Life(empty);
    expect(life.nextGeneration()).toBeEmpty();
  });

  it("A cell with no neighbors dies on the next generation", function() {
    var seed = [
      [ , , , ],
      [ , , , ],
      [ ,1, , ],
      [ , , , ],
      [ , , ,1]
    ];

    var life = new Life(seed);
    expect(life.nextGeneration()).toBeEmpty();
  });

  xit("Given the following seed", function() {
    var seed = [
      [ , ,1, ],
      [ ,1, , ],
      [ ,1, , ],
      [ , , , ],
      [ , , , ]
    ];

    var nextGeneration = [
      [ , , , ],
      [ ,1,1, ],
      [ , , , ],
      [ , , , ],
      [ , , , ]
    ];

    var life = new Life(seed);
    expect(life.nextGeneration()).toEqual(nextGeneration);
  });


  xit("Given the following seed", function() {
    var seed = [
      [ , ,1, ],
      [ ,1, , ],
      [ ,1, , ],
      [ , , , ],
      [ , , , ]
    ];

    var nextGeneration = [
      [ , , , ],
      [ ,1,1, ],
      [ , , , ],
      [ , , , ],
      [ , , , ]
    ];

    var life = new Life(seed);
    expect(life.nextGeneration()).toEqual(nextGeneration);
  });
});