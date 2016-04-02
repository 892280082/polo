/**
 *@desc 提供用户数据处理接口
 *@auther yq
 */
var _ = require("underscore");
angular.module('service.test_server',[]).service("test_server",["$http"
    ,function($http){
        //保存
        this.savePerson = function(person,callback){
            $http.post('/front/getPersonAllSave',{"savePojo":person})
                .success(function(data){
                    data.err && console.log(data.err);
                    return callback(data.err,data.result);
                }).error(function(){
                    alert("service.test_server->savePerson:连接出错");
                })
        };

        //删除
        this.deletePerson = function(_id,callback){
            $http.post('/front/getPersonAllRemove',{"_id":_id})
                .success(function(data){
                    data.err && console.log(data.err);
                    return callback(data.err,data.result);
                }).error(function(){
                    alert("service.test_server->savePerson:连接出错");
                })
        }

        //更新
        this.updatePerson = function(pojo,callback){
            $http.post('/front/getPersonAllUpdate',{updatePojo:pojo})
                .success(function(data){
                    data.err && console.log(data.err);
                    return callback(data.err,data.result);
                }).error(function(){
                    alert("service.test_server->updatePerson:连接出错");
                })
        }


    }]);