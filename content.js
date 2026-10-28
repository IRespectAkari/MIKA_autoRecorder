(function() {
  if (window.__mikaExtActive) return;
  window.__mikaExtActive = true;

  // 記録を保持する配列
  let recordData = [];

  // ==========================================
  // 画面上に表示する通知パネル・リセットボタンの作成
  // ==========================================
  const panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.bottom = '20px';
  panel.style.right = '20px';
  panel.style.padding = '15px';
  panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  panel.style.color = '#fff';
  panel.style.borderRadius = '8px';
  panel.style.zIndex = '9999';
  panel.style.fontFamily = 'sans-serif';
  panel.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
  panel.style.textAlign = 'center';

  const statusText = document.createElement('div');
  statusText.innerText = '✅ 自動記録：待機中...';
  statusText.style.marginBottom = '10px';
  statusText.style.fontWeight = 'bold';
  statusText.style.fontSize = '14px';

  const resetBtn = document.createElement('button');
  resetBtn.innerText = '🔄 記録をリセット';
  resetBtn.style.padding = '6px 12px';
  resetBtn.style.cursor = 'pointer';
  resetBtn.style.border = 'none';
  resetBtn.style.borderRadius = '4px';
  resetBtn.style.backgroundColor = '#e74c3c';
  resetBtn.style.color = 'white';
  resetBtn.style.fontWeight = 'bold';

  // リセットボタンが押された時の処理
  resetBtn.onclick = () => {
    recordData = [];
    statusText.innerText = '🔄 リセット済（次が第1回）';
    statusText.style.color = '#f1c40f'; // 黄色でリセットを強調
  };

  panel.appendChild(statusText);
  panel.appendChild(resetBtn);
  document.body.appendChild(panel);


  // ==========================================
  // 記録の自動取得処理
  // ==========================================
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

    // 重複記録を防ぐ
    if (last && last.d == d && last.s == s && last.m == m) return;

    recordData.push({ d, s, m });

    // TSV形式に変換してクリップボードにコピー
    const tsv = recordData.map(x => `${x.d}\t${x.s}\t${x.m}`).join('\n');
    navigator.clipboard.writeText(tsv).then(() => {
      // パネルのテキストを更新
      statusText.innerText = `📋 第${recordData.length}回 記録完了！（コピー済）`;
      statusText.style.color = '#2ecc71'; // 成功時は緑色
      console.log(`【拡張機能】第${recordData.length}回記録完了: 打鍵数=${d}, 速度=${s}, ミス=${m}`);
    });
  }

  // 0.5秒ごとに画面の状態を監視
  setInterval(checkResult, 500);
})();