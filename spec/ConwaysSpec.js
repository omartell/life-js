describe("Conway's game of life", function() {
  var _ = undefined;

  it("Given an empty seed, then there's no next generation", function(){
    var seed = [
      [_,_,_,_],
      [_,_,_,_],
      [_,_,_,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var empty = [
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

  it("A cell with no neighbors dies on the next generation", function(){
    var seed = [
      [_,_,_,_],
      [_,_,_,_],
      [_,1,_,_],
      [_,_,_,_],
      [_,_,_,_]
    ];

    var empty = [
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

  it("A cell with two or three neighbors lives onto the next generation", function(){
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

  it("A cell with more than three neighbors dies on the next generation", function(){
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

  it("A dead cell with three neighbors lives on the next generation", function(){
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

  it("Simulates real life, generations evolve from previous generations", function(){
    var seed = [
      [_,1,_,_,_,_,_,_],
      [_,1,_,_,_,_,1,_],
      [_,1,1,_,_,_,1,_],
      [_,1,_,_,_,1,1,_],
      [_,_,_,_,_,_,_,_]
    ];

    var generation2 = [
      [_,_,_,_,_,_,_,_],
      [1,1,_,_,_,_,_,_],
      [1,1,1,_,_,_,1,1],
      [_,1,1,_,_,1,1,_],
      [_,_,_,_,_,_,_,_]
    ];

    var generation3 = [
      [_,_,_,_,_,_,_,_],
      [1,_,1,_,_,_,_,_],
      [_,_,_,_,_,1,1,1],
      [1,_,1,_,_,1,1,1],
      [_,_,_,_,_,_,_,_]
    ];

    var generation4 = [
      [_,_,_,_,_,_,_,_],
      [_,_,_,_,_,_,1,_],
      [_,_,_,_,_,1,_,1],
      [_,_,_,_,_,1,_,1],
      [_,_,_,_,_,_,1,_]
    ];

    var generation5 = [
      [_,_,_,_,_,_,_,_],
      [_,_,_,_,_,_,1,_],
      [_,_,_,_,_,1,_,1],
      [_,_,_,_,_,1,_,1],
      [_,_,_,_,_,_,1,_]
    ];

    var life = new Life(seed);
    life.nextGeneration();
    life.nextGeneration();
    life.nextGeneration();
    life.nextGeneration();
    life.nextGeneration();

    expect(life.generationAsGrid()).toEqual(generation5);
  });

  it("Is possible to travel in time and see a future generation", function(){
    var seed = [
      [_,1,_,_,_,_,_,_],
      [_,1,_,_,_,_,1,_],
      [_,1,1,_,_,_,1,_],
      [_,1,_,_,_,1,1,_],
      [_,_,_,_,_,_,_,_]
    ];

    var generation5 = [
      [_,_,_,_,_,_,_,_],
      [_,_,_,_,_,_,1,_],
      [_,_,_,_,_,1,_,1],
      [_,_,_,_,_,1,_,1],
      [_,_,_,_,_,_,1,_]
    ];

    var life = new Life(seed);
    life.advanceGenerations(5);

    expect(life.generationAsGrid()).toEqual(generation5);
  });

  it("Is possible to define a period of time between generations", function(){
    var seed = [
      [_,1,_,_,_,_,_,_],
      [_,1,_,_,_,_,1,_],
      [_,1,1,_,_,_,1,_],
      [_,1,_,_,_,1,1,_],
      [_,_,_,_,_,_,_,_]
    ];

    var generationX = [
      [_,_,_,_,_,_,_,_],
      [_,_,_,_,_,_,1,_],
      [_,_,_,_,_,1,_,1],
      [_,_,_,_,_,1,_,1],
      [_,_,_,_,_,_,1,_]
    ];

    var life = new Life(seed);
    var timeBetweenGenerations = 1 * 1000;
    life.start(timeBetweenGenerations);
    waits(2*1000);
    runs(function(){
      life.stop();
      expect(life.generationAsGrid()).toEqual(generationX);
    });
  });
});