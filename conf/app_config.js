/**
 * @desc app实例的主要配置对象
 * 		 express实例的域名,端口,上传路径
 * 		 mongodb数据库的配置
 * 		 视图模板的配置
 * 		 路由的控制
 * @auther yq
 * @time 2016/2/22
 */

module.exports = {
	/***
	 * @desc 配置app运行参数,debug模式下会打印配置信息
	 */
	main:{
		/**
		 * @desc true开发模式,系统错误将打印在浏览器端
		 * 		 false生产模式,系统错误抛出500页面
		 */
		model:true,
		debug:true,//是否开启debug模式,debug模式将打印系统插件连接信息
		root:"http://192.168.1.170:3000",//域名
		port:3000,//app端口
		uploadDir:'/upload',//配置文件上传目录,可设置相对和绝对目录
		winUploadDir:"D:/upload",
		uploadMaxSize:1000*1000*20
	},
	/**
	*@desc 配置mongodb数据库
	*/
	mongodb:{
		open:false,//是否连接数据库
		db:'newproject',//数据库名称 _local_test
		host:'localhost',//数据库地址
		port:27017,//端口
		cookieSecret:'yestart',//session加密
		sessionMaxAge:1000*60*60*24*30,//session生命周期
		logCollect:"polologs"
	},
	/**
	 * @desc 配置渲染模板
	 */
	view:{
		engine:'ejs',//使用的模板引擎
		relativePath:'views',//视图模板的相对项目根目录路径
		extName:'ejs',//视图文件的后缀名,开发时路径中不能出现.ejs否则将报404错误
		notFoundPage:'404.html',//配置404页面 根据relativePath路径判断
		errPage:'500.html'//错误页面
	}
};