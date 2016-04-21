/**
 * @desc 会所表
 * @author yq
 * @date 2016/4/17
 * */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var salonSchema = new Schema({
    title:String,
    imgUrl:String,
    weixin:String,
    tel:String,
    content:String,
    address:String,
    state:{type:Number,dafault:0},// 1 展示 0 不展示
    sort:{type:Number,default:0},
    creatTime:{type:Date,default:Date.now}
});

var Salon = mongoose.model('salons', salonSchema);
module.exports = Salon;