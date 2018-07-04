jQuery.noConflict();
($ => {
  'use strict';
  const button = {
    start: {
      id: 'startButton',
      text: '出勤',
    },
    end: {
      id: 'endButton',
      text: '退勤',
    },
    bgcolor: {
      on: '#000000',
      off: '#cccccc',
    },
  };

  // POST/PUT成功時のアラート表示
  const successfunc = rsp => {
    if (rsp.id) {
      window.alert('出勤登録しました');
    } else {
      window.alert('退勤登録しました');
    }
    location.reload();
  };

  // 失敗時のアラート表示
  const errorfunc = err => {
    window.alert(
      'エラーコード:' +
        err.code +
        '\nエラーメッセージ:' +
        err.message +
        '\n\n' +
        'エラーメッセージをご確認ください。\n' +
        '予期せぬエラーが発生している場合は、\n' +
        '上記のエラーコード、エラーメッセージを管理者へご連絡ください\n'
    );
  };

  // ボタンの作成( + 詳細設定)
  const makeButton = option => {
    const btn = document.createElement('button');
    $(btn)
      .attr('id', option.id)
      .text(option.text);
    $(btn).prop('disabled', true);
    $(btn).css({
      type: 'button',
      display: 'inline-block',
      width: '100%',
      height: '100px',
      margin: '0.3em  auto',
      fontSize: '30px',
      color: 'white',
      backgroundColor: button.bgcolor.off,
    });
    return btn;
  };

  // ボタンをアクティブにする処理
  const changeButton = btn => {
    $(btn).prop('disabled', false);
    $(btn).css('backgroundColor', button.bgcolor.on);
    return btn;
  };

  // 出勤ボタンを押したときの処理
  const push_start_btn = arg => {
    // 現在時間
    const now = moment().format('HH:mm');
    if (!window.confirm('出勤時刻：' + now + 'で登録しますか？')) {
      return;
    }
    const params = {
      app: arg.data.appId,
    };
    kintone.api(
      kintone.api.url('/k/v1/record'),
      'POST',
      params,
      successfunc,
      errorfunc
    );
  };

  // 退勤ボタンを押したときの処理
  const push_end_btn = function(arg) {
    // 現在時間
    const now = moment().format('HH:mm');
    if (!window.confirm('退勤時刻：' + now + 'で登録しますか？')) {
      return;
    }
    const params = {
      app: arg.data.appId,
      id: arg.data.Id,
      record: {
        退勤時間: {
          value: now,
        },
        状況: {
          value: '退勤',
        },
      },
    };
    kintone.api(
      kintone.api.url('/k/v1/record'),
      'PUT',
      params,
      successfunc,
      errorfunc
    );
  };

  // レコード一覧表示イベント
  kintone.events.on('mobile.app.record.index.show', event => {
    let startButton = makeButton(button.start);
    let endButton = makeButton(button.end);
    // レコード上部へボタンを表示
    const space = kintone.mobile.app.getHeaderSpaceElement();
    space.append(startButton);
    space.append(endButton);

    const body = {
      app: event.appId,
      query: '作成者 in (LOGINUSER()) and 作成日時 = TODAY()',
    };
    // 同じ作成者で同じ作成日のレコードがあるか確認
    kintone.api(
      kintone.api.url('/k/v1/records'),
      'GET',
      body,
      rsp => {
        // もしレコードがあったら、退勤時間の有無を確認
        if (rsp.records.length === 1) {
          // 退勤時間の値がなかったら退勤ボタンを押せるようにする
          if (!rsp.records[0]['退勤時間'].value) {
            endButton = changeButton(endButton);
            $(endButton).on(
              'click',
              { appId: event.appId, Id: rsp.records[0].レコード番号.value },
              push_end_btn
            );
          }
        } else if (rsp.records.length > 1) {
          window.alert(
            '今日のレコードが複数あります。1日1レコードとなるよう修正してください。'
          );
          // もしレコードがなければ、出勤ボタンを押せるようにする
        } else {
          startButton = changeButton(startButton);
          $(startButton).on('click', { appId: event.appId }, push_start_btn);
        }
      },
      errorfunc
    );
  });

  // 標準のレコード追加画面でのレコード保存時
  kintone.events.on('mobile.app.record.create.submit', event => {
    return new kintone.Promise((resolve, reject) => {
      const body = {
        app: event.appId,
        query: '作成者 in (LOGINUSER()) and 作成日時 = TODAY()',
      };
      // 同じ作成者で同じ作成日のレコードがあるか確認
      kintone.api(kintone.api.url('/k/v1/records'), 'GET', body, resp => {
        if (resp.records.length) {
          event.error = '既に今日のレコードが登録されています！';
        }
        resolve(event);
      });
    }).then(evt => {
      return evt;
    });
  });

  // 標準のレコード編集時の編集権限剥奪
  kintone.events.on('mobile.app.record.edit.show', event => {
    event.record['出勤時間'].disabled = true;
    if (event.record['退勤時間'].value) {
      event.record['退勤時間'].disabled = true;
    }
    return event;
  });
})(jQuery);
