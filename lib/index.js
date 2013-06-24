
var stream = require('readable-stream')
  , util   = require('util');


module.exports = S3Lister;


/**
 * Create a new S3Lister
 * @param {Object} s3  a knox-like client
 * @param {Object} options
 *   @field {Boolean} start  key to start with
 */
function S3Lister (s3, options) {
  options || (options = {});
  options.objectMode = true;

  stream.Readable.call(this, options);

  this.s3         = s3;
  this.marker     = options.start;
  this.options    = options;
  this.connecting = false;
}
util.inherits(S3Lister, stream.Readable);


/**
 * Readable stream method
 */
S3Lister.prototype._read = function () {
  if (this.connecting || this.ended) return;

  var options = {
    prefix     : this.options.prefix,
    marker     : this.marker,
    delimiter  : this.options.delimiter,
    'max-keys' : this.options.maxKeys
  };

  this._list(options);
};


/**
 * Request S3 for the list of files matching the prefix.
 * @param  {Object} options
 *   @field {String} prefix    - prefix to match on       (optional)
 *   @field {String} marker    - the last matched file    (optional)
 *   @field {String} delimiter - delimiter to split files (optional)
 *   @field {Number} maxKeys   - max number of keys to return (optional, 1000)
 */
S3Lister.prototype._list = function (options) {
  var self = this;
  this.connecting = true;

  this.s3.list(options, function (err, data) {
    self.connecting = false;
    if (err) return self.emit('error', err);

    var files = data.Contents;

    // if there's still more data, set the start as the last file
    if (data.IsTruncated) self.marker = files[files.length - 1].Key;
    else self.ended = true;

    files.forEach(function (file) { self.push(file); });
    if (self.ended) self.push(null);
  });
};



