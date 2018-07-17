const i2c = require('i2c');
const request = require('request');

// sensor設定
const ADDRESS = 0x48;
const INTERVAL = 5000;
const sensor = new i2c(ADDRESS, {device: '/dev/i2c-1'});

// kintoneの設定
var DOMAIN = '{subdomain}.cybozu.com';
var URL = 'https://' + DOMAIN + '/k/v1/record.json';
var APP_ID = '{APP ID}}}';
var API_TOKEN = '{API Token}';
var headers = {'X-Cybozu-API-Token': API_TOKEN};

// read from ADT7410
const readValue = () => {
  return new Promise(resolve => {
    sensor.readBytes(0x00, 2, (err, data)=> {
      var temp;
      temp = (data[0] << 8 | data[1]) >> 3;
        if (temp >= 4096) {
          temp -= 8192;
        }
        temp = temp * 0.0625;
        console.log('Temperature: ' + temp + '℃');
        return resolve(temp);
    });
  });
};
// post kintone
const postkintone = value => {
  var body = {
    'app': APP_ID,
    'record': {
      'temp': {
        'value': value
      }
    }
  };
  var options = {
    method: 'POST',
    url: URL,
    headers: headers,
    'Content-Type': 'application/json',
    json: body
  };
  request(options, err =>{
    if (err) {
        console.log('error!:' + err);
        return;
    }
    console.log('success');
  });
};
// loop
setInterval(() => {
  Promise.resolve()
    .then(readValue)
    .then(postkintone)
    .catch(err => {
      console.log(err);
    });
}, INTERVAL);
