var assert = require('assert');
var busbuddy = require('../');
var key = 'CHANGE-THIS-WITH-YOUR-API-KEY'
var bus = busbuddy(key);

module.exports = {
  'you should provide your own api key for the integration tests': function () {
    assert.ok(key != 'CHANGE-THIS-WITH-YOUR-API-KEY');
  }
, 'should look up bus stops' : function (beforeExit) {
    var stops;
    bus.stops(function (json) {
      stops = json.busStops;
    });

    beforeExit(function () {
      assert.ok(stops.length > 0);
    });
  }
, 'should look up departures': function (beforeExit) {
    var departures;
    bus.departures(100852, function (json) {
      departures = json.departures;
    });

    beforeExit(function () {
      assert.ok(departures.length > 0);
    });
  }
};
