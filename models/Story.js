/**
 * @desc 用户作品表
 * @author yq
 * @date 216/3/17
 * */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectid = require('objectid');

var StorySchema = new Schema({
    _creator : { type: Schema.Types.ObjectId, ref: 'Person' },
    title    : String,
    fans     : [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

var Story = mongoose.model('Story', StorySchema);
module.exports = Story;