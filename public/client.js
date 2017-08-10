/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

TrelloPowerUp.initialize({
	'show-settings': function(t, options){
		return t.popup({
		  title: 'Settings',
		  url: 'settings.html',
		  height: 300 // we can always resize later
		});
	},
	
	'board-buttons': function (t, options) {
		return [{
		  icon: './img/if_star_1891409.png',
		  text: 'MotiFun',
		  callback: function(t) {
			  return t.popup({
				  title: "MotiFun",
				  url: 'panel.html',
				  height: 300,
				  });
		  }
		},
		];
	},
	
	'card-buttons': function(t, options) {
		return [{
			icon: './img/if_star_1891409.png',
			text: 'Evaluate',
			callback: function(t) {
				return t.popup({
					title: "Evaluation",
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
	
	'card-detail-badges': function(t, options) {
		return t.get('card', 'shared', 'points')
		.then(function(points) {
			var out='';
			for(i=1;i<=points;i++) out+='★'; 
			return [{
				title: 'Evaluation',
				icon: './img/if_star_1891409.png',
				text: out || '0 points',
				color: points ? null : 'red',
				callback: function(t) {
					return t.popup({
						title: "Evaluation",
						url: 'stars.html',
						});
				}
			}];  
		});
	},
	
});



