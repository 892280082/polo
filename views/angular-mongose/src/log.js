/*!
 * log
 * @auther yq
 * @Copyright(c) 2016 YeQin
 * @MIT Licensed
 * @API

/**
 * 简单封装的打印日志
 * @param  {Number} code 0/1/2 log/warning/error
 * @param  {...}	其余参数由arguments获取	
 */
function __console(code,err){
	var args = Array.prototype.slice.call(arguments);
	var tempCode = args.shift();
	switch(tempCode)
	{
		case 0: args.unshift("SERVICE_MONGOOSE_LOG---->");break;
		case 1: args.unshift("SERVICE_MONGOOSE_WARN---->");break;
		case 2: args.unshift("SERVICE_MONGOOSE_ERROR---->");break;
	}
	console.log.apply(console,args);
}

/**
 * Module exports.
 * @public
 */
module.exports = __console;