var t = window.TrelloPowerUp.iframe();

t.render(function() {
  return t.sizeTo('#content');
})


var authBtn = document.getElementById('authorize');
authBtn.addEventListener('click', function() {
	AuthenticateTrello(); 
});


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
