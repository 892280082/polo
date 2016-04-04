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

//对象属性覆盖
function coverObject(newPojo){
    var oldPojo = this;
    _.mapObject(newPojo,function(val,key){
        oldPojo[key] = val;
    })
    return oldPojo;
}

function updateLocalPojo(target){
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
}


//处理query  $$_ 模糊查询
function dealQuery(query){
    var query = deepCopy(query);
    for(var p in query){

        //删除属性
        if(query[p] === ''
            || typeof query[p] === 'undefined'
            || (_.isObject(query[p]) &&  _.keys(query[p]).length <= 0)) {

            delete  query[p];
            continue;
        }
        //处理模糊查询
        if(p.indexOf("$$_") === 0){
            var tempParam = query[p];
            delete query[p];
            p = p.substring(3,p.length);
            query[p] = {$regex: tempParam ,$options: 'i'};
        }

        //大于
        //小于

        //将中间的$换成. 方便对象深入查询 {}
        if(p.indexOf("$") > 0){
            var tempParam = query[p];
            delete query[p];
            p = p.replace("$",".");
            query[p] = tempParam;
        }

    }
    return query;
}

angular.module("service_pageResult",[])
    .service("pageResult",["$http"
    ,function($http){
        this.$array = [];//显示的数据
        this._readCache = [];//读过数据的缓存
        this._nextCache = [];//未读数据的缓存
        this._server_url ="";
        this._server_pojo = {
            query:{},
            skip:0,
            limit:10,
            sort:null,
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
        this.$loadInit = function(param,callback){
            if(param.waterfull)
                this.$waterfull = param.waterfull;
            if(param.pass)
                this.$pass = param.pass;
            if(param.query)
                this._server_pojo.query = param.query;
            if(param.pageSize)
                this.$pageSize = this._server_pojo.limit = param.pageSize;
            if(param.sort)
                this._server_pojo.sort = param.sort;
            if(param.skip)
                this._server_pojo.skip = param.skip;
            this._server_url = param.url;
            var _this = this;
            $http.post(this._server_url,{
                query:this._server_pojo.query,
                skip:this._server_pojo.skip,
                limit:this._server_pojo.limit*this.$pass,
                sort:this._server_pojo.sort,
            }).success(function(data){
                    data.err && console.log(data.err);
                    _this.$dataInit(data);
                    callback(data.err,_this);
                }).error(function(data){
                    callback('与后台请求错误');
            })
        };
        this.$search = function(query,sort,antherSort){

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
                _this.$dataInit(data);
            }).error(function(data){
                callback('与后台请求错误');
            })
        };

        this.$dataInit = function(data){
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
        this.$update = function(pojo,callback){
            if(callback == false){
                return updateLocalPojo.call(this,pojo);//更新本地对象
            }

            var _this = this;
            var url = _this._server_url+'Update';
            $http.post(url,{updatePojo:pojo})
                .success(function(data){
                    if(!data.err){
                        updateLocalPojo.call(_this,pojo);
                        callback && callback(data.err,data.result);
                    }else{
                        data.err && console.log(data.err);
                        callback ? callback(data.err) :  alert(url+":更新出错");
                    }
                }).error(function(){
                    alert(url+":连接出错");
                })
        };

    }]);

module.exports = {
    service_pageResult:"service_pageResult",
    pageResult:"pageResult"
}