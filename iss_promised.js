const request = require('request-promise-native');

const fetchMyIP = () => {
  return request("https://api.ipify.org?format=json");
};

const fetchCoordsByIP = (ipObject) => {
  let IP = JSON.parse(ipObject).ip;
  return request(`http://ip-api.com/json/${IP}`);
};

const fetchISSFlyOverTimes = (coordinates) => {
  const { lat, lon } = JSON.parse(coordinates);
  return request(`http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`);
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const {response} = JSON.parse(data);
      return response;
    });
};


module.exports = { nextISSTimesForMyLocation };