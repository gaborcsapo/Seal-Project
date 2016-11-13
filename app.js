var express = require('express');
var app = express();

app.set("views", __dirname);
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

//ROUTES
app.get("*", function(request, response){
	response.render('index');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});