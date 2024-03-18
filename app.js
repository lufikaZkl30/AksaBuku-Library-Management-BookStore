var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static("public"));

// index page
app.get('/', function(req, res) {
  res.render('../views/index', {title: "Home"});
});

app.listen(8080);
console.log('Server is listening on port 8080');