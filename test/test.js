
var assert   = require('assert')
  , auth     = require('./auth.json')
  , knox     = require('knox')
  , S3Lister = require('../');


var client = knox.createClient(auth);


describe('S3Lister', function () {

  var files  = 10
    , folder = '_s3-list-test';

  function fileOperation (fn, done) {
    var completed = 0;

    function cb (err, res) {
      if (err) return done(err);
      completed += 1;
      if (completed >= files) done();
    }

    for (var i = 0; i < files; i++) {
      var filename = folder + '/' + i + '.txt';
      fn(filename, cb);
    }
  }

  before(function (done) {
    function upload(filename, cb) {
      client.putBuffer(new Buffer(filename), filename, cb);
    }

    fileOperation(upload, done);
  });


  it ('should list all the files', function (done) {
    var stream    = new S3Lister(client, { prefix : folder })
      , filesSeen = 0;

    stream
      .on('data',  function (file) { filesSeen += 1; })
      .on('error', function (err)  { done(err); })
      .on('end',   function ()     {
        assert.equal(filesSeen, files);
        done();
      });
  });

  it ('should list n files when options.maxResults is set to n', function (done) {
    var maxResults = 5
      , stream    = new S3Lister(client, { maxResults : maxResults })
      , filesSeen = 0;

    stream
      .on('data',  function (file) { filesSeen += 1; })
      .on('error', function (err)  { done(err); })
      .on('end',   function ()     {
        assert.equal(maxResults, filesSeen);
        done();
      });
  });

  it('should list all the files if maxKeys < number of files', function (done) {
    var stream = new S3Lister(client, {
      maxKeys : 6,
      prefix  : folder
    });

    var filesSeen = 0;

    stream
      .on('data',  function (file) { filesSeen += 1; })
      .on('error', function (err)  { done(err); })
      .on('end',   function ()     {
        assert.equal(filesSeen, files);
        done();
      });
  });


  it('should respect the file start', function (done) {
    var start = 4;

    var stream = new S3Lister(client, {
      maxKeys : 6,
      prefix  : folder,
      start   : folder + '/' + start + '.txt'
    });

    var filesSeen = 0;

    stream
      .on('data',  function (file) { filesSeen += 1; })
      .on('error', function (err)  { done(err); })
      .on('end',   function ()     {
        assert.equal(filesSeen, files - start - 1);
        done();
      });
  });


  after(function (done) {
    function remove(filename, cb) {
      client.deleteFile(filename, cb);
    }

    fileOperation(remove, done);
  });
});
