var express = require('express');
var cors = require('cors');
var jsonfile = require('jsonfile');
var bodyParser = require('body-parser');

var app = express();

var file = './data.json';

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: '*' }));
//app.use(cors({ origin: 'https://trello.com' }));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.static('views'));

// http://expressjs.com/en/starter/basic-routing.html
/*app.get("*", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});*/

app.get("/data", function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    response.sendFile(__dirname + '/data.json');
//    
//    jsonfile.readFile(__dirname + '/data.json', function (err, obj) {
//        response.send(JSON.stringify(obj));
//    });
});

app.post('/', function (sReq, sRes) {
    console.dir(sReq.body);
    jsonfile.writeFile(file, sReq.body, { flag: 'a' }, function (err) {
        console.log(err);
    });
});

//var obj = { _user: userName, _tentations: tentations, _items: selecteditems };


// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  //console.log(__dirname + '/views/index.html');
  console.log('Your app is listening on port ' + listener.address().port);
});
