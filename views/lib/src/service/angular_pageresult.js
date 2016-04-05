/**
 * @desc 前端分页插件  后续会增加和后端互通实现 前段+后端分页
 * @author yq
 * @date 2016/3/2
 */
/**
 * @param array {Array} 数组
 * @param obj {Object} 删除对象
 */
var _ = require("underscore");


function removeArray(array,obj){
    var flag = false;
    for(var i=0;i<array.length;i++){
        if(array[i] == obj){
            flag = !flag;
            break;
        }
    }
    if(flag)array.splice(i,1);
}

//删除数组头部个数
function ArrayRemoveHead(array,size){
    return array.splice(0,size);
}

//删除数组尾部个数
function ArrayRemovePop(array,size){
    return array.splice(array.length-size,size);
}

//合并数组 array1~array2的顺序
function concactArray(array1,array2){
    return array1.concat(array2);
}

//对象的拷贝
function deepCopy(source) {
    var result={};
    for (var key in source) {
        result[key] = typeof source[key]==='object'
            ? deepCopy(source[key])
            : source[key];
    }
    return result;
}

function dealSearchContain (key,val) {
    var conver = function(key,val){
        return {key:key,val:val}
    }

    key = key.replace(/-/g,".");//-转换成.
    var conditions = ['$$_','$gt_','$gte_','$lt_','$lte_'];

    var delKey = _.find(conditions,function(ele){
        return key.indexOf(ele) >= 0
    })

    if(delKey == undefined)
        return conver(key,val);

    if(delKey === '$$_')
        return conver(key.replace(delKey,''),{$regex: val ,$options: 'i'});

    var tempVal = {};
    tempVal[delKey.replace('_','')] = val;
    return conver(key.replace(delKey,''),tempVal);
}

//处理query
function dealQuery(query){
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
            })
            continue;
        }

        tempQuery[result.key] = result.val;
    }

    return tempQuery;
}

angular.module("service_pageResult",[])
    .service("pageResult",["$http"
    ,function($http){
        this.$array = [];//显示的数据
        this._readCache = [];//读过数据的缓存
        this._nextCache = [];//未读数据的缓存
        this._server_url ="";
        this.$query = {};//search和get的查询对象
        this._server_pojo = { //发送给后台分页的对象
            query:{},
            skip:0,
            limit:10,
            sort:null,
            populate:'',
        };
        this.$pageSize = this._server_pojo.limit;//页面显示数据条数
        this.$totalSize = 0;//总数
        this.$curPage = 1;//当前页
        this.$pageCount = 0;//总页数
        this.$waterfull = false;
        this.$last = false;
        this.$next = false;
        this.$pass = 3;
        this.$toLast = function(){
            this._nextCache = concactArray(this.$array,this._nextCache);
            this.$array = ArrayRemovePop(this._readCache,this.$pageSize);
            this.$curPage--;
            this._update();
        };
        this.$toNext = function(){
            if(!this.$waterfull) { //普通模式
                this._readCache = concactArray(this._readCache, this.$array);
                this.$array = ArrayRemoveHead(this._nextCache, this.$pageSize);
            }else{//瀑布流
                this.$array = concactArray(this.$array,ArrayRemoveHead(this._nextCache,this.$pageSize))
            }
            this.$curPage++;
            this._update();
        };
        this._update = function(){
            var _this = this;
            //判断上一页和下一页的状态
            this.$curPage <= 1
                ? this.$last = false
                : this.$last = true;
            this.$curPage >= this.$pageCount
                ? this.$next = false
                : this.$next = true;
            //判断 this._readCache 长度大于150 则删除数组头部的pageSize单位
            //判断 this._readCache 长度小于等于pageSize 和 curPage不等于1 则请求服务器将获得的数据放入缓存头部
            //判断 this._readCache 长度大于150 则删除数组尾部的pageSize单位

            //判断 则再请求服务器 将数据放入缓存尾部
            if(this.$curPage <= this.$pageCount //当前页小于总页数
                && this._nextCache.length <= this.$pageSize //当缓存的页数不足一页时查询数据库
                && this._server_pojo.skip < this.$pageCount //判断skip小于总页数
                && this.$totalSize > this.$pageSize*this.$pass
            ){
                $http.post(this._server_url,{
                    query:this._server_pojo.query,
                    skip:this._server_pojo.skip,
                    limit:this._server_pojo.limit*this.$pass,})
                .success(function(data){
                    data.err && console.log(data.err);
                    _this._server_pojo.skip+=1;
                    _this._nextCache = concactArray(_this._nextCache,data.result.docs);
                }).error(function(data){
                    console.log('与后台请求错误');
                })
            }
        };
        this.$link = function(url){
            this._server_url = url;
        };
        this.$pagination = function(param,callback){
            this.$waterfull = param.waterfull || this.$waterfull;

            this.$pass = param.pass || this.$pass;

            this._server_pojo.query = param.query || this._server_pojo.query;

            this._server_pojo.limit = this.$pageSize =  param.pageSize || this.$pageSize;

            this._server_pojo.sort = param.sort || this._server_pojo.sort;

            this._server_pojo.skip = param.skip || this._server_pojo.skip;

            this._server_pojo.populate = param.populate || this._server_pojo.populate;

            this._server_url = param.url || this._server_url;

            var _this = this;

            $http.post(this._server_url,{
                query:this._server_pojo.query,
                skip:this._server_pojo.skip,
                limit:this._server_pojo.limit*this.$pass,
                sort:this._server_pojo.sort,

            }).success(function(data){
                    data.err && console.log(data.err);
                    _this._paginationInit(data);
                    callback(data.err,_this);
                }).error(function(data){
                    callback('与后台请求错误');
            })
        };
        this.$search = function(query,sort,antherSort){
            query = query || this.$query;

            query ? query = dealQuery(query)
                  : query = {};

            sort = sort || this._server_pojo.sort;

            if(antherSort){
                sort = _.each(_.toArray(arguments).splice(2),function(ele){
                            for(var p in ele)
                                sort[p] = ele[p];
                        })
            }
            this._server_pojo.query = query;
            this._server_pojo.skip = 0;
            var _this = this;
            $http.post(this._server_url,{
                query:this._server_pojo.query,
                skip:this._server_pojo.skip,
                limit:this._server_pojo.limit*this.$pass,
                sort:sort,
            }).success(function(data){
                data.err && console.log(data.err);
                _this._paginationInit(data);
            }).error(function(data){
                callback('与后台请求错误');
            })
        };

        this._paginationInit = function(data){ //分页初始化数据
            this.$curPage = 1;
            this._server_pojo.skip+=1;
            this._nextCache = data.result.docs;
            this.$array = ArrayRemoveHead(this._nextCache,this.$pageSize);

            this.$totalSize = data.result.total;
            this.$pageCount =  this.$totalSize/this.$pageSize;
            if(this.$pageCount%this.$pageSize)
                this.$pageCount = (~~this.$pageCount)+1;

            this._update();
        };

        this._save = function(pojo){
            this.$array.splice(0,0,pojo);
            this.$totalSize++;
            if(this.$curPage < this.$pageCount){
                var _last = this.$array.pop();
                this._nextCache.splice(0,0,_last);
            }
        };
        this.$save = function(pojo,callback){
            if(callback == false)
                return this._save(pojo)

            var _this = this;
            var url = _this._server_url+'Save';
            $http.post(url,{"savePojo":pojo})
                .success(function(data){
                    if(!data.err){
                        _this._save(data.result);
                        callback && callback(data.err,data.result);
                    }else{
                        data.err && console.log(data.err);
                        callback ? callback(data.err) :  alert(url+":保存出错");
                    }
                }).error(function(){
                    alert("saveUrl:连接出错");
                })
        };
        this._remove = function(pojo){//删除本地数组中的元素
            removeArray(this.$array,pojo);
            if(this._nextCache.length>1){
                this.$array.push(this._nextCache.splice(0,1)[0])
            }
            this.$totalSize--;
        };
        this.$remove = function(pojo,callback){
            if(!pojo._id || callback == false)
                return this._remove(pojo);

            var _this = this;
            var url = _this._server_url+'Remove';
            $http.post(url,{_id:pojo._id})
                .success(function(data){
                    if(!data.err){
                        _this._remove(pojo);
                        callback && callback(data.err,data.result);
                    }else{
                        data.err && console.log(data.err);
                        callback ? callback(data.err) :  alert(url+":删除出错");
                    }
                }).error(function(){
                    alert(url+":连接出错");
                })
        };
        this.$updateLocalPojo = function(target){ //更新本地对象 返回是否更新成功
            var array = concactArray(this._readCache,this.$array);
            array = concactArray(array,this._nextCache);
            var oldpojo = _.find(array,function(ele){
                return ele._id == target._id;
            })
            if(oldpojo){
                _.mapObject(target,function(val,key){
                    oldpojo[key] = val;
                })
            }
            return !!oldpojo;
        };
        this.$update = function(pojo,callback){
            if(callback == false){
                return this.$updateLocalPojo(pojo);//更新本地对象
            }

            var _this = this;
            var url = _this._server_url+'Update';
            $http.post(url,{updatePojo:pojo})
                .success(function(data){
                    if(!data.err){
                        _this.$updateLocalPojo(pojo);
                        callback && callback(data.err,data.result);
                    }else{
                        data.err && console.log(data.err);
                        callback ? callback(data.err) :  alert(url+":更新出错");
                    }
                }).error(function(){
                    alert(url+":连接出错");
                })
        };
        this.$get = function(query,callback){
            $http.post(this._server_url,{
                query:query || this.$query,
                limit:9999,
                skip:0,
            }).success(function(data){
                data.err && console.log(data.err);
                callback(data.err,data.result.docs)
            }).error(function(data){
                callback('与后台请求错误');
            })
        }

    }]);

module.exports = {
    service_pageResult:"service_pageResult",
    pageResult:"pageResult"
}