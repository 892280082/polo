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
 * ------------------------------------------------
 */

/**
 * Module dependencies.
 * @private
 */
var log = require('./log');


exports.concactArray =  function(array1,array2){
    return array1.concat(array2);
};

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


/**
 * Module variables.
 * @private
 * @description 处理查询对象
 */
function dealSearchContain (key,val) {
    var conver = function(key,val){
        return {key:key,val:val}
    };

    key = key.replace(/-/g,".");//-转换成.
    var conditions = ['$$_','$gt_','$gte_','$lt_','$lte_'];

    var delKey = _.find(conditions,function(ele){
        return key.indexOf(ele) >= 0
    });

    if(delKey == undefined)
        return conver(key,val);

    if(delKey === '$$_')
        return conver(key.replace(delKey,''),{$regex: val ,$options: 'i'});

    var tempVal = {};
    tempVal[delKey.replace('_','')] = val;
    return conver(key.replace(delKey,''),tempVal);
}


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

    var sendPojo = {
        query:searchInfo.query,
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
	       return callback(data.err,data.result);
       
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