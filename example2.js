(() => {
  'use strict';

  // フィールドコード
  const obj = {
    lookup: 'ルックアップ',
    num: 'ルックアップ元のレコード番号',
    table: 'テーブル',
    table2: 'ルックアップ元テーブル',
  };

  // ルックアップで取得するフィールドの変更イベントを利用する
  // -> ルックアップ自体のイベントトリガーは現状存在しないため
  // ルックアップを変更すれば上記フィールドも変更されるためイベントが発火する
  const events = [
    'app.record.create.change.' + obj.num,
    'app.record.edit.change.' + obj.num,
  ];

  kintone.events.on(events, event => {
    new kintone.Promise((resolve, reject) => {
      // ルックアップ元アプリのアプリIDとレコードIDを取得する
      const targetAppId = kintone.app.getLookupTargetAppId(obj.lookup);
      const targetRecordId = event.record[obj.num].value;

      // ルックアップをしていなかったらテーブルを空にする
      if (!targetRecordId) {
        reject();
        return;
      }
      const body = {
        app: targetAppId,
        id: targetRecordId,
      };
      kintone.api(kintone.api.url('/k/v1/record'), 'GET', body, resp => {
        resolve(resp);
      }, err => {
        window.alert('REST APIでエラーが発生しました\n'+ err.code + '\n' + err.message);
      });
    })
      .then(val => {
        // 現在のフィールド情報を取得 (ルックアップデータ含む)
        const data = kintone.app.record.get();
        // テーブルの初期化
        data.record[obj.table].value = [];
        // RESTで取得したテーブルの値を挿入する(配列のPush関数)
        val.record[obj.table2].value.forEach(ele => {
          data.record[obj.table].value.push(ele);
        });
        data.record[obj.table].value.forEach(ele => {
          ele.value['日付'].disabled = true;
          ele.value['部署名'].disabled = true;
          ele.value['担当者名'].disabled = true;
        });
        // event(挿入したテーブル情報)をkintoneへ返す
        kintone.app.record.set(data);
      })
      .catch(() => {
        // 現在のフィールド情報を取得 (ルックアップデータ含む)
        const data = kintone.app.record.get();
        // テーブルの初期化
        data.record[obj.table].value = [];
        kintone.app.record.set(data);
      });
  });
  const events2 = [
    'app.record.create.show',
    'app.record.edit.show',
  ];
  kintone.events.on(events2, e => {
    e.record[obj.table].value.forEach(ele => {
      ele.value['日付'].disabled = true;
      ele.value['部署名'].disabled = true;
      ele.value['担当者名'].disabled = true;
    });
    return e;
  })
})();
