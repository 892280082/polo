!function(e){function t(a){if(n[a])return n[a].exports;var i=n[a]={exports:{},id:a,loaded:!1};return e[a].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";var a=n(4);angular.module("myApp",[a]).controller("main",["$scope","mongoose",function(e,t){e.salonDao=t.$link("/back/curdSalon"),e.salonDao.$find({},function(t,n){console.log("salonDao",e.salonDao)})}])},function(e,t,n){"use strict";function a(e,t){var n=function(e,t){return{key:e,val:t}};e=e.replace(/-/g,".");var a=["$$_","$gt_","$gte_","$lt_","$lte_","$ne_"],i=r.find(a,function(t){return e.indexOf(t)>=0});if(void 0===i)return n(e,t);if("$$_"===i)return n(e.replace(i,""),{$regex:t,$options:"i"});var o={};return o[i.replace("_","")]=t,n(e.replace(i,""),o)}var i=n(3),r=n(8);t.concactArray=function(e,t){return e.concat(t)},t.dealQuery=function(e){var t={};for(var n in e)if(!(""===e[n]||"undefined"==typeof e[n]||r.isObject(e[n])&&r.keys(e[n]).length<=0)){var i=a(n,e[n]);if(r.has(t,i.key)){var o=t[i.key];r.mapObject(i.val,function(e,t){o[t]=e})}else t[i.key]=i.val}return t},t.merge=function(e,t){for(var n in t)e[n]=t[n]},t.checkSetting=function(e){e.$service.$http||i(1,"$http \u6ca1\u6709\u8bbe\u7f6e")},t.getData=function(e,n){var a=e.$service.$http,r=e.$searchInfo,o=e.$pagingInfo,s={};t.merge(s,r.query),t.merge(s,t.dealQuery(e.$query));var u={query:s,limit:o.pageSize,skip:o.curPage-1,sort:r.sort,populate:r.populate};a.post(r.url,u).success(function(a){return a.err&&i(1,err),t.analyDate(e,a.result),n?n(a.err,a.result.docs):void 0}).error(function(e){i(2,"\u540e\u53f0\u5730\u5740\u94fe\u63a5\u5931\u8d25\uff1a"+r.url)})},t.analyDate=function(e,n){var a=e.$pagingInfo,i=a.waterfull;a.total=n.total,a.curPage=n.skip+1,a.allPage=t.juageAllPage(n.limit,n.total);e.$array;i?e.$array=t.concactArray(e.$array,n.docs):e.$array=n.docs},t.juageAllPage=function(e,t){var n=~~(t/e);return t%e?n+1:n};var o=function(e,t,n,a){e.err?(i(1,"\u540e\u53f0curd\u8bf7\u6c42\u62a5\u9519:"+e.err),a&&a(),t&&t(e.err,e.result)):(n&&n(),t&&t(e.err,e.result))};t.save=function(e,t,n){var a=n.$searchInfo.url+"Save",r=n.$service.$http;r.post(a,{savePojo:e}).success(function(e){o(e,t,function(){n.$setCurPage()})}).error(function(){i(2,"saveUrl:\u8fde\u63a5\u51fa\u9519")})},t.remove=function(e,t,n){var a=n.$searchInfo.url+"Remove",r=n.$service.$http;r.post(a,{_id:e._id}).success(function(e){o(e,t,function(){n.$setCurPage()})}).error(function(){i(2,"saveUrl:\u8fde\u63a5\u51fa\u9519")})},t.update=function(e,t,n){var a=n.$searchInfo.url+"Update",r=n.$service.$http;r.post(a,{updatePojo:e}).success(function(e){o(e,t,function(){n.$setCurPage()})}).error(function(){i(2,"saveUrl:\u8fde\u63a5\u51fa\u9519")})},t.getSlice=function(e,t,n){t--;var a=t*n;return e.slice(a,a+n)},t.arrayRemovePojo=function(e,t){var n=e.indexOf(t);n>-1&&e.splice(n,1)}},function(e,t){"use strict";function n(e,t){var n=Array.prototype.slice.call(arguments),a=n.shift();switch(a){case 0:n.unshift("SERVICE_MONGOOSE_LOG---->");break;case 1:n.unshift("SERVICE_MONGOOSE_WARN---->");break;case 2:n.unshift("SERVICE_MONGOOSE_ERROR---->")}console.log.apply(console,n)}e.exports=n},function(e,t,n){"use strict";var a=(n(2),n(6)),i=n(5);n(7);var r;e.exports=r="service_mongoose",angular.module(r,["ui.bootstrap_pagination","mongoose-pagination.html"]).service("mongoose",["$http",function(e){this.$link=function(t){return(new a).__setHttp(e).__link(t)},this.$toArray=function(e,t,n){return(new i).__init(e,t,n)}}]).directive("mongoosePagin",[function(){return{scope:{ngModel:"=ngModel"},templateUrl:function(e,t){return"mongoose-pagination.html"},link:function(e,t,n,a){e.$pagingInfo=e.ngModel.$pagingInfo,e.pageChanged=function(){e.ngModel.$setCurPage()}}}}]),angular.module("mongoose-pagination.html",[]).run(["$templateCache",function(e){e.put("mongoose-pagination.html",'<uib-pagination class="pagination-sm"boundary-links="true"max-size="8"ng-model="$pagingInfo.curPage"ng-change="pageChanged()"total-items="$pagingInfo.total"items-per-page="$pagingInfo.pageSize"num-pages="numPages"></uib-pagination>')}])},function(e,t,n){"use strict";var a,i=n(2);e.exports=a=function(){this.$pagingInfo={total:0,curPage:1,pageSize:20,allPage:0,waterfull:!1},this.$array=[],this._array=[]},a.prototype.__init=function(e,t,n){var a=this.$pagingInfo;return this._array=e||this._array,a.total=this._array.length,a.pageSize=t||a.pageSize,a.waterfull=n||a.waterfull,a.allPage=i.juageAllPage(a.pageSize,a.total),this.$setCurPage()},a.prototype.$setCurPage=function(e){var t=this.$pagingInfo;return e&&(t.curPage=e),this.$array=i.getSlice(this._array,t.curPage,t.pageSize),this},a.prototype.$save=function(e){return e instanceof Array?this._array=this._array.concat(e):this._array.push(e),this.__init(),this},a.prototype.$remove=function(e){return i.arrayRemovePojo(this._array,e),this.$init(),this}},function(e,t,n){"use strict";var a,i=n(2);n(3);e.exports=a=function(){this.$pagingInfo={total:0,curPage:1,pageSize:20,allPage:0,waterfull:!1},this.$searchInfo={query:{},sort:null,populate:null,url:null},this.$service={$http:null},this.$array=[],this.$callback=null,this.$query={}},a.prototype.__setHttp=function(e){return this.$service.$http=e,this},a.prototype.__link=function(e){return i.checkSetting(this),this.$searchInfo.url=e,this},a.prototype.$find=function(e,t){return i.checkSetting(this),this.$searchInfo.query=e,t?void i.getData(this,t):this},a.prototype.limit=function(e){return this.$pagingInfo.pageSize=e,this},a.prototype.sort=function(e){return this.$searchInfo.sort=e,this},a.prototype.populate=function(e){return this.$searchInfo.populate=e,this},a.prototype.skip=function(e){return this.$pagingInfo.curPage=e+1,this},a.prototype.waterfull=function(e){return this.$pagingInfo.waterfull=!!e,this},a.prototype.exec=function(e){e&&(this.$callback=e),i.getData(this,e)},a.prototype.$setCurPage=function(e){e=e||this.$pagingInfo.curPage,this.skip(e-1),this.exec(this.$callback)},a.prototype.$save=function(e,t){i.save(e,t,this)},a.prototype.$remove=function(e,t){i.remove(e,t,this)},a.prototype.$update=function(e,t){i.update(e,t,this)},a.prototype.$search=function(){this.skip(0).exec(this.$callback)}},function(e,t){"use strict";angular.module("ui.bootstrap_pagination",["ui.bootstrap.tpls","ui.bootstrap.pagination","ui.bootstrap.paging"]),angular.module("ui.bootstrap.tpls",["uib/template/pagination/pagination.html"]),angular.module("ui.bootstrap.pagination",["ui.bootstrap.paging"]).controller("UibPaginationController",["$scope","$attrs","$parse","uibPaging","uibPaginationConfig",function(e,t,n,a,i){function r(e,t,n){return{number:e,text:t,active:n}}function o(e,t){var n=[],a=1,i=t,o=angular.isDefined(u)&&t>u;o&&(l?(a=Math.max(e-Math.floor(u/2),1),i=a+u-1,i>t&&(i=t,a=i-u+1)):(a=(Math.ceil(e/u)-1)*u+1,i=Math.min(a+u-1,t)));for(var s=a;i>=s;s++){var f=r(s,p(s),s===e);n.push(f)}if(o&&u>0&&(!l||c||g)){if(a>1){if(!g||a>3){var h=r(a-1,"...",!1);n.unshift(h)}if(g){if(3===a){var $=r(2,"2",!1);n.unshift($)}var d=r(1,"1",!1);n.unshift(d)}}if(t>i){if(!g||t-2>i){var v=r(i+1,"...",!1);n.push(v)}if(g){if(i===t-2){var m=r(t-1,t-1,!1);n.push(m)}var P=r(t,t,!1);n.push(P)}}}return n}var s=this,u=angular.isDefined(t.maxSize)?e.$parent.$eval(t.maxSize):i.maxSize,l=angular.isDefined(t.rotate)?e.$parent.$eval(t.rotate):i.rotate,c=angular.isDefined(t.forceEllipses)?e.$parent.$eval(t.forceEllipses):i.forceEllipses,g=angular.isDefined(t.boundaryLinkNumbers)?e.$parent.$eval(t.boundaryLinkNumbers):i.boundaryLinkNumbers,p=angular.isDefined(t.pageLabel)?function(n){return e.$parent.$eval(t.pageLabel,{$page:n})}:angular.identity;e.boundaryLinks=angular.isDefined(t.boundaryLinks)?e.$parent.$eval(t.boundaryLinks):i.boundaryLinks,e.directionLinks=angular.isDefined(t.directionLinks)?e.$parent.$eval(t.directionLinks):i.directionLinks,a.create(this,e,t),t.maxSize&&s._watchers.push(e.$parent.$watch(n(t.maxSize),function(e){u=parseInt(e,10),s.render()}));var f=this.render;this.render=function(){f(),e.page>0&&e.page<=e.totalPages&&(e.pages=o(e.page,e.totalPages))}}]).constant("uibPaginationConfig",{itemsPerPage:10,boundaryLinks:!1,boundaryLinkNumbers:!1,directionLinks:!0,firstText:"First",previousText:"Previous",nextText:"Next",lastText:"Last",rotate:!0,forceEllipses:!1}).directive("uibPagination",["$parse","uibPaginationConfig",function(e,t){return{scope:{totalItems:"=",firstText:"@",previousText:"@",nextText:"@",lastText:"@",ngDisabled:"="},require:["uibPagination","?ngModel"],controller:"UibPaginationController",controllerAs:"pagination",templateUrl:function(e,t){return t.templateUrl||"uib/template/pagination/pagination.html"},replace:!0,link:function(e,n,a,i){var r=i[0],o=i[1];o&&r.init(o,t)}}}]),angular.module("ui.bootstrap.paging",[]).factory("uibPaging",["$parse",function(e){return{create:function(t,n,a){t.setNumPages=a.numPages?e(a.numPages).assign:angular.noop,t.ngModelCtrl={$setViewValue:angular.noop},t._watchers=[],t.init=function(e,i){t.ngModelCtrl=e,t.config=i,e.$render=function(){t.render()},a.itemsPerPage?t._watchers.push(n.$parent.$watch(a.itemsPerPage,function(e){t.itemsPerPage=parseInt(e,10),n.totalPages=t.calculateTotalPages(),t.updatePage()})):t.itemsPerPage=i.itemsPerPage,n.$watch("totalItems",function(e,a){(angular.isDefined(e)||e!==a)&&(n.totalPages=t.calculateTotalPages(),t.updatePage())})},t.calculateTotalPages=function(){var e=t.itemsPerPage<1?1:Math.ceil(n.totalItems/t.itemsPerPage);return Math.max(e||0,1)},t.render=function(){n.page=parseInt(t.ngModelCtrl.$viewValue,10)||1},n.selectPage=function(e,a){a&&a.preventDefault();var i=!n.ngDisabled||!a;i&&n.page!==e&&e>0&&e<=n.totalPages&&(a&&a.target&&a.target.blur(),t.ngModelCtrl.$setViewValue(e),t.ngModelCtrl.$render())},n.getText=function(e){return n[e+"Text"]||t.config[e+"Text"]},n.noPrevious=function(){return 1===n.page},n.noNext=function(){return n.page===n.totalPages},t.updatePage=function(){t.setNumPages(n.$parent,n.totalPages),n.page>n.totalPages?n.selectPage(n.totalPages):t.ngModelCtrl.$render()},n.$on("$destroy",function(){for(;t._watchers.length;)t._watchers.shift()()})}}}]),angular.module("uib/template/pagination/pagination.html",[]).run(["$templateCache",function(e){e.put("uib/template/pagination/pagination.html",'<ul class="pagination">\n  <li ng-if="::boundaryLinks" ng-class="{disabled: noPrevious()||ngDisabled}" class="pagination-first"><a href ng-click="selectPage(1, $event)">{{::getText(\'first\')}}</a></li>\n  <li ng-if="::directionLinks" ng-class="{disabled: noPrevious()||ngDisabled}" class="pagination-prev"><a href ng-click="selectPage(page - 1, $event)">{{::getText(\'previous\')}}</a></li>\n  <li ng-repeat="page in pages track by $index" ng-class="{active: page.active,disabled: ngDisabled&&!page.active}" class="pagination-page"><a href ng-click="selectPage(page.number, $event)">{{page.text}}</a></li>\n  <li ng-if="::directionLinks" ng-class="{disabled: noNext()||ngDisabled}" class="pagination-next"><a href ng-click="selectPage(page + 1, $event)">{{::getText(\'next\')}}</a></li>\n  <li ng-if="::boundaryLinks" ng-class="{disabled: noNext()||ngDisabled}" class="pagination-last"><a href ng-click="selectPage(totalPages, $event)">{{::getText(\'last\')}}</a></li>\n</ul>\n')}])},function(e,t){"use strict";var n;e.exports=n={},n.find=function(e,t){for(var n=0;n<e.length;n++)if(t(e[n]))return e[n]},n.isObject=function(e){return e instanceof Object},n.keys=function(e){var t=0;for(var n in e)t++;return t},n.mapObject=function(e,t){for(var n in e)t(e[n],n)},n.has=function(e,t){for(var n in e)if(n===t)return!0;return!1}}]);