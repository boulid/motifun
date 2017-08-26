/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

TrelloPowerUp.initialize({
	/*'show-settings': function(t, options){
		//return t.popup({
		  //title: 'Settings',
		  //url: 'settings.html',
		  //height: 300
		//});
		return t.get('member', 'private', 'authToken')
	    .then(function(authToken) {
			if (authToken != ''){
				return t.popup({
					title: 'Unauthorize Account',
					url: './unauth.html',
					height: 140,
				  });
			}
		});	
	},*/
	
	'board-buttons': function (t, options) {
		return [
			{
			  icon: './img/if_trophy_1054950.png',
			  text: 'MotiFun',
			  callback: function(t) {
				  return t.popup({
					  title: "MotiFun",
					  url: 'panel.html',
					  height: 300,
					  });
			  }
			},
			{
			  icon: './img/if_info_370079.png',
			  text: 'Get started with MotiFun',
			  callback: function(t) {
				  return t.modal({
					  // the url to load for the iframe
					  url: './tuto.html',
					  // optional color for header chrome
					  accentColor: '#ff5050',
					  // initial height for iframe
					  height: 550, // not used if fullscreen is true
					  // whether the modal should stretch to take up the whole screen
					  fullscreen: false,
					  // optional title for header chrome
					  title: 'Get started with MotiFun',
				});
			}
		  }
	  ]
	},	
	
	'card-buttons': function(t, options) {
		return t.get('card', 'shared', 'points')
		.then(function(points) {
			if (points==-1){
				return [];
			}
			else {
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
			}
		});
	},
	
	'card-badges': function(t, options) {
		return t.get('card', 'shared', 'points')
		.then(function(points) {
			if (points==-1){
				return [];
			}
			else {
				return [{
					icon: './img/if_star_1891409.png',
					text: points || '0 points',
					color: points ? null : 'red',
				}];
			}  
		});
	},
	
	'card-detail-badges': function(t, options) {
		return t.get('card', 'shared', 'points')
		.then(function(points) {
			if (points==-1){
				return [];
			}
			else {
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
			}  
		});
	},
	
	'show-authorization': function(t, options){
	  return t.popup({
		title: 'Authorize Account',
		url: './auth.html',
		height: 140,
	  });
	},
	
	'authorization-status': function(t, options){
	  return t.get('member', 'private', 'authToken')
	  .then(function(authToken) {
		  if (authToken==''){
			  authToken=null;
			}
		return { authorized: authToken != null }
	  });
	}
	
});



