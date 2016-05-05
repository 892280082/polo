/**
* @desc 创建文件夹工具
*/
var fs = require('fs');
var then = require('yqthen');

//检查和设置目录
exports.checkAndSetDir = (path,callback)=>{
	//检查文件目录是否存在	
	then((next)=>{
		fs.exists(path,(result)=>{
			if(!result)
				return next();
			fs.lstat(path,(err,state)=>{
				if(err)
					return next(err);
				if(state.isDirectory()){
					return callback(null,'目录已存在');
				}
				next();
			});
		});
	}).then((next)=>{
		fs.mkdir(path,(err)=>{
			callback(err);
		});
	}).fail((next,err)=>{
		console.log("ERROR:"+path+"目录创建失败",err);
		callback(err);
	});
};

exports.createPaths = function(params,callback){
	if(!(params instanceof Array)){
		params = [params];
	}
	then.each(params,(next,path)=>{
		exports.checkAndSetDir(path,(err)=>{
			next(err,path);				
		});
	}).then((next)=>{
		callback();
	}).fail((next,err,path)=>{
		console.log("ERROR:"+path+"目录创建失败",err);
		callback(err);
	});
};

// exports.createPaths(["E:/upload23","E:/upload24","E:/upload25"],(err)=>{
// 	console.log(err);
// });

