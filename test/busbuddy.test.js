var assert = require('assert');
var busbuddy = require('../');

var mockHttp = function (expectedOptions) {
  return {
    get: function (options, callback) {
      expectedOptions.actual = options;
      callback({
	on: function (e, f) {
	  f('{ "dummyJson": "dummy" }'); 
	}
      });
    }
  };
};

module.exports = {

  'should expose version': function () {
    assert.ok(/^[0-9]\.[0-9]\.[0-9]$/.test(busbuddy.version));
  }

, 'should fetch bus stops and respond with js object': function (beforeExit) {
    var options = {
      actual : {}
    , called : false
    , response: ''
    };

    var bus = busbuddy('1234', mockHttp(options));
    bus.stops(function (stops) {
      options.called = true;
      options.response = stops;
    });

    beforeExit(function () {
      assert.equal('api.busbuddy.norrs.no', options.actual.host);
      assert.equal(8080, options.actual.port);
      assert.equal('1234', options.actual.headers['X-norrs-busbuddy-apikey']);
      assert.equal('/api/1.0/busstops', options.actual.path);
      assert.ok(options.called);
      assert.equal('dummy', options.response.dummyJson)
    });
  }

, 'should fetch depatures and respond with js object': function (beforeExit) {
    var options = {
      actual : {}
    , called : false
    , response: ''
    };
    var bus = busbuddy('1234', mockHttp(options));
    bus.departures(1, function (departures) {
      options.called = true;
      options.response = departures;
    });

    beforeExit(function () {
      assert.equal('api.busbuddy.norrs.no', options.actual.host);
      assert.equal(8080, options.actual.port);
      assert.equal('1234', options.actual.headers['X-norrs-busbuddy-apikey']);
      assert.equal('/api/1.0/departures/1', options.actual.path);
      assert.ok(options.called);
      assert.equal('dummy', options.response.dummyJson)
    })
  }
}
