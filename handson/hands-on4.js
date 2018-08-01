// ①まずはお約束の即時関数 + 厳格モード記述
(function() {
  'use strict';

  // ② kintone JS APIの記述
  kintone.events.on('app.record.create.submit', function(event) {
    // ハンズオン④アプリのフィールド情報を取得する
    var textValue = event.record['text3'].value;

    // ③ リクエストボディの記述
    var body = {
      app: <アプリID>, // ハンズオン①アプリのアプリID
      record: {
        'text': {
          'value': textValue
        }
      }
    };
    // ③ kintone REST APIの記述：レコード1件登録
    kintone.api(kintone.api.url('/k/v1/record'),'POST', body, function(resp) {
      window.alert('POST成功しました！');
    }, function(err) {
      window.alert('POST失敗しました');
    });
  });
})();
