/**
 * @desc 测试分页插件
 * @author yq
 * @date 2016/2/29
 * */
var angular = require("angular");
var ngAnimate = require("angular-animate");
/**加载 原型扩展*/
require("../../lib/jsExtend.js");
/***加载显示插件****/
require("../../lib/src/service/angular-showCtrl.js");
/**加载分页插件*/
var pageResult = require("../../lib/src/service/angular_pageresult.js");
/**加载ueditor插件*/
require("../../lib/src/directive/angular-ueditor.js");
///**加载上传插件*/
require("../../lib/angular/angular-file-upload.min.js");
///**加载后台数据接口*/
require("./src/service/test_server.js");
///**加载主程序人口*/
require("./src/controller/test_control.js");

var app = angular.module('myApp',[
    ngAnimate,
    'angularFileUpload',
    'service.showCtrl',
    'service.test_server',
    pageResult.service_pageResult,
    'controller.test_control'
]);
