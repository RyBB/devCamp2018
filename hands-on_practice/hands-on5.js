(function() {
  'use strict';

  // 郵便番号フィールドが変更されたイベント
  kintone.events.on([
    'app.record.create.change.zipcode',
    'app.record.edit.change.zipcode'
  ], function(event) {
    var ZIPCODE = event.record['zipcode'].value;

    // 郵便番号APIの情報
    var URL = 'http://zipcloud.ibsnet.co.jp/api/search?zipcode=' + ZIPCODE;

    // 外部APIを実行する：リクエスト
    // この下に外部APIを実行する処理を記述してください


      // 実行後の処理は以下になります。
      var res = JSON.parse(resp);
      if (!res.results) {
        return;
      }
      event.record['address1'].value = res.results[0].address1;
      event.record['address2'].value = res.results[0].address2;
      event.record['address3'].value = res.results[0].address3;

      // イベントハンドラーがすでに終わっているので意図的にeventを返す
      kintone.app.record.set(event);

    }, function(err) {
      window.alert(err);
    });
  });
})();
