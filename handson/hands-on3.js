// ①まずはお約束の即時関数 + 厳格モード記述
(function() {
  'use strict';

  // ② kintone JS APIの記述
  kintone.events.on('app.record.create.show', function(event) {
    // ③ リクエストボディの記述
    var params = {
      app: '<アプリID>',
      id: 1
    };
    // ③ kintone REST APIの記述：レコード1件取得
    kintone.api(kintone.api.url('/k/v1/record'),'GET', params, function(resp) {
      window.alert(resp.record.text.value);
    });
  });
})();
