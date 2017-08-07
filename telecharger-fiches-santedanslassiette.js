'use strict';

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var ProgressBar = require('progress');

var url='http://www.lasantedanslassiette.com/au-menu/medias/fiches-pratiques/fiches-pratiques.html'
var baseUrlPageFichePratique='http://www.lasantedanslassiette.com/au-menu/medias/fiches-pratiques/'
var baseUrlImageFichePratique='http://www.lasantedanslassiette.com/images/'

// var url = 'http://www.mega-image.ro/corporate/maps/map.php?t=1';

// Should permit to remove the 'rejectUnauthorized' option but doesn't work
//require('ssl-root-cas').inject();

var pageLinks = [];
var imageLinks = [];

var imagesDir = 'fiches_pratiques_santedanslassiette';
fs.mkdir(imagesDir, err => null);

function getRequestConfig(url) {
  return {
    method: 'GET'
    , uri: url
    , gzip: true
    , 'rejectUnauthorized': false
  };
}

function download(url, dest, cb) {
    var len = 0;
    var file = fs.createWriteStream(dest);
    var sendReq = request.get(url);

    // verify response code
    sendReq.on('response', function(response) {
        if (response.statusCode !== 200) {
            return cb('Response status was ' + response.statusCode);
        }
    });

    // check for request errors
    sendReq.on('error', function (err) {
        fs.unlink(dest);
        return cb(err.message);
    });

    sendReq.on('response', function(response) {
      var len = parseInt(response.headers['content-length'], 10);

      var bar = new ProgressBar('downloading [:bar] :rate/:total :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: len
      });

      // unmodified http.IncomingMessage object
      response.on('data', function(chunk) {
        // compressed data as it is received
        bar.tick(chunk.length);
      })
    });

    sendReq.pipe(file);

    file.on('finish', function() {
        file.close(cb);  // close() is async, call cb after close completes.
    });

    file.on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        return cb(err.message);
    });
};

request(getRequestConfig(url), function (error, response, body) {
  if (error) {
    throw error;
  }

  if (response.statusCode != 200) {
    throw response.statusCode;
  }

  var $ = cheerio.load(body);
  $('div.suggestions').children('a').each(function() {
    pageLinks.push(baseUrlPageFichePratique + $(this).attr('href'));
  });

  // console.log(pageLinks);
  pageLinks.forEach(function(link) {
    request(getRequestConfig(link), function (error, response, body) {
      if (error) {
        throw error;
      }

      if (response.statusCode != 200) {
        throw response.statusCode;
      }

      var $ = cheerio.load(body);
      var imgFilename =
      $('article.grid_8')
      .children('img.cadrebp')
      .attr('src')
      .split('/')
      .pop();

      var imgUrl = baseUrlImageFichePratique + imgFilename;

      download(imgUrl, imagesDir + '/' + imgFilename, console.log);

    });
  })
})
