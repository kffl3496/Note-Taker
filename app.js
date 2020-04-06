const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/notes', function(res, res) {
  res.sendFile(path.join(__dirname + '/public/notes.html'));
});

app.get('/api/notes', function(req, res) {
  fs.readFile(path.join(__dirname + '/db/db.json'), (err, data) => {
    if(err) throw err;
    const ret = JSON.parse(data);
    res.send(ret);
  });
});

app.post('/api/notes', function(req, res) {
  fs.readFile(path.join(__dirname + '/db/db.json'), (err, data) => {
    if(err) throw err;
    let ret = JSON.parse(data);
    let newNote = req.body;
    newNote.id = uuidv4();
    ret.push(newNote);
    fs.writeFile(path.join(__dirname + '/db/db.json'), JSON.stringify(ret), (err) => {
      if (err) throw err;
    });
    res.send(ret);
  });
});

app.delete('/api/notes/:id', function(req, res) {
  fs.readFile(path.join(__dirname + '/db/db.json'), (err, data) => {
    if(err) throw err;
    const ret = JSON.parse(data);
    const id = req.params.id;
    const filteredArray = ret.filter(x => x.id !== id);
    fs.writeFile(path.join(__dirname + '/db/db.json'), JSON.stringify(filteredArray), (err) => {
      if (err) throw err;
    });
    res.send(ret);
  });
});

// app.listen(port);
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
