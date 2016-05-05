/**
 * @desc 路由控制文件
 * @author yq
 * @date 2016/4/28
 *
 * key是nameSpace
 * value是路由文件,根目录为/router
 */

module.exports = {
    "/":"index",
    auth:"oAuth",//第三方登陆路由
    front:"front/index",//前台路由
    back:"back/index",//后台路由
}