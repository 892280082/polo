/**
 * @desc app实例配置
 * @auther yq
 * @date 2016/2/22
 */
var express = require('express');
var	path = require('path');
var	logger = require('morgan');
var	cookieParser = require('cookie-parser');
var	bodyParser = require('body-parser');
var	ejs = require('ejs');
var	config = require('./conf/app_config');
var	session = require('express-session');
var	MongoStore = require('connect-mongo')(session);
var	mongoose = require('mongoose');
var	router = require('./middleware/middleWare');
var	ejsExtend = require('./util/ejsExtend');
var routerConfig = require('./conf/router_config');
var dirUtil = require('./util/dirUtil');
var logUtil = require('./util/logUtil');
var	app = express();

/**配置提示*/
console.constructor.prototype.$log = function(code,err){
	var args = Array.prototype.slice.call(arguments);
	var tempCode = args.shift();
	switch(tempCode)
	{
		case 0: args.unshift("SYSTEM_LOG---->");break;
		case 1: args.unshift("SYSTEM_WARN---->");break;
		case 2: args.unshift("SYSTEM_ERROR---->");break;
	}
	this.log.apply(console,args);
};

//加载配置文件
app.set("app_config",config);//app主要配置参数
app.set("404page");//404页面路径
app.set('500page');//500页面路径
app.set('isWindow');//判断系统
app.set('isLinux');
app.set('upload_file');//上传文件夹路径
app.set('configRoute');//路由配置
app.set('env');//开发模式

/**
 * @desc 配置开发模式和日志
 */
if(config.main.model){
	app.set('env','development');
}else{
	app.set('env','product');
}

/**
 * 处理日志
 */
app.use(logger('dev'));

/**
 * @desc 配置渲染模板和静态资源文件夹
 * 		 这里将views和public文件夹都进行公开,
 * 		 但是views目录下将限制视图后缀文件的访问
 */
var viewConfig = config.view;
if(viewConfig.engine == 'ejs'){
	app.engine('.html', ejs.__express);
	app.set('views', path.join(__dirname, viewConfig.relativePath));
	app.set('view engine', viewConfig.extName);
	app.set('404page',viewConfig.notFoundPage);
	app.set('500page',viewConfig.errPage);
}else{
	console.$log(2,"配置错误:目前仅支持ejs");
}
var pathReg = new RegExp("."+viewConfig.extName);
app.use(function(req,res,next){
	if(pathReg.test(req.path.split("?")[0])){
		res.redirect('/404.html');
	}else{
		next();
	}
});
app.use(express.static(viewConfig.relativePath));

//判断操作系统
var system = process.platform;
if(config.main.debug)
	console.$log(0,'当前系统:',system);
if(system.indexOf('win32') >-1 || system.indexOf('win64') >-1) {
	app.set('isWindow',true);
}else{
	app.set('isLinux',true);
}

/**
 * @desc 配置文件上传路径
 */
function getResovlePath(){
	var path;
	if(app.get('isWindow')){ //判断是window系统
		path = config.main.winUploadDir;
	}else{ //如果是Linux或者mac
		path =  config.main.uploadDir;
		if (path.indexOf('/') !== 0){
			path = path.join(__dirname, path);
		}
	}
	if(path){ //如果设置了path路径 则创建path文件夹目录
		dirUtil.createPaths([path,path+'/images',path+'/file',path+'/video'],(err)=>{
			if(err)
				console.$log(2,"上传目录设置失败");
		});
	}
	if(config.main.debug)
		console.$log(0,"文件上传地址:"+path);
	return path;
}
app.set('upload_file',getResovlePath());

/**
 * @desc 配置解析request的中间件
 */
app.use(bodyParser.json());//解析json
app.use(bodyParser.urlencoded({ extended: false }));//解析resful参数
app.use(cookieParser());//解析cookie

/**
 * @desc 配置数据库和session
 */
if(config.mongodb.open) {
	var dataOpenDebug  = (err)=>{
		if(err){
			console.$log(2,"数据库连接错误:",err);
		}else{
			var logCollect = config.mongodb.logCollect;
			if(logCollect){
				logUtil.init(logCollect);
			}
			if (config.main.debug) {
				console.$log(0,"mongoose:数据库连接成功");
			}
		}

	};
	var mongoUrl = 'mongodb://' + config.mongodb.host + ":" +
		(config.mongodb.port || 27017) + "/" + config.mongodb.db;

	if(config.main.debug)
		console.log(0,"数据库连接地址: " + mongoUrl);

	var  mongooseDb = mongoose.connect(mongoUrl);
	mongooseDb.connection.on('open', function (err) {
		dataOpenDebug(err);
	});
	mongooseDb.connection.on('error', function (err) {
		dataOpenDebug(err);
	});
	app.use(session({ //配置mongodb为session容器
		resave: false,
		saveUninitialized: true,
		secret:config.mongodb.cookieSecret,
		key:config.mongodb.db,
		cookie:{ secure:false,maxAge:config.mongodb.sessionMaxAge},
		store:new MongoStore({
			db:config.mongodb.db,
			host:config.mongodb.host,
			port:config.mongodb.port
		})
	}));
}

//配置路由
app.use(ejsExtend.extend); //配置EJS扩展
app.set("configRoute",routerConfig);
router(app);

/**
 * @desc 启动http服务
 */
var appPort = config.main.port;
app.listen(appPort,function(err){
	if(err){
		console.log(2,"express 启动失败:",err);
	}else{
		console.log(0,"http 服务已启动，端口:"+appPort);
	}
});

//提供对外接口,给第三方插件调用
module.exports = app;
