export const electronEvent = {
  /** サーバー起動 */
  START_SERVER: 'start-server',
  /** サーバー停止 */
  STOP_SERVER: 'stop-server',
  /** Config適用 */
  APPLY_CONFIG: 'apply-config',

  /** アラート表示 */
  SHOW_ALERT: 'show-alert',

  SAVE_CONFIG: 'save-config',

  /** 棒読み再生 */
  PLAY_TAMIYASU: 'play-tamiyasu',
  /** レス着信音再生 */
  PLAY_SOUND_START: 'play-sound-start',
  PLAY_SOUND_END: 'play-sound-end',

  WAIT_YOMIKO_TIME: 'wait-yomiko-time',
  SPEAKING_END: 'speaking-end',

  /** コメント表示 */
  SHOW_COMMENT: 'show-comment',
  /** コメント欄初期化 */
  CLEAR_COMMENT: 'clear-comment',

  /** サーバー起動の返信 */
  START_SERVER_REPLY: 'start-server-reply',

  /** 強制的に端にスクロール */
  FORCE_SCROLL: 'FORCE_SCROLL',

  /** ステータス更新 */
  UPDATE_STATUS: 'UPDATE_STATUS',
};
