var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = new Schema({
	fileName:String,//文件名
	api:String,//报错API
    content:String,//报错内容
    creatTime:{type:Date,default:Date.now}//日志创建日期
});

var Log;

var _consoleLog = function(fileName,api,err){
	console.log('###############################################################################');
	console.log("报错文件:"+fileName);
	console.log("报错API:"+api);
	console.log("报错内容:"+err);
	console.log('###############################################################################');
};

function FileLogEntity(fileName){
	this.fileName = fileName;
}

FileLogEntity.prototype.save = function(api,err){
		_consoleLog(this.fileName,api,err);

		if(!Log){
			console.$log(1,"日志保存错误:未链接数据库-->"+api);
			return;
		}

		Log.create({
			fileName:this.fileName,
			api:api,
			content:err
		},(err)=>{
			if(err){
				console.$log(2,"日志保存错误");
			}
		});
};

//初始化
var init = function(collectName){
	Log = mongoose.model('collectName', logSchema);
};

var setFileName = function(fileName){
	setTimeout(()=>{
		if(!Log){
			return console.$log(1,"没有配置mongodb.logCollect的集合名,或者mongoose配置失败,日志将不能使用");
		}
	},1000);
	var logUtil =  new FileLogEntity(fileName);
	return logUtil;
};

setFileName.init = init;

module.exports = setFileName;

