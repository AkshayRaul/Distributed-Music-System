var express = require('express');
var app=express();
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/Music");
var db= mongoose.connection;
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var fs = require('fs');
db.once('open', function () {
    console.log('open');
    var gfs = Grid(db.db);

    // streaming to gridfs
    //filename to store in mongodb
    var writestream = gfs.createWriteStream({
        filename: 'mongo_song.mp3'
    });
    fs.createReadStream('/home/akshay/Music/Jab\ Tak\ -\ M.S.\ Dhoni.mp3').pipe(writestream);

    writestream.on('close', function (file) {
        // do something with `file`
        console.log(file.filename + 'Written To DB');
    });
    var fs_write_stream = fs.createWriteStream('write.mp3');

//read from mongodb
    var readstream = gfs.createReadStream({
        filename: 'mongo_song.mp3'
    });
    readstream.pipe(fs_write_stream);
    fs_write_stream.on('close', function () {
        console.log('file has been written fully!');
    });
});

app.get('/getMusic',function (req,res) {
   res.json(JSON.stringify({"Hey":"hello"}));
});