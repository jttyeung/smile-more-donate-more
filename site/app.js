var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'))



// Routes
app.get('/', function(req, res) {
    res.render('index');
})



// Port for AWS deployment or local
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('App launched on port 3000.')
})
