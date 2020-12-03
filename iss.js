const request = require('request');

const nextISSTimesForMyLocation = function(callback) {

  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, times) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, times);
      });
    });
  });
};

const fetchMyIP = function(callback) {
  request("https://api.ipify.org?format=json", (error, response, body) => {

    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null, JSON.parse(body).ip);
  });
};

const fetchCoordsByIP = function (ip, callback) {
  request("http://ip-api.com/json/" + ip, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode === 200) {
      const { lat, lon } = JSON.parse(body);
      callback(null, { lat, lon });
      return;
    } else {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
    }
  });
};

const fetchISSFlyOverTimes = function (coords, callback) {

  const URL = `http://api.open-notify.org/iss-pass.json?lat=${coords.lat}&lon=${coords.lon}`;

  request(URL, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode === 200) {
      const passes = JSON.parse(body).response;
      callback(null, passes);
      return;
    } else {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
    }
  });
};

module.exports = { nextISSTimesForMyLocation };
