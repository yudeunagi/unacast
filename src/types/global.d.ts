import { BrowserWindow } from 'electron';
import { ChatClient } from 'dank-twitch-irc';
import { LiveChat } from '../main/youtube-chat';

declare global {
  namespace electron {
    let mainWindow: BrowserWindow;
    let chatWindow: BrowserWindow;
    /** SEファイルリスト */
    let seList: string[];
    /** Twitchチャットインスタンス */
    let twitchChat: ChatClient;
    /** Youtubeチャットインスタンス */
    let youtubeChat: LiveChat;
    /** 掲示板の読み込み済みのレス番号 */
    let threadNumber: number;
    /** 掲示板との連続通信エラー回数 */
    let threadConnectionError: number;
    /** コメントの処理待ちリスト */
    let commentQueueList: UserComment[];
  }
  namespace config {
    /** 掲示板URL */
    let url: string;
    /** 開始レス番号 */
    let resNumber: string;
    /** 初期表示テキスト */
    let initMessage: string;
    /** ポート番号 */
    let port: number;
    /** 表示レス数 */
    let dispNumber: number;
    /** 更新間隔 */
    let interval: number;
    /** Youtube チャンネルID */
    let youtubeId: string;
    /** Twitch ユーザID */
    let twitchId: string;
    /**
     * レス表示順序
     * - true: 新着が下
     * - false: 新着が上
     */
    let dispSort: boolean;
    /**
     * 名前と本文を改行で分ける
     * - true: 分ける
     * - false: 分けない
     */
    let newLine: boolean;
    /** アイコン表示 */
    let showIcon: boolean;
    /** レス番表示 */
    let showNumber: boolean;
    /** 名前表示 */
    let showName: boolean;
    /** 時刻表示 */
    let showTime: boolean;
    /** 自動改行 */
    let wordBreak: boolean;
    /** レス着信音のパス */
    let sePath: string;
    /** レス着信音再生 */
    let playSe: boolean;
    /** レス着信音音量 */
    let playSeVolume: number;
    /** 読み子の種類 */
    let typeYomiko: 'none' | 'tamiyasu' | 'bouyomi';
    /** 民安Talkのファイルパス */
    let tamiyasuPath: string;
    /** 棒読みちゃんの待ち受けポート */
    let bouyomiPort: number;
    /** 棒読みちゃんの音量 */
    let bouyomiVolume: number;
    /** スレが通信エラーになった時の通知閾値 */
    let notifyThreadConnectionErrorLimit: number;
    /** スレのレス数が超えた時の通知 */
    let notifyThreadResLimit: number;
    /**
     * レスの処理方法
     * - 0: 新着を優先
     * - 1: 1個ずつ順に処理
     */
    let commentProcessType: 0 | 1;
    /**
     * コメント表示方法
     * - 0: チャット風
     * - 1: SpeechCast風
     */
    let dispType: 0 | 1;
  }
}

export {};
