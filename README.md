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

### 3.OBS取り込み
4-2. ブラウザで「http://localhost:3000/」と入力してちゃんと表示されることを確認します
　　（この手順はちゃんと起動できているかの確認なので飛ばしてもOK）
5. OBSでブラウザソースを追加して各種項目を設定します（下記参照）
　・URL：http://localhost:3000/
　・幅：配信の解像度の1/4から1/3ぐらい（1280x720の配信なら300～400ぐらいをお好みで）
　・高さ：配信の解像度と同じ（1280x720の配信ならそのまま720）
　・FPS：30のままでOK
　・カスタムCSS：デフォで入っているものは消しておく。好みで記述しても良い
　　　　　　　　　（esources/app/public/css/style-server.css の記載を参考にいじってみてね！！）
         
多分これで表示できるはず。
終了するときは停止ボタン押してから終了しても、停止せずにアプリ直接落としても大丈夫。
あとアンインストールもフォルダごと削除でOK

動かないとかあったらIssuesかもしくは Twitter で @yudeunagi まで

あとmac版はmacないので動作確認できてないです。
