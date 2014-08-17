'use strict';

var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var http = require('http');
var is = require('is-predicate');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-fs'));

var profileImage = require('profile-image');
var person = {
  name: 'Exist S',
  twitter: 'NASA'
};

describe('profileImage', function(){
  
  describe('#download', function(){
    it('saves the file to the provided destination', function(){
      // TODO figure out how to mock this http request
      var destination = path.join(__dirname, '/fixtures/kitten.jpg');
      var results = ['success', 'failed'];

      profileImage.download(person, function(result){
        expect(results).to.include(result);
        expect(destination).to.be.a.file();

        // delete the test file
        fs.unlink(destination, function (err) {
          if (err) throw err;
        });
      });
    });
  });

  describe('#exists', function(){
    it('boolean: does a file exist for the given name?', function(){
      var name1 = person.name;
      var name2 = 'Doesnt Exist';
      var destination = path.join(__dirname, 'fixtures');

      expect(profileImage.exists(name1, destination)).to.be.true;
      expect(profileImage.exists(name2, destination)).to.be.false;
    });

  });

  describe('#imagify', function(){
    it('converts string (person name) into filename', function(){
      var name1 = 'Felix Cat';
      var name2 = 'Some Cat';

      expect(profileImage.imagify(name1)).to.equal('felixcat.jpg');
      expect(profileImage.imagify(name2)).to.equal('somecat.jpg');
    });
    it('can handle middle initials'); // TODO, this seems to be funky...
  });

  describe('#append', function(){
    it('returns the given object extended with an image property', function(){
      var person2 = { name: 'Doesnt Exist' };
      var destination = path.join(__dirname, 'fixtures');

      expect(profileImage.append(person, destination)).to.ownProperty('image');
      expect(profileImage.append(person, destination).image).to.equal('exists.jpg');
      expect(profileImage.append(person2, destination)).to.not.ownProperty('image');
    });

  });

});
