var express = require('express');
var app = express();
var fs = require('fs');

app.set("views", __dirname);
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000; 

//ROUTES
app.get('/instruction', function (reqqest, response) {
  response.render('instruction.html');
});

app.get('/paper', function (reqqest, res) {
    var filePath = "/public/paper.pdf";
    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.get("*", function(request, response){
	response.render('index');
});

app.listen(port, function () {
  console.log('Example app listening on port' + port);
});