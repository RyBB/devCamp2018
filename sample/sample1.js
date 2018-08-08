const i2c = require('i2c');
const request = require('request');

// sensor設定
const ADDRESS = 0x48;
const INTERVAL = 5000;
const sensor = new i2c(ADDRESS, {device: '/dev/i2c-1'});

// kintoneの設定
const DOMAIN = '{subdomain}.cybozu.com';
const URL = 'https://' + DOMAIN + '/k/v1/record.json';
const APP_ID = '{APP ID}}}';
const API_TOKEN = '{API Token}';
const headers = {'X-Cybozu-API-Token': API_TOKEN};

// read from ADT7410
const readValue = () => {
  return new Promise(resolve => {
    sensor.readBytes(0x00, 2, (err, data)=> {
      let temp;
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
  const body = {
    'app': APP_ID,
    'record': {
      'temp': {
        'value': value
      }
    }
  };
  const options = {
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
