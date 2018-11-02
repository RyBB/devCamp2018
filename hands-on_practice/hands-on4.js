(function() {
  'use strict';

  // ①イベントを記述してください
  kintone.events.on('XXXX', function(event) {
    var textValue = event.record['text3'].value;

    // ③リクエストパラメータを記述してください


    // ②メソッドを記述してください
    kintone.api(kintone.api.url('/k/v1/record'),'XXXX', params, function(resp) {
      window.alert('POST成功しました！');
    }, function(err) {
      window.alert('POST失敗しました');
    });
  });
})();