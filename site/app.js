var express = require('express');
var app = express();


app.get('/', function(req, res) {
    res.sendFile('index.html')
})


app.listen(3000, function() {
  console.log('App launched on port 3000.')
})
