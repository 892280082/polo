/**
 * @desc 用户作品表
 * @author yq
 * @date 216/3/17
 * */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectid = require('objectid');

var PersonSchema = new Schema({
    name    : String,
    age     : Number,
    stories : [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

var Person = mongoose.model('Person', PersonSchema);
module.exports = Person;