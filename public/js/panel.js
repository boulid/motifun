/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

// Elements with IDs are available as properties of `window`.
window.panel.addEventListener('submit', function(event){
  // Stop the browser trying to submit the form itself.
  event.preventDefault();

	t.member('all')
	.then(function (member) {
	 var userId=member.id;
	 var userName = member.fullName;
	 
	// Get the current point in the current card	
	var currentPoints=0;
         if ($("input:checkbox[name=chks]:checked").length ==3 ) {
			 var numCheked='';
			 for(i = 1; i <= $("input:checkbox[name=chks]").length; i++) {
				 if ($('input:checkbox[id=ck_'+i.toString()+']').is(':checked')){
					numCheked+=i.toString()+',';
				 }
			 }
			 
			return t.set('board', 'shared', userId+'_date', GetCurrentDate())
			.then(function(){
				return t.set('board', 'shared', userId+'_items', numCheked.substring(0, numCheked.length-1));	
			})
			.then(function(){
				t.get('board', 'shared', userId+'_items','').then(function(selecteditems){
					t.get('board', 'shared', userId+'_tentations','').then(function(tentations){	

						//return t.boardBar({
						return t.overlay({	
						  //url: './game.html',
						  url: '../exe/index.html',
						  args: {
							_user:userName,
							_tentations: tentations,
							_items: selecteditems
						  },
						  height: 600 // initial height in pixels, can be changed later
						})
						.then(function(){
							 t.closePopup();
							});;
					});
				
				});
				
			});
				
        } else {
			alert("You should select three Items !");
        }
	});
});


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

function UncheckAll(){
	for(i = 1; i <= $("input:checkbox[name=chks]").length; i++) {
		$('input:checkbox[id=ck_'+i.toString()+']').attr('checked', false);
	}
}


t.render(function(){
	t.member('all')
	.then(function (member) {
	 var userId=member.id;
	 
	 return t.get('board', 'shared', userId+'_note')
	.then(function(note){

		//#######################
		//t.set('member', 'shared', 'date', '03/08/2017');
		//#######################
		
		//========================================================================
		return t.get('board', 'shared', userId+'_items','')
		.then(function(selecteditems){
			var Items = selecteditems.split(",");
			var valeur=0;	
			  for(i = 1; i <= $("input:checkbox[name=chks]").length; i++) {
				  if (Items.indexOf(i.toString())!=-1){
					  $('input:checkbox[id=ck_'+i.toString()+']').attr('checked', 'checked');
				  }		  
				  valeur=parseInt($('input:checkbox[id=ck_'+i.toString()+']').val());
				  if (note < valeur){
					  $('input:checkbox[id=ck_'+i.toString()+']').attr('disabled', 'disabled');
					  if ($('input:checkbox[id=ck_'+i.toString()+']').is(':checked')){
						  t.set('board', 'shared', userId+'_items', '');
						  UncheckAll();
					  }
				  }
			  }
		})
		.then(function(){
			t.get('board', 'shared', userId+'_date','//').then(function(date){
				today=GetCurrentDate();
				t.get('board', 'shared', userId+'_tentations',0).then(function(tentations){
				document.getElementById("score").innerHTML='<h4>Your score is '+note+' points. You have '+tentations+' tentations today.</h4>'; 
				if (date!=today){
					t.set('board', 'shared', userId+'_tentations', 9);
				}
				else if (tentations==0){
					$('button:submit[name=save]').attr('disabled', true);
				}
				});
			});
		}); 
	  })
	  /*.then(function(){
		t.sizeTo('#panel').done();
	  })*/
	 
	});
	
});