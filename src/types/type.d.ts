type UserComment = {
  /** レス番号 */
  number?: string;
  /** 名前 */
  name: string;
  /** 日付 */
  date?: string;
  /** コメント */
  text: string;
  /** アイコン画像 */
  imgUrl: string;
  threadTitle?: string;
  id?: string;
  email?: string;
  from: 'system' | 'bbs' | 'youtube' | 'twitch' | 'niconico' | 'jpnkn';
};

type CommentSocketMessage = {
  type: 'add' | 'reset';
  message: string;
};
