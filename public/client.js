/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

TrelloPowerUp.initialize({
	  'board-buttons': function (t, options) {
		return [{
		  icon: './img/if_star_1891409.png',
		  text: 'Slot Machine',
      callback: function(t) {
        return t.popup({
          title: "Game Board",
          url: 'panel.html',
        });
      }
		}];
	},
	'card-buttons': function(t, options) {
		return [
		{
		icon: './img/if_star_1891409.png',
			text: 'Points',
      callback: function(t) {
        return t.popup({
          title: "Points",
          url: 'stars.html',
        });
      }
		}];
	},
  'card-badges': function(t, options) {
    return t.get('card', 'shared', 'points')
    .then(function(points) {
      return [{
        icon: './img/if_star_1891409.png',
        text: points || '0 points',
        color: points ? null : 'red',
      }];  
    });
  },
});

