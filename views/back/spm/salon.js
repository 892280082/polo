/**
 * @desc 处理用户数据
 * @author yq
 * @date 2016/2/29
 * */
var angular = require("angular");
var _ = require('underscore');
/**加载 原型扩展*/
require("../../lib/jsExtend.js");
/***加载显示插件****/
require("../../lib/src/service/angular-showCtrl.js");
/**加载ueditor插件*/
require("../../lib/src/directive/angular-ueditor.js");
///**加载上传插件*/
require("../../lib/angular/angular-file-upload.min.js");
///**加载后台数据接口*/
require("./src/service/salon_server");
///**加载主程序人口*/
require("./src/controller/salon_controller");
//加载mongoose
var mongoose = require("../../lib/src/service/angular-mongoose.js");

var app = angular.module('myApp',[
    mongoose,
    'controller.salon_controller',
    'service.salon_server',
    'angularFileUpload',
    'service.showCtrl',
]);

app.directive('tsCuslist',function(){
    return {
        restrict:'EAC',
        templateUrl:'cuslist'
    }
}).directive('tsCusadd',function(){
    return {
        restrict:'EAC',
        templateUrl:'cusadd'
    }
})