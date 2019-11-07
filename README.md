# unacast
掲示板のレスをYoutubeコメント風に表示したいという思想の元に開発されるツール

マニュアルは後で作ります・・・

##使い方(windows版)：

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

あとmac版はmacないので動作確認できてないです。
