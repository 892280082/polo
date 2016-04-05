/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
    var _ = require("underscore");
    angular.module("controller.test_control",[
                                        "ng.ueditor"
    ]).controller('test_control',['$scope','showCtrl','FileUploader','pageResult'
        ,'$window','test_server'
        ,function($scope,showCtrl,FileUploader,pageResult,$window,test_server){
            /************************数据模型****************************/

            $scope.person = {};

            $scope.query = {};

            $scope.testLocalPojo = {
                _id:"570144cefbb38a0211949eea",
                name:"changeLocal3"
            }


            $scope.subForm = function(){
                var _id = $scope.person._id;
                if(!_id) {
                    $scope.persons.$save($scope.person,function(err,doc){
                        console.log(err,doc);
                    });
                }else{
                    $scope.persons.$update($scope.person,function(err,doc){
                        alert("更新成功");
                        console.log(err,doc);
                    });
                }
            }

            $scope.delete = function(person){
                $scope.persons.$remove(person,function(err,doc){
                    console.log(err,doc);
                });
            }

            $scope.update = function(person){
                $scope.person = person;
            }


            //pageResult.$pagination({
            //    url:"/front/getPersonAll",
            //    pageSize:5,
            //    sort:{"_id":-1}
            //},function(err,result){
            //    $scope.persons = result;
            //})


            pageResult.$link('/front/getPersonAll');



            setTimeout(function(){
                pageResult.$update({"_id":"5703d85250de6b4c0d1d1ee0",name: _.random(100,1000)+'ss'},function(err,info){
                    console.log("更新");

                    console.log(err,info);
                })
            },1000)

            setTimeout(function(){
                pageResult.$save({name: _.random(100,1000)+'ss'},function(err,info){
                    console.log("增加");

                    console.log(err,info);
                })
            },3000)

            setTimeout(function(){
                pageResult.$remove({"_id":"5703d85250de6b4c0d1d1ee0",name: _.random(100,1000)+'ss'},function(err,info){
                    console.log("删除");

                    console.log(err,info);
                })
            },5000)





            setTimeout(function(){
                pageResult.$get({},function(err,docs){
                    console.log(err,docs);
                })
            },7000)




        }])

