
/*
 * GET home page.
 */

var crypto = require('crypto'),
    User = require('../models/user.js');

module.exports = function(app) {
    app.get("/", function (req, res) {
        res.render('index', { title: "主页"});
    });

    app.get("/login", notAuthentication);
    app.get("/login", function (req, res) {
        res.render('login', { title: "用户登录"});
    });

    app.post("/login", notAuthentication);
    app.post("/login", function (req, res) {
        var name = req.body.username,
            password = req.body.password,
            md5 = crypto.createHash('md5'),
            md5_password = md5.update(password).digest('hex');
        if (name == "" || password == "") {
            req.session.error = "请不要留白！";
            return res.redirect('/login');
        }

        User.get(name, function(err, user) {
            if (!user) {
                req.session.error = "用户不存在！";
                return res.redirect('/login')    ;//用户不存在就跳转回登录
            }
            //检查密码是否一致
            if (user.password != md5_password) {
                req.session.error = "密码错误！";
                return res.redirect('/login');
            }
            //用户名密码都匹配后，将用户信息存入session
            req.session.user = user;
            req.session.success = "登录成功！";
            res.redirect('/home');
        });
    });

    app.get("/logout", authentication);
    app.get("/logout", function (req, res) {
        req.session.user = null;
        res.redirect('/');
    });

    app.get("/home", authentication);
    app.get("/home", function (req, res) {
        res.render('home', {
            title: 'Home'
            //username: req.session.username.toString()
        });
    });

    //这里是权限控制，通过检测session是否存在，对相关页面进行强制重定向
    function authentication (req, res, next) {
        if (!req.session.user) {
            req.session.error = '请登录';
            return res.redirect('/login');
        }
        next();
    }
    function notAuthentication (req, res, next) {
        if (req.session.user) {
            req.session.error = '已登录';
            return res.redirect('/home');
        }
        next();
    }
}


/*
 exports.index = function(req, res){
 res.render('index', { title: 'Index' });
 };

 exports.login = function(req, res){
 res.render('login', { title: '用户登陆'});
 };

 exports.doLogin = function(req, res){
 var user={
 username:'admin',
 password:'admin'
 }

 if(req.body.username===user.username && req.body.password===user.password){
 req.session.user=user;
 return res.redirect('/home');
 } else {
 req.session.error='用户名或密码不正确';
 return res.redirect('/login');
 }

 };

 exports.logout = function(req, res){
 req.session.user=null;
 res.redirect('/');
 };

 exports.home = function(req, res){
 res.render('home', { title: 'Home'});
 };
 */

