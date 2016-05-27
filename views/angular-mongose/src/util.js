/*!
 * mongoose的工具文件
 * @auther yq
 * @Copyright(c) 2016 YeQin
 * @MIT Licensed
 * @API
 * ------------------------------------------------
 * 1.dealQuery 			处理query
 * 2.merge 				合并对象
 * 3.checkSetting		检查设置是否正确
 * 4.getData            获取后台数据
 * 5.analyDate          分析后台的数据		
 * 6.juageAllPage       计算总页数
 * 7.concactArray       合并数组 array1~array2的顺序,返回一个新数组
 * 8.save               保存对象
 * 9.remove             删除数据
 * 10.update            更新数据
 * 11.getSlice          获取指定位置数组
 * 12.arrayRemovePojo   删除数组内元素
 * ------------------------------------------------
 */

/**
 * Module dependencies.
 * @private
 */
var log = require('./log');
var _ = require('./miniunder');


exports.concactArray =  function(array1,array2){
    return array1.concat(array2);
};


/**
 * Module variables.
 * @private
 * @description 处理查询对象
 */
function dealSearchContain (key,val) {
    var conver = function(key,val){
        return {key:key,val:val};
    };

    key = key.replace(/-/g,".");//-转换成.
    var conditions = ['$$_','$gt_','$gte_','$lt_','$lte_','$ne_'];

    var delKey = _.find(conditions,function(ele){
        return key.indexOf(ele) >= 0;
    });

    if(delKey === undefined)
        return conver(key,val);

    if(delKey === '$$_')
        return conver(key.replace(delKey,''),{$regex: val ,$options: 'i'});

    var tempVal = {};
    tempVal[delKey.replace('_','')] = val;
    return conver(key.replace(delKey,''),tempVal);
}

/**
 * @param  {Object} query 查询的实体对象
 * @return {Object} 处理后的对象，mongoose可直接用于query查询的标准对象
 */
exports.dealQuery = function dealQuery(query){
    var tempQuery = {};
    for(var p in query){
        //删除属性
        if(query[p] === ''
            || typeof query[p] === 'undefined'
            || (_.isObject(query[p]) &&  _.keys(query[p]).length <= 0)) {
            continue;
        }

        var result = dealSearchContain(p,query[p]);

        if(_.has(tempQuery,result.key)){ //属性重复 则将val添加入原先的val中
            var oldVal = tempQuery[result.key];
            _.mapObject(result.val,function(val,key){
                oldVal[key] = val;
            });
            continue;
        }

        tempQuery[result.key] = result.val;
    }

    return tempQuery;
};

exports.merge = function(ori,target){
	for(var i in target){
		ori[i] = target[i];		
	}
};			

exports.checkSetting = function(mongoose){
	if(!mongoose.$service.$http)
		log(1,'$http 没有设置');
};

exports.getData = function(mongoose,callback){
	var $http = mongoose.$service.$http;
	var searchInfo = mongoose.$searchInfo;
    var pagingInfo = mongoose.$pagingInfo;

    var tempQuery = {};

    exports.merge(tempQuery,searchInfo.query);
    exports.merge(tempQuery,exports.dealQuery(mongoose.$query));

    var sendPojo = {
        query:tempQuery,
        limit:pagingInfo.pageSize,
        skip:pagingInfo.curPage -1,
        sort:searchInfo.sort,
        populate:searchInfo.populate,
    };

	$http.post(searchInfo.url,sendPojo).success(function(data){
		if(data.err)
			log(1,err);

        exports.analyDate(mongoose,data.result);//分析数据

        if(callback)
	       return callback(data.err,data.result.docs);
       
	}).error(function(data){
		log(2,'后台地址链接失败：'+searchInfo.url);
	});
};

exports.analyDate = function(mongoose,data){
    var $pagingInfo = mongoose.$pagingInfo;

    var waterfull = $pagingInfo.waterfull;

    $pagingInfo.total = data.total;
    $pagingInfo.curPage = data.skip+1;
    $pagingInfo.allPage = exports.juageAllPage(data.limit,data.total);

    var $array = mongoose.$array;

    waterfull ? mongoose.$array = exports.concactArray(mongoose.$array,data.docs) 
              : mongoose.$array = data.docs;
};

exports.juageAllPage = function(pageSzie,total){
    var pageCount =  ~~(total/pageSzie);
    return total%pageSzie ?  pageCount+1 : pageCount;
};


/**
 * Module variables.
 * @description  处理callback问题
 * @private
 */
var dealCallback = function(data,callback,fun1,fun2){
    if(!data.err){
        if(fun1)
            fun1();
        if(callback)
            callback(data.err,data.result);
    }else{
        log(1,'后台curd请求报错:'+data.err);
        if(fun2)
            fun2();
        if(callback)
            callback(data.err,data.result);
    }
};

/**
 * 保存数据
 * @param  {Object}   pojo     保存对象
 * @param  {Function} callback 回调函数
 * @param  {Object}   mongoose Mongoose对象
 */
exports.save = function(pojo,callback,mongoose){
    var url = mongoose.$searchInfo.url+'Save';
    var $http = mongoose.$service.$http;

    $http.post(url,{"savePojo":pojo})
    .success(function(data){

        dealCallback(data,callback,function(){
            mongoose.$setCurPage();
        });

    }).error(function(){
        log(2,'saveUrl:连接出错');
    });
};

/**
 * 删除数据
 * @param  {Object}   pojo     删除的对象
 * @param  {Function} callback 回调函数
 * @param  {Object}   mongoose Mongoose对象
 */
exports.remove = function(pojo,callback,mongoose){
    var url = mongoose.$searchInfo.url+'Remove';
    var $http = mongoose.$service.$http;

    $http.post(url,{_id:pojo._id})
    .success(function(data){
        dealCallback(data,callback,function(){
            mongoose.$setCurPage();
        });
    }).error(function(){
        log(2,'saveUrl:连接出错');
    });
    
};

/**
 * 更新数据
 * @param  {Object}   pojo     更新对象
 * @param  {Function} callback 回调函数
 * @param  {Object}   mongoose Mongoose对象
 */
exports.update = function(pojo,callback,mongoose){
    var url = mongoose.$searchInfo.url+'Update';
    var $http = mongoose.$service.$http;

    $http.post(url,{updatePojo:pojo})
    .success(function(data){
        dealCallback(data,callback,function(){
            mongoose.$setCurPage();
        });
    }).error(function(){
        log(2,'saveUrl:连接出错');
    });
    
};

/**
 * @param  {Array} array 数组
 * @param  {Number} curPage 开始下表
 * @param  {Number} pageSize 截取数量
 */
exports.getSlice = function(array,curPage,pageSize){
    curPage--;

    var index = curPage*pageSize;
    return  array.slice(index,index+pageSize);
};

/**
 * @param  {Array} array 制定数组
 * @param  {Object} pojo  数组内元素
 */
exports.arrayRemovePojo = function(array,pojo){
    var index = array.indexOf(pojo);
    if (index > -1) {
        array.splice(index, 1);
    }
};