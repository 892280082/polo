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


            pageResult.$loadInit({
                url:"/front/getPersonAll",
                pageSize:5,
                sort:{"_id":-1}
            },function(err,result){
                $scope.persons = result;
            })

            $scope.search = function(){
                $scope.persons.$search($scope.query);
            }

        }])

