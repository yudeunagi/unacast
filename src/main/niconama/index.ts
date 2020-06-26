/**
 * ニコ生コメント
 */
import { EventEmitter } from 'events';
import axios from 'axios';
import cheerio from 'cheerio';
import log from 'electron-log';
import { sleep } from '../util';
import WebSocket from 'ws';

type CommentItem = {
  number: string;
  name: string;
  comment: string;
};

type NiconamaApiV2DataTypeRoom = {
  isFirst: boolean;
  messageServer: {
    type: string;
    uri: string;
  };
  name: string;
  threadId: string;
  waybackkey: string;
};

type NiconamaApiV2DataTypeAkashic = {
  contentUrl: string;
  logServerUrl: string;
  playId: string;
  playerId: string;
  status: string;
  token: string;
};

type NiconamaCommentThread = {
  thread: {
    last_res: number;
    resultcode: number;
    revision: number;
    server_time: number;
    thread: string;
    ticket: string;
  };
};

type NiconamaCommentChat = {
  chat: {
    anonymity?: number;
    /** チャットコメント */
    content: string;
    /** Dateを数値化したやつ */
    date: number;
    date_usec: number;
    /** 匿名の時は184が入ってる */
    mail?: string;
    /** コメント番号 */
    no: number;
    /** プレミアムなら1 */
    premium?: number;
    score?: number;
    thread: string;
    user_id: string;
    vpos: number;
  };
};

class NiconamaComment extends EventEmitter {
  /** ニコニココミュニティID */
  communityId?: string;
  /** ライブID */
  liveId?: string;
  /** 配信開始待ちのインターバル(ms) */
  liveIdPollingInterval = 5000;
  /** 初期処理のコメントを受信し終わった */
  isFirstCommentReceived = false;
  /** 最新のコメント番号 */
  latestNo = NaN;
  /** コメント取得のWebSocket */
  commentSocket: WebSocket = null as any;

  constructor(options: { communityId: string } | { liveId: string }) {
    super();
    if ('communityId' in options) {
      this.communityId = options.communityId;
    } else if ('liveId' in options) {
      this.liveId = options.liveId;
    } else {
      throw TypeError('Required channelId or liveId.');
    }
  }

  public async start() {
    if (this.communityId) {
      this.pollingFetchLiveId();
    } else {
      this.fetchCommentServerThread();
      this.emit('start', this.liveId);
    }
  }

  /** コミュニティIDを元にLiveIDを取得 */
  private pollingFetchLiveId = async () => {
    log.info('pollingFetchLiveId');
    if (this.liveId) return;

    // ライブIDを取得する
    const url = `https://com.nicovideo.jp/community/${this.communityId}`;
    try {
      const liveRes = await axios.get(url);
      const livetemp = liveRes.data.match(/now_live_inner.*/)[0]?.match(/lv\d+/)[0] ?? '';
      if (livetemp) {
        this.liveId = livetemp;
        this.fetchCommentServerThread();
        this.emit('start', this.liveId);
      } else {
        // 次のポーリング
        await sleep(this.liveIdPollingInterval);
        this.pollingFetchLiveId();
      }
    } catch (e) {
      this.emit('error', new Error(`connection error url = ${url}`));
      return false;
    }
  };

  /** ニコ生のコメントを取得 */
  private fetchCommentServerThread = async () => {
    log.info(`[fetchCommentServerThread] liveId = ${this.liveId}`);
    // ニコ生の配信ページにアクセス
    const url = `https://live2.nicovideo.jp/watch/${this.liveId}`;
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    // 放送情報を取得
    const embeddedData = JSON.parse($('#embedded-data').attr('data-props') ?? '');
    // log.info(JSON.stringify(embeddedData, null, '  '));

    const broadcastId: string = embeddedData.program.broadcastId || embeddedData.program.reliveProgramId;
    const audienceToken: string = embeddedData.player.audienceToken;
    const frontendId: string = embeddedData.site.frontendId;

    // スレッドURLを取得
    const threadWssUrl = `wss://a.live2.nicovideo.jp/unama/wsapi/v2/watch/${broadcastId}?audience_token=${audienceToken}&frontend_id=${frontendId}`;
    log.info(threadWssUrl);
    const tWs = new WebSocket(threadWssUrl);
    tWs.onmessage = (event) => {
      const obj = JSON.parse(event.data.toString());
      // log.info(JSON.stringify(obj, null, '  '));
      log.info(`[fetchCommentServerThread]WS - type: ${obj.type}`);
      switch (obj.type) {
        case 'serverTime': {
          // currentMs
          break;
        }
        case 'seat': {
          // keepIntervalSec
          break;
        }
        case 'stream': {
          // hlsのURLとか
          break;
        }
        case 'room': {
          const data = obj.data as NiconamaApiV2DataTypeRoom;
          this.fetchComment(data.messageServer.uri, data.threadId);
          break;
        }
        case 'statistics': {
          // 視聴者数とか
          break;
        }
        case 'schedule': {
          // 開始、終了時刻
          break;
        }
        case 'akashic': {
          const data = obj.data as NiconamaApiV2DataTypeAkashic;
          break;
        }
        case 'ping': {
          break;
        }
      }
    };
    tWs.on('open', () => {
      tWs.send(
        JSON.stringify({
          type: 'startWatching',
          data: { stream: { quality: 'high', protocol: 'hls', latency: 'low', chasePlay: false }, room: { protocol: 'webSocket', commentable: true }, reconnect: false },
        }),
      );

      tWs.send(JSON.stringify({ type: 'getAkashic', data: { chasePlay: false } }));
    });
  };

  /**
   *
   * @param wsUrl コメントサーバのWebSocket URL
   * @param threadId threadID
   */
  private fetchComment = async (wsUrl: string, threadId: string) => {
    log.info(`[fetchComment] threadId = ${threadId}`);
    const ws = new WebSocket(wsUrl, 'niconama', {
      headers: {
        'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
        'Sec-WebSocket-Protocol': 'msg.nicovideo.jp#json',
      },
    });

    ws.on('message', (event) => {
      const obj = JSON.parse(event.toString());
      // 初回取得時は ping, ping, thread, chat, chat..., ping, pingの順で受け取る

      // log.info(JSON.stringify(obj, null, '  '));

      // コメント番号更新
      if (obj?.chat?.no) {
        this.latestNo = obj.chat.no;
      }

      if (obj?.ping?.content === 'rf:0') {
        this.isFirstCommentReceived = true;
        this.emit('open', { liveId: this.liveId, number: this.latestNo });
      }

      if (!this.isFirstCommentReceived) return;
      const chat = obj as NiconamaCommentChat;

      const comment = chat.chat?.content;
      if (!comment) return;

      // /で始まるのはなんかコマンドなので除外する
      if (comment.match(/^\/[a-z]+ /)) return;

      log.info(`[fetchComment]WS - content: ${comment}`);

      const item: CommentItem = {
        number: chat.chat.no.toString(),
        name: '',
        comment: comment,
      };
      this.emit('comment', item);
    });

    ws.on('error', (event) => {
      log.info('[fetchComment]なんかエラーだ');
      log.info(event);
    });

    ws.on('open', () => {
      log.info('[fetchComment] connected');
      ws.send(
        JSON.stringify([
          { ping: { content: 'rs:0' } },
          { ping: { content: 'ps:0' } },
          // eslint-disable-next-line @typescript-eslint/camelcase
          { thread: { thread: threadId, version: '20061206', user_id: 'guest', res_from: -150, with_global: 1, scores: 1, nicoru: 0 } },
          { ping: { content: 'pf:0' } },
          { ping: { content: 'rf:0' } },
        ]),
      );
    });

    this.commentSocket = ws;
  };

  /** コメント取得の停止 */
  public stop = () => {
    if (this.communityId) {
      this.liveId = '';
    }
    this.isFirstCommentReceived = false;
    this.latestNo = NaN;
    this.commentSocket.close();
  };

  // イベント
  public on(event: 'comment', listener: (comment: CommentItem) => void): this;
  public on(event: 'start', listener: (liveId: string) => void): this;
  public on(event: 'open', listener: (obj: { liveId: string; number: number }) => void): this;
  public on(event: 'end', listener: (reason?: string) => void): this;
  public on(event: 'error', listener: (err: Error) => void): this;
  public on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }
}

export default NiconamaComment;
