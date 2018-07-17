// ①まずはお約束の即時関数 + 厳格モード記述
(function() {
  'use strict';

  // ② kintone JS APIの記述
  // レコード追加時の保存イベント
  kintone.events.on('app.record.create.submit', function(event) {

    // ③ リクエストボディの記述
    var params = {
      app: event.appId,
      query: '作成者 in (LOGINUSER()) and 作成日時 = TODAY()'
    };
    // ③ kintone REST APIの記述
    // REST APIは非同期処理になるため、Promiseを利用する
    return kintone.api(kintone.api.url('/k/v1/records'), 'GET', params)
    .then(function(resp) {
      // GETしたレコードがなければ、レコード保存 OK
      if (!resp.records.length) {
        return;
      }
      // もしレコードがあれば、レコード保存 NG
      event.error = 'すでに本日分のレコードが登録されています！';
      return event;
    }).catch(function(err) {
      // APIの操作に失敗した場合
      window.alert('REST APIの操作に失敗しました');
    });
  });
})();

