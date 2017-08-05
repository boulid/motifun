var express = require('express');
var cors = require('cors');

var app = express();


// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: '*' }));
//app.use(cors({ origin: 'https://trello.com' }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.static('view'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("*", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

process.env.PORT=3000;

// listen for requests :)
var listener = app.listen(3000, function () {
  //console.log(__dirname + '/views/index.html');
  console.log('Your app is listening on port ' + listener.address().port);
});
