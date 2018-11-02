(function() {
  'use strict';

  // 郵便番号フィールドが変更されたイベント
  kintone.events.on(['app.record.create.change.zipcode', 'app.record.edit.change.zipcode'], function(event) {
    var record = event.record;
    var ZIPCODE = record['zipcode'].value;

    // 郵便番号APIの情報
    var URL = 'http://zipcloud.ibsnet.co.jp/api/search?zipcode=' + ZIPCODE;

    // 外部APIを実行する：リクエスト
    kintone.proxy(URL, 'GET', {}, {})
    .then(function(resp) {
      var res = JSON.parse(resp[0]);
      if (!res.results) {
        return;
      }
      record['address1'].value = res.results[0].address1;
      record['address2'].value = res.results[0].address2;
      record['address3'].value = res.results[0].address3;

      // イベントハンドラーがすでに終わっているので意図的にeventを返す
      kintone.app.record.set(event);
    })
    .catch(function(err) {
      window.alert(err);
    });
  });
})();
