import { EventEmitter } from 'events';
import axios from 'axios';
import { actionToRenderer, CommentItem, parseData } from './parser';
import { sleep } from '../util';

type LiveChatResponse = [
  {
    page: string;
    csn: string;
  },
  {
    url: string;
    response: {
      responseContext: any;
      contents: {
        liveChatRenderer: {
          actions: Action[];
        };
      };
    };
    timing: any;
    page: string;
    endpoint: string;
    csn: string;
    xsrf_token: string;
  },
];

/**
 * YouTubeライブチャット取得イベント
 */
export class LiveChat extends EventEmitter {
  private static readonly headers = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36' };
  public readonly channelId?: string;
  public liveId?: string;
  private id = '';
  private observer?: NodeJS.Timeout;
  private isStop = false;

  constructor(options: { channelId: string } | { liveId: string }, private interval = 1000) {
    super();
    if ('channelId' in options) {
      this.channelId = options.channelId;
    } else if ('liveId' in options) {
      this.liveId = options.liveId;
    } else {
      throw TypeError('Required channelId or liveId.');
    }
  }

  public start() {
    this.isStop = false;
    this.fetchLiveId();
  }

  private async fetchLiveId() {
    if (this.isStop) return;
    if (this.channelId) {
      const url = `https://www.youtube.com/channel/${this.channelId}/live`;
      try {
        const liveRes = await axios.get(url, { headers: LiveChat.headers });
        //   if (liveRes.data.match(/LIVE_STREAM_OFFLINE/)) {
        //     this.emit('error', new Error('Live stream offline'));
        //     return false;
        //   }
        this.liveId = liveRes.data.match(/videoId\\":\\"(.+?)\\/)?.[1] as string;
      } catch (e) {
        // チャンネルID自体が違うのはもうどうしようもないので止める
        this.emit('error', new Error(`connection error url = ${url}`));
        return;
      }
    }

    if (this.liveId) {
      this.observer = setInterval(() => this.fetchChat(), this.interval);
      this.emit('start', this.liveId);
    } else {
      // 配信が開始してないパターンが考えられるのでリトライ
      this.emit('error', new Error('Live stream not found'));
      await sleep(2000);
      this.fetchLiveId();
    }
  }

  public stop(reason?: string) {
    this.isStop = true;
    if (this.observer) {
      clearInterval(this.observer);
      this.emit('end', reason);
    }
    this.id = '';
  }

  private async fetchChat() {
    const url = `https://www.youtube.com/live_chat?v=${this.liveId}&pbj=1`;
    try {
      const res = await axios.get<LiveChatResponse>(url, { headers: LiveChat.headers });
      // if (res.data[1].response.contents.messageRenderer) {
      //   this.stop('Live stream is finished');
      //   return;
      // }

      // 前回取得したidより新しいチャットを取得する
      // actions配列の末尾は入室メッセージみたいなやつなので除外する
      const temp = res.data[1].response.contents.liveChatRenderer.actions.slice(0, -1).filter((v: Action) => {
        const messageRenderer = actionToRenderer(v);
        return messageRenderer !== null && messageRenderer;
      });
      const lastIndex = temp.findIndex((v) => {
        const messageRenderer = actionToRenderer(v);
        return messageRenderer?.id === this.id;
      });
      const items = temp.filter((v, i) => i > lastIndex).map((v: Action) => parseData(v));

      // 初回取得の場合は初期データとして出力
      items.forEach((v) => {
        if (v) {
          if (this.id) {
            this.emit('comment', v);
          } else {
            this.emit('firstComment', v);
          }
        }
      });

      // 末尾のidを取得
      console.log(`[Youtube-chat] items = ${items.length}`);
      if (items.length > 0) {
        const item = items[items.length - 1];
        if (item) this.id = item.id;
      }
    } catch (e) {
      this.emit('error', new Error(`Error occured at fetchchat url=${url}`));
    }
  }

  public on(event: 'firstComment', listener: (comment: CommentItem) => void): this;
  public on(event: 'comment', listener: (comment: CommentItem) => void): this;
  public on(event: 'start', listener: (liveId: string) => void): this;
  public on(event: 'end', listener: (reason?: string) => void): this;
  public on(event: 'error', listener: (err: Error) => void): this;
  public on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }
}
