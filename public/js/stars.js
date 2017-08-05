/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

// Elements with IDs are available as properties of `window`.
window.estimate.addEventListener('submit', function(event){
  // Stop the browser trying to submit the form itself.
  event.preventDefault();

	 //get Ids of members in this card
	 t.card('members')
    .then(function (card) {
		// list of members
		var array = card.members;
		var memberId=0;
			for(i = 0; i < array.length; i++) {
				memberId=array[i].id;
				// Get old points in the current card
				//var oldpoints=0;
				return t.get('card', 'shared', 'points', 0)
				.then(function (oldpoints) {
					// Get the current points in the current card	
					var currentPoints=0;
					 if ($("#estimate :radio:checked").length == 0) {
						currentPoints=-1;
					} else {
						currentPoints=parseInt($('input:radio[name=stars]:checked').val());
					}
					currentPoints=currentPoints+1;
					
					//update the number of points in the card
					return t.set('card', 'shared', 'points', currentPoints)
					.then(function(){
						// get the current note of the user 
						t.get('board', 'shared', memberId+'_note', 0)
						.then(function (note) {
						if (note==0){
							return t.set('board', 'shared', memberId+'_note', currentPoints)
							.then(function(){
								//closing the popup  
								t.closePopup();
							});
						}
						else{
							var res2=note-oldpoints+currentPoints;
							return t.set('board', 'shared', memberId+'_note', res2)
							.then(function(){
							 t.closePopup();
							});
						}

						});
					});
				});
			}//end for
			t.closePopup();
    });  
});


t.render(function(){
   // get points in the current card	
  return t.get('card', 'shared', 'points')
  .then(function(points){
	  var p=points-1;
	$("input[name=stars][value=" + p + "]").attr('checked', 'checked');
  })
  .then(function(){
    t.sizeTo('#estimate').done();
  })
  .then(function(){
	 return t.card('members')
    .then(function (card) {
		var array = card.members;
		if(typeof array != "undefined" && array != null && array.length > 0){
		}
		else{
			document.getElementById("title").innerHTML='<font color="red"> You must add at least one member !</font>'
			$('fieldset[name=fieldo]').attr('disabled', true);
			$('button:submit[name=save]').attr('disabled', true);
		}
    });  
  })
});