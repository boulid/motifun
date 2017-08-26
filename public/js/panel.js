
var t = TrelloPowerUp.iframe();


//###################### Authroze the user
function onAuthorizeSuccessful() {
    var token = Trello.token();
    return t.set('member', 'private', 'authToken', token)
	.then(function() {
		return t.closePopup();
	});
}

function onFailedAuthorization() {
	return t.set('member', 'private', 'authToken', '')
	.then(function() {
		return t.closePopup();
	});
}

function AuthenticateTrello() {	
     Trello.authorize({
            name: "MotiFun",
            type: "popup",
			persist:false,
            interactive: true,
            expiration: "never",
            success: function () { onAuthorizeSuccessful(); },
            error: function () { onFailedAuthorization(); },
            scope: { write: true, read: true },
	});
 }

//######################################



function GetCurrentDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd<10){
		dd='0'+dd;
	} 
	if(mm<10){
		mm='0'+mm;
	} 
	var today = dd+'/'+mm+'/'+yyyy;
	return today;
}

/*var GetCurrentDate = function () {
        // i supose that node.intent name is unique.
        return new Promise(function (resolve, reject){
			$.ajax({
				url: 'https://trellofun.herokuapp.com/date',
				type: 'GET',
				success: function (data) {
				resolve(data.date);
				}
			});
		});
}*/



function colorprizes(){
	if ($("input:checkbox[name=chks]:checked").length == 3) {
		return t.get('board', 'shared')
		.then(function(sharedvariable){
			var list = Object.keys(sharedvariable);
			var compteur='';
			var lbl_note='';
			var dict={};
			var j='';
			
			for (i=0;i<list.length;i++){
				if (list[i].indexOf('prizeitem_') !== -1){
					compteur= list[i].split("_");
					j=compteur[1];
					
					var element = document.getElementById("lbl_"+j.toString());
					element.style.color = "black";
					element.style.fontWeight ="normal";
					
					if ($('input:checkbox[id=ck_' + j.toString() + ']').is(':checked')) {
						content = sharedvariable[list[i]];
						lbl_note = content.split("_");
						dict[j.toString()] = lbl_note[1];				
					}
				}
			}
			
			var result = Object.keys(dict).sort(function(a, b) {
			  return dict[b] - dict[a];
			});
			
			//Gold
			var element = document.getElementById("lbl_"+result[0]);
			element.style.fontWeight ="bold";
			element.style.color = "#C98910";
			//Silver
			var element = document.getElementById("lbl_"+result[1]);
			element.style.fontWeight ="bold";
			element.style.color = "#A8A8A8";
			//Bronz
			var element = document.getElementById("lbl_"+result[2]);
			element.style.fontWeight ="bold";
			element.style.color = "#965A38";

		});
	}
}

function checkfunction(checkboxElem) {
		if ($("input:checkbox[name=chks]:checked").length > 3) {
			checkboxElem.checked=false;
	        //alert("You should select three Items !");
	    }
	    else {
			colorprizes();
		}
}


// Elements with IDs are available as properties of `window`.
window.panel.addEventListener('submit', function (event) {
	
    // Stop the browser trying to submit the form itself.
    event.preventDefault();

    t.member('all')
	.then(function (member) {
		// get the current user Id and Full Name
	    var userId = member.id;
	    var userName = member.fullName;

		// Test if the number of selected prize equal 3
	    if ($("input:checkbox[name=chks]:checked").length == 3) {
	        var numCheked = '';
        	// get shared datas
			return t.get('board', 'shared')
				.then(function(sharedvariable){
					var list = Object.keys(sharedvariable);
					// loop over prize items
					var compteur=''
					for (i=0;i<list.length;i++){
						if (list[i].indexOf('prizeitem_') !== -1){
							compteur= list[i].split("_");
							if ($('input:checkbox[id=ck_' + compteur[1].toString() + ']').is(':checked')) {
								numCheked += compteur[1].toString() + ',';
							}
						}
					}
				// Set the current date
				var today=GetCurrentDate();
				//var today=GetCurrentDate().then(function(thedate){return thedate});
				return t.set('board', 'shared', userId + '_date', today)
				.then(function () {
					// set the current selection
					return t.set('board', 'shared', userId + '_items', numCheked.substring(0, numCheked.length - 1))
					.then(function () {
						// get the current selection
						t.get('board', 'shared', userId + '_items', '')
						.then(function (selecteditems) {
							// get the number of attemps
							t.get('board', 'shared', userId + '_tentations', 0)
							.then(function (tentations) {
								var tt=parseInt(tentations);
								if (tt>0){
									tt=tt-1;
									t.set('board', 'shared', userId+'_tentations', tt);
								}
									return t.overlay({
										url: '../exe/webplayer/SlotMachine.html',
										args: {
											_userid:userId,
											_user:userName,
											_tentations: tentations,
											_items: selecteditems
											},
											height: 600 
									})
									.then(function(){
										t.closePopup();
									});
							});
						});
					});
				});
			});
	    } else {
	        //alert("You should select three Items !");
	    }
	});
});



function UncheckAll(){
	return t.get('board', 'shared')
	.then(function(sharedvariable){
		var list = Object.keys(sharedvariable);
		var i='';
		for (j=0;j<list.length;j++){
			if (list[j].indexOf('prizeitem_') !== -1){
				compteur= list[j].split("_");
				i=compteur[1];
				$('input:checkbox[id=ck_'+i.toString()+']').attr('checked', false);
		  }
	  }		
	});
}

function addCheckBoxes(compteur,note, label){
	var container = document.getElementById("checkboxes");
	container.innerHTML+='<label class="control control--checkbox" id="lbl_'+compteur+'" >'+label+' = '+note+'<input type="checkbox" id="ck_'+compteur+'" name="chks" value="'+note+'" onchange="checkfunction(this)" /><div class="control__indicator"> </div></label>';
}




t.render(function(){
	return t.get('member', 'private', 'authToken', '')
	.then(function(authToken){
		if (authToken != ''){
			t.member('all')
			.then(function (member) {
				// get Id of the Logged User
				 var userId=member.id;
				 
				 // Get all plugged data
				return t.getAll()
				.then(function (data) {
					// get shared data in the board
					if (typeof data.board === "undefined"){
						document.getElementById("score").innerHTML='<h4>There is no Prizes for now ! </h4>';
						//$('button:submit[name=save]').attr('disabled', true);
						var f = document.getElementById('save');
						f.parentNode.removeChild(f);
						var f2 = document.getElementById('colors');
						f2.parentNode.removeChild(f2);
					}
					else {
						var res=data.board.shared;
						// get all open cards
						return t.cards('all')
						.then(function (cards) {
							var score=0;
							// Loop over cards
							for (j=0;j<cards.length;j++){
								var card =cards[Object.keys(cards)[j]];
								// Id of the current card
								var cardId = card.id;
								// Loop over members of the current card
								for (i=0;i<card.members.length;i++){
									// If the current member exist in the current card
									if (userId==card.members[i].id){
										// add the point in the card in its score
										if (typeof res['card_'+cardId]=== "undefined"){
											// card not assessed yet !
										}
										else{
											score+=res['card_'+cardId];
											
										}
									}
								}
								
							}
							
							//************************ construct checkboxes
							var container = document.getElementById("checkboxes");
							container.innerHTML="";
							// get shared datas
							return t.get('board', 'shared')
								.then(function(sharedvariable){
									var list = Object.keys(sharedvariable);
									// loop over prize items
									var content='';
									var compteur='';
									for (i=0;i<list.length;i++){
										if (list[i].indexOf('prizeitem_') !== -1){
											content = sharedvariable[list[i]];
											lbl_note = content.split("_");
											compteur= list[i].split("_");
											addCheckBoxes(compteur[1],lbl_note[1],lbl_note[0]);
										}
									}
								// get the selected items of the current user
								return t.get('board', 'shared', userId+'_items','')
								.then(function(selecteditems){
									var Items = selecteditems.split(",");
									var valeur=0;
									  // check the checkboxes that the user has selected 
									  var i='';
										for (j=0;j<list.length;j++){
											if (list[j].indexOf('prizeitem_') !== -1){
												compteur= list[j].split("_");
												i=compteur[1];
											  if (Items.indexOf(i.toString())!=-1){
												  $('input:checkbox[id=ck_'+i.toString()+']').attr('checked', 'checked');
											  }		  

											  valeur=parseInt($('input:checkbox[id=ck_'+i.toString()+']').val());
											  // Make disable the checkboxes having heighr points 
											  if (score < valeur || isNaN(score)) {
												  $('input:checkbox[id=ck_'+i.toString()+']').attr('disabled', 'disabled');
												  // if some previously checked points become heighr than the user's score
												  // UncheckAll checkboxs
												  if ($('input:checkbox[id=ck_'+i.toString()+']').is(':checked')){
													  t.set('board', 'shared', userId+'_items', ''); // set !
													  UncheckAll();
												  }
											  }
											  
										  }
									  }
								})
								.then(function(){
									// get the last date the user played
									t.get('board', 'shared', userId+'_date','//')
									.then(function(date){
										var today=GetCurrentDate();
										//var today=GetCurrentDate().then(function(thedate){return thedate});
										t.get('board', 'shared', userId+'_tentations',0)
										.then(function(tentations){
											if (isNaN(score) || score==0){
												document.getElementById("score").innerHTML='<h4>You should earn more points in order to play the game.</h4>';
												var f = document.getElementById('save');
												f.parentNode.removeChild(f);
												var f2 = document.getElementById('colors');
												f2.parentNode.removeChild(f2);										
											}
											else{
												document.getElementById("score").innerHTML='<b>Your score is '+score+' points. You got '+tentations+' round today.</b> <i>Please choose three Prizes an click on Start the game !</i></br></br>';
											}
											
											var container = document.getElementById("checkboxes");
											if (container.innerHTML==''){
												document.getElementById("score").innerHTML='There is no prizes yet !';	
											}
											// If new day, set the number of attemps to 2
											if (date!=today){
												t.set('board', 'shared', userId+'_tentations', 2);
											}
											// If the user consume the number of attemps, disable the play button
											else if (tentations==0){
												//$('button:submit[name=save]').attr('disabled', true);
												var f = document.getElementById('save');
												f.parentNode.removeChild(f);
												var f2 = document.getElementById('colors');
												f2.parentNode.removeChild(f2);
											}
										});
									});
								})
							})
							.then(function() {
								 colorprizes();
								//return t.sizeTo('#panel');
							});
						});
					}
				});
			});
		}
		else{
			//document.getElementById("score").innerHTML='<h4><font color="red"> We need you to authorize first. Go to Motifun settings !</font></h4>';
			document.getElementById('score').innerHTML = '<p><h4>We need you to authorize first !.</h4></p> <center><button id="authorize" type="button" class="mod-primary" onclick=" AuthenticateTrello()">Authorize</button></center>'			

			var f = document.getElementById('save');
			f.parentNode.removeChild(f);
			var f2 = document.getElementById('colors');
			f2.parentNode.removeChild(f2);
		}
	});	
});	 



