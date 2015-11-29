
/*
 * GET home page.
 */

var crypto = require('crypto'),
    User = require('../models/user.js');

exports.index = function(req, res){
 res.render('index', { title: 'Index' });
 };

 exports.login = function(req, res){
 res.render('login', { title: '用户登陆'});
 };


 exports.doLogin = function(req, res){
     var name = req.body.username,
         password = req.body.password;
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
         if (user.password != password) {
             req.session.error = "密码错误！";
             return res.redirect('/login');
         }
         //用户名密码都匹配后，将用户信息存入session
         req.session.user = user;
         req.session.success = "登录成功！";
         res.redirect('/home');
     });
 };


 exports.logout = function(req, res){
 req.session.user=null;
 res.redirect('/');
 };

 exports.home = function(req, res){
 res.render('home', { title: 'Home'});
 };


