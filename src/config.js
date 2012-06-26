



//process.env.NODE_ENV='development'
app.configure('development', function(){
  app.set('clearTimeOutUser',1000*60);

  app.set('mongodb',{ db: 'test', host:'localhost',port:35050 })
  app.set('sessionredis',{ host:'localhost',port:53000})
  //配置server,使用redis
  app.set('confserver', {host:'127.0.0.1',port:53006});
  app.set('host', '192.168.1.50');
  app.set('port', 8880);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.set('confserver', {host:'127.0.0.1',port:53006});
  app.set('sessionredis',{ host:'localhost',port:53000})
  app.set('mongodb',{ db: 'test', host:'localhost',port:35050 })
  app.set('clearTimeOutUser',1000*15*60);

  app.set('host', 'chat.playcrab.com');
  app.set('port', 8880);
  app.use(express.errorHandler()); 
});


