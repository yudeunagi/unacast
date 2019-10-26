
exports.startServer = function(http){
  var server = http.createServer(function(req,res) {
    //ヘッダ設定
    res.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});
    res.write('<html><body>ここにレスだしたい</body></html>');
    res.end();

  });

  server.listen(3000);
  console.log('サーバーを起動しました');
}
