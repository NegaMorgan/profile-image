'use strict';

var _ = require('lodash');
var path = require('path');
var mapRequire = require('map-require');
var profileImage = require('profile-image');

function collect(meetup){
  return meetup.speakers;
}
// TODO make flatten work inside collect()
var speakers = _.flatten(mapRequire(path.join(__dirname, '..', '..', 'speakers'), collect));

// for each speaker, if file doesn't exist, try to download file
_.each(speakers, function(speaker){
  if (!profileImage.exists(speaker.name)) { 
    profileImage.download(speaker, function(result){
      console.log('Image download attempted for '+ speaker.name + ': ' + result);
    });
  }
});