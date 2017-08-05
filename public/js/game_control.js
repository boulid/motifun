/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();



// Elements with IDs are available as properties of `window`.
window.game.addEventListener('submit', function(event){
  // Stop the browser trying to submit the form itself.
  event.preventDefault();

});




t.render(function(){
	console.log(t.arg('_user'));
	console.log(t.arg('_tentations'));
	console.log(t.arg('_items'));
});