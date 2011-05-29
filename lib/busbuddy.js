
/*!
 * busbuddy
 * Copyright(c) 2011 Torgeir Thoresen <@torgeir> 
 * MIT Licensed
 */

(function (isBrowser) {

  var context = (isBrowser ? window : module)[isBrowser ? 'busbuddy' : 'exports'] = function (key, http) {

    var options = {
      host: 'api.busbuddy.norrs.no'
    , port: 8080
    , headers: {}
    };
    
    var fetch = function (callback, path) {

      options.path = path || options.path;

      if (isBrowser) {
	var now = Date.now();
	var callbackName = 'busbuddyResponse' + now;
	window[callbackName] = function () {
	  callback.apply(this, arguments);
	  delete window[callbackName];
	};

        var script = document.createElement('script');	
	script.type = 'text/javascript';
	script.src = 'http://' + options.host + ':' + options.port + options.path + '?apiKey=' + key + '&callback=' + now;
	document.body.appendChild(script);
      }
      else {
	options.headers['X-norrs-busbuddy-apikey'] = key;
	(http || require('http')).get(options, function(res) {

	  var data = '';
	  res.on('data', function(chunk) {
	    data += chunk;
	  });
	  res.on('end', function () {
	    try {
	      if (JSON && JSON.parse) {
		callback(JSON.parse(data));
	      }
	      else {
		throw 'BusBuddyJS: you need to include json2.js (https://github.com/douglascrockford/JSON-js/blob/master/json2.js) for BusBuddyJS to work.'
	      }
	    }
	    catch (e) {
	      throw 'BusBuddyJS: could not parse json: ' + e;
	    }
	  });
	});
      }
    };

    var fetcher = {
      fetchBusStops: function (callback) {
	fetch(callback, '/api/1.0/busstops');
      },
      fetchDepartures: function (id, callback) {
	fetch(callback, '/api/1.0/departures/' + id);
      }
    }; 

    return {
      stops: fetcher.fetchBusStops
    , departures: fetcher.fetchDepartures
    };
  };

  context.version = '0.0.2'

})(typeof window !== 'undefined');
