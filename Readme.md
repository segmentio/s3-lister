
S3-List
=======

A simple library to stream all the files which are the contents of an s3 folder.


## Usage

```javascript
// Print all the files for a given prefix.

var client = knox.createClient({
  key    : '<api-key-here>',
  secret : '<secret-here>',
  bucket : 'segmentio'
});

var lister = new S3Lister(client, {prefix : 'logs/api/a0z4'});

lister
  .on('data',  function (data) { console.log(data.Key); })
  .on('error', function (err)  { console.log('Error!', err); })
  .on('end',   function ()     { console.log('Done!'); });
```


### new S3Lister(s3, options)

* s3      - a knox client
* options

In addition to the standard stream options, you can also pass in specific options:

* start     - string to start with
* prefix    - the prefix to list under
* start     - s3 will return every key alphabetically after this string
* delimiter - the character you use to group keys
* maxKeys   - maximum amount of keys in a batch, (limited to 1000)


## License

(The MIT License)

Copyright (c) 2013 Segment.io <friends@segment.io>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.