beforeEach(function() {
  this.addMatchers({
    toEqualGeneration:  function(expected){
      var expectedClean = _.chain(expected).compact().filter(function(element){
        return _.chain(element).compact().value().length > 0;
      }).value();

      return _.isEqual(this.actual, expectedClean);
    }
  });
});