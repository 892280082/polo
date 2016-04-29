/**
* @desc 创建文件夹助手
*
*/
var fs = require('fs');
var then = require('thenjs');
var app_config = require('../conf/app_config');

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

	var thenObj = then2((next)=>{ next();});

	params.forEach((path)=>{
		thenObj.then((next)=>{
			exports.checkAndSetDir(path,(err)=>{
				next(err,path);				
			});
		});
	});

	thenObj.then((next)=>{
		callback(null);
	}).fail((next,err,path)=>{
		console.log("ERROR:"+path+"目录创建失败",err);
		callback(err);
	});
};


exports.createPaths(["E:/upload23","E:/upload24","E:/upload25"],(err)=>{
	console.log(err);
});


//模拟thenjs
function ThenEntity(){
	this._arrayFuncs = [];
	this._errorFuncs = [];
	this._funcProgress = [];
	this._arrayIndex = 0;
	this._errorIndex = 0;
	this.start = function(func){

		var _this = this;
		_this._arrayFuncs.push(func);
		setTimeout(function(){
			_this._arrayFuncs[_this._arrayIndex++](_this.defer);
		},0);

	}.bind(this);
	this.defer = function(err){

		var nextFunc;
		if(err){
			nextFunc = this._errorFuncs[this._errorIndex++];
		}else{
		 	nextFunc = this._arrayFuncs[this._arrayIndex++];
		}

		if(nextFunc)
			nextFunc(this.defer);

	}.bind(this);
	
	this.then=function(func){
		this._arrayFuncs.push(func);
		return this;
	}.bind(this);

	this.fail=function(func){
		this._funcProgress.push(this._arrayFuncs.length+1);
		this._errorFuncs.push(func);
		return this;
	};
}

function then2(func){
	var then = new ThenEntity();
	then.start(func);
	return then;
}