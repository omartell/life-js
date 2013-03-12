beforeEach(function() {
  this.addMatchers({
    toBeEmpty:  function(generation){

      return generation === empty;
    }
  });
});