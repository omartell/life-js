describe("Life", function () {
    var _ = undefined;
    it("Finds the living cells from the initial seed", function () {
        var seed = [
            [_, _, _, _],
            [_, _, _, _],
            [_, 1, _, _],
            [_, _, _, _],
            [_, _, _, _]
        ];

        var life = new Life(seed);
        expect(life.findLivingCells()).toEqual([{x: 1, y: 2}]);
    });

    it("Retuns a generation that is unique, cells are not duplicated", function () {
        var seed = [
            [_, _, _, _],
            [_, 1, _, _],
            [_, 1, 1, _],
            [_, 1, _, _],
            [_, _, _, _]
        ];

        var life = new Life(seed);
        var nextGeneration = life.nextGeneration();
        var expected = [{x: 0, y: 2}, {x: 2, y: 3}, {x: 2, y: 1},
            {x: 1, y: 1}, {x: 1, y: 2}, {x: 1, y: 3}, {x: 2, y: 2}];

        expect(nextGeneration.length).toEqual(expected.length);
    })
});