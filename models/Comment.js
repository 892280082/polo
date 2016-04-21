/**
 * @desc 会所表
 * @author yq
 * @date 2016/4/17
 * */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    name:String,
    tel:String,
    content:String,
    sort:{type:Number,default:0},
    creatTime:{type:Date,default:Date.now}
});

var Comment = mongoose.model('commetns', commentSchema);
module.exports = Comment;