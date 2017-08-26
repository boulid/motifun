var t = window.TrelloPowerUp.iframe();

t.render(function() {
  return t.sizeTo('#content');
})


var authBtn = document.getElementById('unauthorize');
authBtn.addEventListener('click', function() {
	return t.set('member', 'private', 'authToken', '')
	.then(function() {
		return t.closePopup();
	});
});
