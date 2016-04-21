/**
 * @desc 网站信息
 * @author yq
 * @date 216/3/17
 * */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var configSchema = new Schema({
    title:String,
    cooperate:String,//合作
});

var Config = mongoose.model('configs', configSchema);
module.exports = Config;