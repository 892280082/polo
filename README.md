# polo
1.基础的curd和分页插件已经配置成功。 


2.接下来的任务
1.重写app.js文件，重构代码。//OK
2.重构app_config 文件 //OK
3.在app_config 文件中把路由分离出来。//OK
5.约定中间件使用方法 middleware_varName,这里的varName为中间件获取的变量，并讲该变量复制到res.locals上 //OK
6.编写console.$log方法，该方法会讲错误写入到日志中去 //OK
7.编写文件生成脚本，检测如果上传目录不存在则生成上传目录文件夹 /update/video-images-files  还有检测日志文件夹//OK
8.编写res.$json 中间件,$json(err,data)=> res.json({err:err,data:data})
如果$json(err,,5)=> {err:err,data:result,code:5} //OK
