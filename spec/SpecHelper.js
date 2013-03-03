beforeEach(function() {
  this.addMatchers({
    toBePlaying: function(expectedSong) {
      var player = this.actual;
      return player.currentlyPlayingSong === expectedSong && 
             player.isPlaying;
    },
    toBeEmpty:  function(generation){
      var empty = [
        [ , , , ],
        [ , , , ],
        [ , , , ],
        [ , , , ],
        [ , , , ]
      ];
      return generation === empty;
    }
  });
});