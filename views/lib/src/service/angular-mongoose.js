/*
 * @desc 前端Model，封装了数据查询和增删改，异步缓存分页，复杂查询。
 *
 * @API
 * 1.$init   设置后端汇聚接口,并且返回一个前端mongoose实例
 * 2.$pagin   简单分页 -call(err,'分页对象')
 * 3.$pagination 复杂参数分页.$pagin的升级版
 * #使用增删改必须使用前三个方法中的一个 因为需要配置后端接口
 * #增删改参数重写特性一致 如果第二个参数为false表示本地操作，如果类型为Function表示回调
 * 3.$remove 根绝_id删除该对象
 * 4.$update 根绝_id更新对象
 * 5.$save   保存该对象
 * 6.$saveOrUpdate 根绝对象是否具有_id属性来判断该对象进行保存或者更新操作
 * 7.$seach 查询方法，查询后本地视图更新
 * 8.$query 本地查询对象，如果$search没有设置查询参数则使用该对象查询
 * 9.$get 获取数据,如果不设置query对象，则利用$query对象查询 查询结果不更新本地视图
 *
 *@分页对象API
 * 1.$toNext 进入下一页
 * 2.$toLast 进入上一页
 * @分页对象PARAM
 * 1.$last {Boolean} 是否拥有上一页
 * 2.$next {Boolean} 是否拥有下一页
 * 3.$pageCount {Number} 总页数
 * 4.$curPage {Number} 当前页
 * 5.$totalSize {Number} 数据总条数
 *
 * @复杂查询API
 * 1.普通查询
 * $query.name = 'xx';
 * 2.字段嵌套查询 {school:{name:'xxx'}}  查询需要把原先的'.' 换成 '-'
 * $query.school-name = 'xxx';  嵌套$query.$$_school-name='xxxx';
 * 3.复杂查询 就是在字段前加前缀，程序会自动进行转化
 * $$_ 模糊查询
 * $gt_ 大于  $gte_ 大于等于
 * $lt_ 小于  $lte_ 小于等于
 *
 * */
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
    _.mapObject(source,function(val,key){
        if(_.isArray(val))
            return result[key] = [];

        if(_.isFunction(val))
            return result[key] = val;

        result[key] =  _.isObject(val) ? deepCopy(val) :  val;
    })
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


angular.module("service_mongoose",[])
    .service("mongoose",["$http"
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

                //如果当前页删除完，并且还有上一页则返回到上一页
                if(_this.$curPage > 1 && this.$array.length === 0)
                    return this.$toLast();

                //计算总页数
                this.$pageCount =  this.$totalSize/this.$pageSize;
                if(this.$totalSize%this.$pageSize)
                    this.$pageCount = (~~this.$pageCount)+1;

                //判断上一页和下一页的状态
                this.$last = this.$curPage > 1;
                this.$next = this.$curPage < this.$pageCount;

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
            /**
             * @param url {String} -后端接口
             */
            this.$init = function(url){
                this._server_url = url;
                var copyPojo = deepCopy(this);
                return copyPojo;
            };
            /**
             * @param query 查询对象 @param pageSize 分页大小
             */
            this.$pagin = function(query,pageSize,callback){
                var self = this;
                if(!!callback)
                    return this.$pagination({query:query,pageSize:pageSize},callback);

                this.$pagination({query:query,pageSize:pageSize},function(err,_this){
                    self = _this;
                });
                return self;
            }
            /**
             * @param param  {{ url:String,//后台接口
         *                  pageSize:Number,//分页大小
         *                  waterFull:Boolean?,//是否开启瀑布流
         *                  sort:Object?,//排序
         *                  query:Object,//查询对象
         *                  populate:String?,//是否连查
         *                  skip:Number?}}//跳过多少页查询
             *
             */
            this.$pagination = function(param,callback){
                this.$waterfull = param.waterfull || this.$waterfull;

                this.$pass = param.pass || this.$pass;

                this._server_pojo.query = param.query || this._server_pojo.query;

                this.$pageSize =  param.pageSize || this.$pageSize;

                this._server_pojo.limit = this.$pageSize;

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
            /**
             * @param query {Object} 查询条件
             * @param sort ｛Object｝ 第一排序
             * @param antherSort 可有多个  一次排序的key/val 对象
             */
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
                this._update();
            };
            this._save = function(pojo){
                this.$array.splice(0,0,pojo);
                this.$totalSize++;
                if(this.$curPage < this.$pageCount){
                    var _last = this.$array.pop();
                    this._nextCache.splice(0,0,_last);
                }
                this._update();
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
                            console.log(data.err);
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
                this._update();
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
                            console.log(data.err);
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
                            console.log(data.err);
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
            this.$saveOrUpdate = function(pojo,option){
                pojo._id ? this.$update(pojo,option)
                    : this.$save(pojo,option);
            };
            this.$removeCache = function(){
                this.$array = [];//显示的数据
                this._readCache = [];//读过数据的缓存
                this._nextCache = [];//未读数据的缓存
            };
            this.$arrayPagin = function(array,pageSize){
                return new ArrayToPage().$init(array,pageSize);
            }

        }]).directive('mongoosePagination', function() {
        return {
            restrict: 'E',
            template:
            '<div class="mongoosepage"> ' +
            '<span><a  class="mongoosechange" ng-show="data.$last"  style="cursor: pointer" ng-click="data.$toLast();">{{ lastText }}</a></span> ' +
            '<span><a  class="mongoosechange" ng-show="data.$next"  style="cursor: pointer" ng-click="data.$toNext();">{{ nextText }}</a></span> ' +
            ' <span class="mongoosecurage" > <a>{{ data.$curPage }}/{{ data.$pageCount }}</a> </span> ' +
            '<span class="mongoosetotal"><a>{{ totalText }}:{{ data.$totalSize }}</a></span> ' +
            '</div>',
            scope:{
                data:'='
            },
            replace: true,
            link:function(scope){
                scope.lastText = "上一页";
                scope.nextText = "下一页";
                scope.totalText = "总共";
            }
        };
    });

var ArrayToPage = function(){
    this._array = [];//缓存接受的数组
    this.$array = [];
    this.$pageSize = 0;
    this.$pageCount = 0;//数据总页数
    this.$curPage = 1;
    this.$totalSize = 0;//数据总条数
    this.$last = false;
    this.$next = false;
    this._juageCurpage = function(curPage){
        if(curPage < 1 || curPage > this.$pageCount){
            throw "pageResult mehod _juageCurpage error: 页数不对";
            return false;
        }
        //判断上一页和下一页的状态
        this.$last = curPage > 1;
        this.$next = curPage < this.$pageCount;

        return true;
    };
    this._getArrayByCur = function(curPage){
        var tempArray = [];
        var point = (curPage-1)*this.$pageSize;
        for(var i=0;i<this.$pageSize;i++){
            if(point<this._array.length){
                tempArray.push(this._array[point++])
            }else{
                break;
            }
        }
        return tempArray;
    };
    this.$init = function(array,pageSize){
        if(array.length == 0 || !array){
            this.$array = [];
            this.$pageSize = 0;
            this.$totalSize = 0;
            this.$pageCount = 0;
            this.$curPage = 0;
            return this;
        }
        this._array = array;
        this.$pageSize = pageSize;
        this.$totalSize = array.length;
        this.$pageCount = array.length/pageSize;
        if(array.length%pageSize){
            this.$pageCount += 1;
        }
        this.$pageCount = parseInt(this.$pageCount);
        this.$showPage(1);
        return this;
    };
    this.$toNext = function(){
        var tempCurPage = this.$curPage+1;
        if(this._juageCurpage(tempCurPage)){
            this.$array = this._getArrayByCur(tempCurPage);
            this.$curPage = tempCurPage;
        }
    };
    this.$toLast = function(curPage){
        var tempCurPage = this.$curPage-1;
        if(this._juageCurpage(tempCurPage)){
            this.$array = this._getArrayByCur(tempCurPage);
            this.$curPage = tempCurPage;
        }
    };
    this.$showPage = function(curPage){
        if(this._juageCurpage(curPage)){
            this.$array = this._getArrayByCur(curPage);
            this.$curPage = curPage;
        }
    };
    this.$search = function(searchPojo){
        var key,value;
        for( var p in searchPojo ){
            key = p;
            value = searchPojo[p];
        }
        var tempArray = this._array;
        var _curPage = 1;
        for(var i=0,ii=tempArray.length;i<ii;i++){
            if(i%this.$pageSize==0 && i != 0){
                _curPage++;
            }
            if(tempArray[i][key] == value){
                this.$showPage(_curPage);
            }
        }
    };
    this.$push = function(pojo){
        this._array.splice(0, 0,pojo);
        this.$init(this._array,this.$pageSize);
    };
    this.$remove = function(pojo){
        removeArray(this._array,pojo);
        this.$init(this._array,this.$pageSize).$showPage(this.$curPage);
    };
}


module.exports = "service_mongoose";
