
配置实现 
========
  src/configservice.js
  一套代码，启动指定 roleconf，启用不同功能
  统一的配置服务，使用redis 统一管理配置,控制程序运行
  进程以配置文件提供名字 role 统一标示
  所有服务器提供配置
  lsave file -- 储存到本地文件
  nsave host port --- 到配置redis服务器
  lload file   -- 重新加载
  nload host port key



  
