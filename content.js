(function() {
  if (window.__mikaExtActive) return;
  window.__mikaExtActive = true;

  // 記録を保持する配列
  let recordData = [];

  function checkResult() {
    // 終了フラグが立ったかを検知
    if (!(window.MIKA_practice_end_flag || window.MIKA_type_end_flag)) return;

    const daken = window.MIKA_type_count;
    const sokudo = window.MIKA_type_speed || window.MIKA_type_speed2;
    const miss = window.MIKA_type_err_count;

    if (daken == undefined || sokudo == undefined || miss == undefined) return;

    const d = String(daken);
    const s = typeof sokudo === 'number' ? sokudo.toFixed(1) : String(sokudo);
    const m = String(miss);

    const last = recordData[recordData.length - 1];

    // 打鍵数 0 or 速度 0.0 の時、記録をスキップ
    if(d == 0 || s == 0) return;

    // 重複記録を防ぐ
    if (last && last.d == d && last.s == s && last.m == m) return;

    recordData.push({ d, s, m });

    // TSV形式に変換してクリップボードにコピー
    const tsv = recordData.map(x => `${x.d}\t${x.s}\t${x.m}`).join('\n');
    navigator.clipboard.writeText(tsv).then(() => {
      console.log(`%c【拡張機能】第${recordData.length}回記録完了: 打鍵数=${d}, 速度=${s}, ミス=${m}`, "color: green; font-weight: bold;");
    });
  }

  // 0.5秒ごとに画面の状態を監視
  setInterval(checkResult, 500);
  console.log("%c[美佳タイプ 自動記録] 拡張機能が有効になりました。", "color: blue; font-weight: bold;");
})();