var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = new Schema({
	fileName:String,
	api:String,
    content:String,
    creatTime:{type:Date,default:Date.now}
});

var Log;

var _consoleLog = function(fileName,api,err){
		console.log("报错文件:"+fileName);
		console.log("报错日志:"+api);
		console.log("报错内容:"+err);
};

function FileLogEntity(fileName){
	this.fileName = fileName;
	this.save = function(api,err){
		_consoleLog(this.fileName,api,err);
		Log.create({
			fileName:this.fileName,
			api:api,
			content:err
		},(err)=>{
			if(err){
				console.log("SYSTEM_ERROR:---->:日志保存错误");
			}
		});
	};
}

//初始化
var init = function(collectName){
	Log = mongoose.model('collectName', logSchema);
};

var setFileName = function(fileName){
	if(!Log){
		console.log("SYSTEM_ERROR---->:没有配置mongodb.logCollect的集合名,或者mongoose配置失败");
		return;
	}

	return new FileLogEntity(fileName);
};

setFileName.init = init;

module.exports = setFileName;


console.constructor.prototype.$log = function(code,err){
	var args = Array.prototype.slice.call(arguments);
	var code = args.shift();

	switch(code)
	{
		case 0: args.unshift("SYSTEM_LOG---->");break;
		case 1: args.unshift("SYSTEM_WARN---->");break;
		case 2: args.unshift("SYSTEM_ERROR---->");break;
	}
	this.log.apply(console,args);
};



