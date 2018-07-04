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
    }
    // ③ kintone REST APIの記述
    return kintone.api(kintone.api.url('/k/v1/records'), 'GET', params)
    .then(function(resp) {
      if (!resp.records.length) {
        return;
      }
      event.error = 'すでに本日分のレコードが登録されています！';
      return event;
    }).catch(function(err) {
      event.error = 'REST APIの操作に失敗しました\n' + err.code + '\n' + err.message;
      return event;
    });
  });
})();

