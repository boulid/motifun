/* global TrelloPowerUp */

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


function showprizes(){
	document.getElementById("tlabel").value='';
	document.getElementById("tnote").value='';
	
	//get shared datas
	return t.get('board', 'shared')
		.then(function(sharedvariable){
			var table=document.getElementById("data_table");
			var table_len=(table.rows.length);
			// Remove all rows
			while (table_len>2){
				table.deleteRow(1);
				table_len=(table.rows.length);
			}
			var list = Object.keys(sharedvariable);
			var content='';
			var lbl_note='';
			// loop over prize items
			for (i=0;i<list.length;i++){
				if (list[i].indexOf('prizeitem_') !== -1){
					content = sharedvariable[list[i]];
					lbl_note = content.split("_");
					table_len=(table.rows.length)-1;
					// add row
					var row = table.insertRow(table_len).outerHTML=
					"<tr id='row"+table_len+"' ><td>"+lbl_note[0]+"</td><td>"+lbl_note[1]+"</td><td><input class='mod-danger' type='button' value='Delete' style='padding: .1em 0.4em; background: -webkit-linear-gradient(top,#CF513D 0,#B04632 100%);background: linear-gradient(to bottom,#CF513D 0,#B04632 100%);box-shadow: 0 1px 0 #4d4d4d;color: #fff;' onclick='deleterow("+table_len+")'></td></tr>";
					var element = document.getElementById("row"+table_len);
					element.setAttribute("name", ""+list[i]);
				}
			}
		});
}

function deleterow(no)
{
	//var result = confirm("Do you want to delete this record ? \n All member's prize choices will be lost !");
	var result = confirm("Do you want to delete this prize ?");
	if (result) {
		var prizeitem=document.getElementById("row"+no+"").attributes["name"].value;
	
		//delete shared data
		return t.remove('board', 'shared', prizeitem)
		.then(function(){
			//delete current row
			document.getElementById("row"+no+"").outerHTML="";
			
			//delete all member choices
			//get shared datas
			/*return t.get('board', 'shared')
			.then(function(sharedvariable){
				var list = Object.keys(sharedvariable);
				for (i=0;i<list.length;i++){
					if (list[i].indexOf('_items') !== -1){
						removechoices(list[i]);
					}
				}
			});*/
		});
	}
}


function addrow(){
	var label = document.getElementById("tlabel").value;
	var note = document.getElementById("tnote").value;
	if (label==null || label=="",note==null || note=="")
      {
      //alert("Please fill the two fields");     
      return false;
      }
      
	//get contour
	return t.get('board', 'shared', 'compteur', 0)
	.then(function (compteur) {
		//increment contour
		var c = parseInt(compteur)+1;
		return t.set('board', 'shared', 'compteur',c )
			.then(function(){
				//add new prize
				return t.set('board', 'shared', 'prizeitem_'+c, label+'_'+note);
			});
	});	
}


t.render(function(){
	// Get the Id of the current User
	return t.board('all')
		// Get the Id of the current Board
		.then(function (board) {
		  t.member('all')
		  .then(function (member) {
			  return t.get('member', 'private', 'authToken', '')
			  .then(function(authToken){
				  if (authToken != ''){
					  //***********
					  var IsAdmin=0;
					  // Get the admins of the current Boards	
					  $.ajax({
						  url: 'https://api.trello.com/1/boards/'+board.id+'/members?filter=admins&key=6f19d0fae54524efb044895d9779e3b8&token='+authToken,
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
								document.getElementById("title").innerHTML='<font color="red"><h4> You must be an Admin to configure MotiFun !</h4></font>';
								var table=document.getElementById("data_table");
								var table_len=(table.rows.length);
								// Remove all rows
								while (table_len>0){
									table.deleteRow(0);
									table_len=(table.rows.length);
								}
							}
							else {
								document.getElementById("title").innerHTML='<h4>You can add or delete prizes.</h4>'
								$('table[id=data_table]').attr('hidden', false);
								showprizes();
							}
						});
				  }
				  else{
						/*document.getElementById("title").innerHTML='<font color="red"><h4> We need you to authorize first. Go to Motifun settings !</h4></font>';
								var table=document.getElementById("data_table");
								var table_len=(table.rows.length);
								// Remove all rows
								while (table_len>0){
									table.deleteRow(0);
									table_len=(table.rows.length);
								} */
						//t.closePopup();
						document.getElementById('title').innerHTML = '<p><h4>We need you to authorize first !.</h4></p> <center><button id="authorize" type="button" class="mod-primary" onclick=" AuthenticateTrello()">Authorize</button></center>'			
				  }
				}); 
				//********
			});
		});
});
