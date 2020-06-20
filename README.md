# unacast
掲示板のレスをYoutubeコメント風に表示したいという思想の元に開発されるツール

マニュアルは後で作ります・・・

## 使い方(windows版)：

### 1.ソフト起動
![ソフト起動](https://raw.githubusercontent.com/yudeunagi/unacast/develop/documents/help/img/help01.jpg)  
解凍したフォルダ内にある「unacast.exe」を実行してください。

### 2.設定＆サーバー起動
![設定画面](https://raw.githubusercontent.com/yudeunagi/unacast/develop/documents/help/img/help02.jpg)  
1. ポート番号を設定します（特に理由がなければ3000でOK）
1. 読み込みたい板のURLを入力します（最後は"/"で終わるように）
1. 指定のレス番から表示したい場合はレス番を入れます（指定なしだと起動後に書き込まれたレスのみ表示）
1. サーバー起動ボタンを押します

サーバー起動時に以下のようなウィンドウが出たらそのまま「アクセスを許可する」を押してください　　
![OBS設定画面](https://raw.githubusercontent.com/yudeunagi/unacast/develop/documents/help/img/firewall.jpg)  

### 3.OBS取り込み
OBSのソースで「ブラウザソース」を追加し、設定画面を開きます。

![OBS設定画面](https://raw.githubusercontent.com/yudeunagi/unacast/develop/documents/help/img/help03.jpg)  
1. URLは「http://localhost:{上で設定したポート番号}/」と入力してください。（例：http://localhost:3000/）
1. 幅は配信画面サイズの1/3～1/5ぐらいがおすすめ（サイズが 1280x720 なら 320～420ぐらい）
1. 高さは配信画面サイズと同じかちょっと多いぐらい（サイズが 1280x720 なら 720～ぐらい）
1. FPSは30のままでOK
1. カスタムCSSは削除して空欄にしてください（入力して表示をカスタマイズすることもできます、詳しくは後述）

### 4.取り込みイメージ
正常に動作していれば下記画像のようにレスが表示されます。  
![取り込みイメージ](https://raw.githubusercontent.com/yudeunagi/unacast/develop/documents/help/img/help04.jpg)  


終了するときは停止ボタン押してから終了しても、停止せずにアプリ直接落としても大丈夫。
あとアンインストールもフォルダごと削除でOK

動かないとかあったらIssuesかもしくは Twitter で @yudeunagi まで

あとmac版はmacなうて動作確認できないので作れないですごめんなさい。

## レスの表示背景色や文字色を変更したい (OBS側)
![OBS設定画面](https://raw.githubusercontent.com/yudeunagi/unacast/develop/documents/help/img/help03.jpg)  
例として背景の透明度を変更したい場合は、OBSのブラウザソース設定画面のカスタムCSSに以下のように追加してください

  body {  
    background-color: rgba(0, 0, 0, 0.5); /*0.5の部分が透明度指定、0~1の少数で設定でき、0で透明、1で不透明になる*/  
  }  

unpack版の場合は、「unacast-win32-x64\resources\app\public\css\style-server.css」にデフォルトの設定を記載しているので
変更したい箇所をOBSのカスタムCSSにコピペして適当にいじってみてください。ぶっこわれたら全部消せばデフォルトに戻ります。

というか↓に使用しているCSSのリンク載せておくのでここからOBSのカスタムCSSにコピペして適当にいじってみてください。
(https://github.com/yudeunagi/unacast/blob/master/public/css/style-server.css) 

## レスの表示背景色や文字色を変更したい (本アプリ側)
`resources`フォルダに、`style-server.css`ファイルを置いて、その中にCSSを記載してください。
unpack版の場合はOBS側と同じファイルを編集してもOKです。

--- 

## Windowsでビルドしたい人向け
Node.jsとyarnが入ってることが前提
```
git clone https://github.com/pasta04/unacast.git
cd unacast
yarn
yarn buildwin
```

## Todo

* [x] TypeScript化(本体)
* [x] レス着信時のランダムサウンド再生
* [x] Twitch対応
* [x] 本体とviewの接続のWebSocket化
* [x] レスの通信もWebSocketにする
* [x] Youtube対応
* [x] 掲示板取得で通信エラーが繰り返された時の通知
* [ ] TypeScript化(view)
* [x] (やる気があれば)棒読みちゃん
* [x] いらないパッケージを削除する
* [ ] README書き直す
* [ ] 全体的にヤバイコードをなんとかする
