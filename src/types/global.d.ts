import { BrowserWindow } from 'electron';
import { ChatClient } from 'dank-twitch-irc';

declare global {
  namespace electron {
    var mainWindow: BrowserWindow;
    var seList: string[];
    var twitchChat: ChatClient;
    var socket: WebSocket;
  }
  namespace config {
    /** 掲示板URL */
    var url: string;
    /** 開始レス番号 */
    var resNumber: string;
    /** 初期表示テキスト */
    var initMessage: string;
    /** ポート番号 */
    var port: number;
    /** 表示レス数 */
    var dispNumber: number;
    /** 更新間隔 */
    var interval: number;
    /** Youtube チャンネルURL */
    var youtubeUrl: string;
    /** Twitch ユーザ名 */
    var twitchUser: string;
    /**
     * レス表示順序
     * - true: 新着が上
     * - false: 新着が下
     */
    var dispSort: boolean;
    /**
     * 名前と本文を改行で分ける
     * - true: 分ける
     * - false: 分けない
     */
    var newLine: boolean;
    /** レス番表示 */
    var showNumber: boolean;
    /** 名前表示 */
    var showName: boolean;
    /** 時刻表示 */
    var showTime: boolean;
    /** 自動改行 */
    var wordBreak: boolean;
    /** レス着信音のパス */
    var sePath: string;
    /** レス着信音再生 */
    var playSe: boolean;
  }
}

export {};
