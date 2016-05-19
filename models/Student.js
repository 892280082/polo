/**
 * @description  学生集合
 */



var mongoose = require('mongoose');
var _ = require('underscore');
var Schema = mongoose.Schema;
	
var studentSchema = new Schema({
	name:String,
	age:Number,
	likes:[String],
	address:{
		province:String,
		city:String,
	},
    creatTime:{type:Date,default:Date.now}
});


studentSchema.statics.setCity = function(_id,cityname,callback){
	this.update({_id:_id},{'address.city':cityname},(err)=>{
		callback(err);
	});
};


var Student = mongoose.model('students', studentSchema);

module.exports = Student;

