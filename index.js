'use strict';

var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var http = require('http');
var Twitter = require('twitter');
var mapRequire = require('map-require');

/* jshint camelcase: false */
var config = {
  consumer_key: 'AuCTJJkwLGemXxxi2IPag',
  consumer_secret: '4IIpSfjPbvUNEN3scPogNVuC5Wbseabn2T97kRR1tms',
  access_token_key: '2296757942-WIkUaGQyHxHsSe6W4KsWnXStZo9Up6cw5LLqsQq',
  access_token_secret: 'esTngppPSimuksCGoeb3UUjkDtYawzgGy3adwiO6eP1tX'
}; // TODO env variables?

var twitter = new Twitter(config);
var PHOTOS_PATH = path.join(__dirname, '..', '..', 'public', 'images', 'speakers');
// TODO there must be a better way to build the path

var profileImage = module.exports;

function findImage(speaker, cb) {
  if (speaker.twitter) {
    var profile = speaker.twitter;
    twitter.get('/users/show.json', {screen_name: profile}, function (data) {
      data.profile_image_url ? cb(data.profile_image_url.replace('_normal','')) : cb(null);
    }); 
  } else { cb(null); }
}

function deleteFile(location, err) {
  if (err) { console.log(err.message); }
  fs.unlink(location);
}

profileImage.saveFile = function(url, destination){
  var file = fs.createWriteStream(destination);
  
  http.get(url, function(response) {

    response.pipe(file);
    file.on('finish', function() {
      file.close();
    });
    file.on('error', function(err){
      deleteFile(destination, err);
    });
    
  }).on('error', function(err){
    deleteFile(destination, err);
  });
};

profileImage.exists = function(name) {
  var fname = profileImage.imagify(name);
  return !!fs.existsSync(path.join(PHOTOS_PATH, fname));
};

profileImage.imagify = function(name) {
  // TODO is this always a jpg? find out
  return name.trim().toLowerCase().replace(' ', '') + '.jpg';
};

profileImage.download = function(speaker, cb) {
  var fname = profileImage.imagify(speaker.name);
  var destination = path.join(PHOTOS_PATH, fname);
  findImage(speaker, function(response){
    if (response){
      cb('success');
      profileImage.saveFile(response, destination);
    } else { cb('failed'); } // TODO fail with more details
  });
};

profileImage.append = function(speaker) {
  var fname = profileImage.imagify(speaker.name);
  // filename of image is
  if (profileImage.exists(speaker.name)) {
    return _.extend({ image: fname }, speaker);
  }

  return speaker;
}
