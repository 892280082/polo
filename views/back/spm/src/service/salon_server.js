/**
 *@desc 提供用户数据处理接口
 *@auther yq
 *@API
 *
 * 1.doUserCommentParise                     -用户对文章一级评论的赞
 *
 */
angular.module('service.salon_server',[]).service("salon_server",["$http","mongoose"
    ,function($http,mongoose){
        this.Dao = mongoose.$init('/back/curdSalon');
        /**
         * @param _commentId {String} 一级回复ID
         * @param _replayId {String} 二级回复ID
         */
        this.doReplayPraise = function(_commentId,_replayId,callback){
            $http.post('/user/doReplayPraise',{_replayId:_replayId,_commentId:_commentId})
                .success(function(data){
                    data.err &&　console.log(data.err);
                    return callback(data.err,data.result);
                }).error(function(data){
                    alert("art_detail_server---->doReplayPraise:链接出错");
                })
        }

        /**
         * @param _commentId {String} 一级回复ID
         * @param _replayId {String} 二级回复ID
         */
        this.doReplayReport = function(_commentId,_replayId,callback){
            $http.post('/user/doReplayReport',{_replayId:_replayId,_commentId:_commentId})
                .success(function(data){
                    data.err &&　console.log(data.err);
                    return callback(data.err,data.result);
                }).error(function(data){
                    alert("art_detail_server---->doReplayReport:链接出错");
                })
        }

    }]);