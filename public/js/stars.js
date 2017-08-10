/* global TrelloPowerUp */


var t = TrelloPowerUp.iframe();

$('input:radio').on('click', function(event) {
	// Stop the browser trying to submit the form itself.
	//event.preventDefault();

	// Get old points in the current card
	return t.get('card', 'shared', 'points', 0)
	.then(function (oldpoints) {
		// Get the current points in the current card
		var currentPoints=0;
		if ($("#estimate :radio:checked").length == 0) {
			currentPoints=-1;
			} 
		else {
			currentPoints=parseInt($('input:radio[name=stars]:checked').val());
			}
		currentPoints=currentPoints+1;
		//update the number of points in the card
		return t.set('card', 'shared', 'points', currentPoints)
		.then(function(){
			    var context = t.getContext();
				return t.set('board', 'shared', 'card_'+context.card, currentPoints)
				.then(function(){
					t.closePopup();
				});
		});
	});
});





t.render(function(){
	
    return t.board('all')
    // Get the Id of the current Board
    .then(function (board) {		
	  // Get the Id of the current User
      t.member('all')
      .then(function (member) {
		  
		  var IsAdmin=0;
		  // Get the admins of the current Boards	
		  $.ajax({
			  //url: 'https://api.trello.com/1/members/'+member.id,
			  url: 'https://api.trello.com/1/boards/'+board.id+'/members?filter=admins&key=6f19d0fae54524efb044895d9779e3b8&token=a74064972b8f75a40cc659c04a63244ac579ab461091b3bfdfdf3b488b227627',
			  type: 'GET',
			  success: function (data) {
				  for( i=0;i<data.length;i++){
					if (member.id==data[i].id){
						IsAdmin=1;
						break;
					}
				  }
			  }
			})
			// Test if the current user is an admin in this board
			.then(function(){
				if (IsAdmin==0){
					var f = document.getElementById('fieldo');
					f.parentNode.removeChild(f);
					document.getElementById("title").innerHTML='<font color="red"> You must be an Admin to assess cards !</font>';
				}
				else {
					$('fieldset[name=fieldo]').attr('hidden', false);
					document.getElementById("title").innerHTML='Assess this card !';
					
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
									var f = document.getElementById('fieldo');
									f.parentNode.removeChild(f);
									document.getElementById("title").innerHTML='<font color="red"> You must add at least one member !</font>';
									return t.set('card', 'shared', 'points', 0);
								}
							});
						});
				}// end else
			});
		});
    });
});
