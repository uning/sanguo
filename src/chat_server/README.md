node-chat -  游戏聊天服务器
----------------------------


      目使用单服务器实现，支持群聊，一对一，一对多方式聊天
    使用socket.io实现,暂时没有实现多服务器通信功能
    提供js，flash,c++客户端





系统设计
---------------

### *聊天功能*
      socket.io作为协议底层，支持websocket，socket，jsonpolling
    json 数据传输格式,socket flash policy 文件在10843端口提供
    所有通信包都以事件方式处理,服务器端和客户端保持高度一致
    目前事件包括:处理连接的connection,disconnect,reconnect,reconnect\_error
 
  
    建立连接分两个阶段
    1. handeshake :
       使用http，提供用户名密码或login token (php后台生成的cid),用户昵称等信息
    2. 建立长连接 :
       正常handshake之后，客户端可以发起长连接
       进入msg处理循环
       服务器维护 在线用户列表，在线好友列表,群在线用户数据

   
+   _服务器产生事件(客户端处理)_
      * 用户上线: login     -- {n:'username',id:'userid'}
      *	消息事件: message   -- {\_fn:'发送者名字','\_fid':'发送者id',\_t:'发送时间',t:'//消息类型',c:'//消息内容'}
	  * 封禁    : ban       -- 封禁用户，别重连
+   _客服端产生事件_
      * 查询用户: online    -- {ids:'id列表'}   REPLY -- {id:1 //1 --在线， 0 - 不在线}
	  * 消息事情: message   -- {t:type,to:toids,c:'//消息内容'} 
	  * 最近消息：recentm   -- 获取该用户最近收到的消息列表 REPLY {msgs://msg 数组 } //



###  跨聊天服务器通信
     根据用户登录到不同分区，每个区在 redis 设立一个 分区公共 pubsub channel
	 对不住本服务器的用户，发送到该channel，对应处理
	 




### *消息定义*

client 发送

```

    {
	 to: [],   //接收者id列表, 几个特殊的 all --所有 
	 t: 1,     //消息类型 1 -世界聊天，2- 公会聊天，3 系统，4 系统通知，默认0 玩家一对一或1对多聊天
	 c:        // 消息内容        
    }

```

服务器转发后:

```

    {
	 _fid:     //发送者id
	 _fn:      //发送者名称
	 _t:       //发送时间
	 t: 1,     //消息类型 1 -世界聊天，2- 公会聊天，3 系统，4 系统通知，默认0 玩家一对一或1对多聊天
	 c:       // 消息内容(可以是json结构，后台原封不动转发)        
    }

```

 

### *管理功能*

*   [在线用户列表](/admin/useronline)
*	[封禁用户](/admin/banuser)
*	[设置通知](/admin/sysnotice)
*	.....





<br/>


客户端示例
----------

* [js浏览器端](/socket.io/socket.io.js),使用 websocket 或者 flashsocket,[示例页面](/chat)


```
			socket = io.connect()
			socket.on('reconnect', function (e) {
				//$('#chat-messages').remove();
				message('System', 'Reconnected to the server');
				console.log(e)
			});

			socket.on('reconnecting', function () {
				message('System', 'Attempting to re-connect to the server');
			});

			socket.on('error', function (e) {
				message('System', e ? e : 'A unknown error occurred');
				console.log(e)
			});
			socket.on('login', function (e) {
				message('server-login',  JSON.stringify(e));
				console.log(e)
			});
			socket.on('offline', function (e) {
				message('server-offline',  JSON.stringify(e));
				console.log(e)
			});

			socket.on('connect', function(){
				//socket.send(jsonMsg)
				// set ui state
				$('.connection-state').html('Connected to chat server!');
				message('System', 'Connected to chat server!');
				toggleMessageBox('active');
			});

			socket.on('disconnect', function() {
				toggleMessageBox('inactive');
				$('.connection-state').html('Connection to chat server lost, retrying...');        
				socket = io.connect();
			});

			socket.on('connect_failed', function(e) {
				message('System', e ? e : ' connect_failed Connection to chat server failed');
			});

            //消息事件
			socket.on('message', function(data){
				console.log('on message',data);
				message('received message',JSON.stringify(data))
				message(data._fn ,JSON.stringify(data.c))
			});

			
					var jsonMsg = {
						c : msg
						,to: touids
					};
					//发送消息
					//socket.send(JSON.stringify(jsonMsg));
					socket.emit('message',jsonMsg);
```
