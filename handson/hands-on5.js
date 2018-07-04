(function() {
  'use strict';

  // レコード追加イベント
  kintone.events.on('app.record.create.submit', function(event) {
    var record = event.record;

    var params = {
      app: event.appId,
      query: '作成者 in (LOGINUSER()) and 作成日時 = TODAY()'
    }
    return kintone.api(kintone.api.url('/k/v1/records'), 'GET', params)
    .then(function(resp) {
      if (!resp.records.length) {
        return;g
      }
      event.error = 'すでに本日分のレコードが登録されています！';
      return event;
    }).catch(function(err) {
      event.error = 'REST APIの操作に失敗しました\n' + err.code + '\n' + err.message;
      return event;
    });
  });
})();

