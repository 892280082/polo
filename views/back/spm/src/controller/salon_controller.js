'use strict;'
/**
 *@work 程序主控制口
 *@auther yq
 *@version 1.0.1
 */
var _ = require("underscore");
angular.module("controller.salon_controller",["ng.ueditor"]).
    controller('salon_controller',['$scope','showCtrl','FileUploader','$window','salon_server'
        ,function($scope,showCtrl,FileUploader,$window,salon_server){
            /************************数据模型****************************/
            $scope.pojo_custom = {};//会所对象


            /*********************注册show service**************************/
            $scope.show = showCtrl;
            $scope.show.$regist('cuslist',['cuslist'],true);
            $scope.show.$regist('cusadd',['cusadd']);
            /***********************分类列表页面************************/

            salon_server.Dao.$pagin({},15,function(err,result){
                if(!err){
                    $scope.array_custom = result;
                }else{
                    layer.msg('后台数据获取错误');
                }
            });

            $scope._ = _;

            $scope.changeIntoEdit = function(cus){
                $scope.pojo_custom = cus || {};
                $scope.show.$set('cusadd');
            };

            $scope.toPageList = function(){
                $scope.show.$set('cuslist');
            };


            $scope.saveOrUpdate = function(){
                $scope.array_custom.$saveOrUpdate($scope.pojo_custom,function(err){
                    if(!err){
                        layer.msg('操作成功');
                    }else{
                        layer.msg("操作失败");
                    }
                });
                $scope.toPageList();
            };

            $scope.removeCustom = function(cus){
                layer.confirm('确定删除,该操作无法恢复', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    $scope.array_custom.$remove(cus,function(err){
                        if(!err){
                            layer.msg('删除成功');
                        }else{
                            layer.msg("删除失败");
                        }
                    });
                }, function(){

                });
            };

            //选定状态
            $scope.validateTime = function(startData,overData,infos) {
                var currentTime = new Date();
                startData = new Date(startData);
                overData = new Date(overData);

                if (currentTime < startData)
                    return infos[0];
                if (currentTime >= startData && currentTime <= overData)
                    return infos[1];
                else
                    return infos[2];
            };


            /**************************上传配置**************************/
            //配置大图图像上传
            var uploader = $scope.uploader = new FileUploader({
                url: '/upload',
                alias:'fileName'
            });
            uploader.onAfterAddingFile = function(item) {
                item.upload();
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                $scope.pojo_custom.imgUrl = response.path;
            };

            /****************父级选定****************************/
        }]);

