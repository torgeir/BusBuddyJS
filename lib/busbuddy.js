
/*!
 * busbuddy
 * Copyright(c) 2011 Torgeir Thoresen <@torgeir> 
 * MIT Licensed
 */

(function (isBrowser) {

  var context = (isBrowser ? window : module)[isBrowser ? 'busbuddy' : 'exports'] = function (key, http) {

    http = http || require('http');

    var options = {
      host: 'api.busbuddy.norrs.no'
    , port: 8080
    , headers: {}
    };
    
    var fetch = function (http, callback, path) {

      options.path = path || options.path;
      options.headers['X-norrs-busbuddy-apikey'] = key;

      http.get(options, function(res) {

	var data = '';
	res.on('data', function(chunk) {
	  data += chunk;
	});
	res.on('end', function () {
	  var json;
	  try {
	    callback(JSON.parse(data));
	  }
	  catch (e) {
	    throw "busbuddy: could not parse json: " + e;
	  }
	});
      });
    };

    var fetcher = {
      fetchBusStops: function (callback) {
	fetch(http, callback, '/api/1.0/busstops');
      },
      fetchDepartures: function (id, callback) {
	fetch(http, callback, '/api/1.0/departures/' + id);
      }
    }; 

    return {
      stops: fetcher.fetchBusStops
    , departures: fetcher.fetchDepartures
    };
  };

  context.version = '0.0.1'

})(typeof window !== 'undefined');
