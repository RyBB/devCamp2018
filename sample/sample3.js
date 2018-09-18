/*
ボタン配置した場合のJS
スペースフィールド (フィールドコード：space)を配置してください。
そのスペースフィールドに対してappendでボタンを生成します。
*/

(function() {
  'use strict';

  // 郵便番号から住所を取得する関数
  var getAddress = function() {
    // 関数実行時のフィールド情報を取得する
    var e = kintone.app.record.get();
    var ZIPCODE = e.record['zipcode'].value;

    // 郵便番号APIの情報
    var URL = 'http://zipcloud.ibsnet.co.jp/api/search?zipcode=' + ZIPCODE;

    // 外部APIを実行する：リクエスト
    kintone.proxy(URL, 'GET', {}, {})
    .then(function(resp) {
      var res = JSON.parse(resp[0]);
      if (!res.results) {
        window.alert('郵便番号を入力してください');
        return;
      }
      e.record['address1'].value = res.results[0].address1;
      e.record['address2'].value = res.results[0].address2;
      e.record['address3'].value = res.results[0].address3;

      // イベントハンドラーがすでに終わっているので意図的にeventを返す
      kintone.app.record.set(e);
    })
    .catch(function(err) {
      window.alert(err);
    });
  };
  // 住所フィールドの編集権限を不可にする + ボタン生成
  var events = ['app.record.create.show', 'app.record.edit.show'];
  kintone.events.on(events, function(event) {
    var record = event.record;
    record['address1'].disabled = true;
    record['address2'].disabled = true;

    var btn = document.createElement('button');
    btn.textContent = '郵便番号から住所を検索する';
    btn.style.height = '50px';
    btn.style.marginTop = '10%';
    btn.onclick = getAddress;
    kintone.app.record.getSpaceElement('space').appendChild(btn);
    return event;
  });
})();

