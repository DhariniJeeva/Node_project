/**
* Module dependencies.
*/
var cookieSession = require('cookie-session')
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
  var multer = require('multer');
//  var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
var session = require('express-session');
var app = express();
const fileUpload = require('express-fileupload');
//app.use(express.bodyParser());
var mysql  = require('mysql');
var store = require('store');

// Load the bcrypt module





 var connection = mysql.createConnection({
               host     : 'us-cdbr-iron-east-05.cleardb.net',
               user     : 'b320cc1ae3b491',
               password : '54a71929',
               database : 'heroku_de7fc22e5a8a029'
             });
//
//var connection = mysql.createConnection({
//                host : 'localhost',
//                port : '8889',
//                user : 'root',
//                password : 'root',
//                database : 'mydb123'
//});
// connection.connect();
//
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});
global.db = connection;
// pool.getConnection(function(err, connection) {
//   // Use the connection
//   connection.query('SELECT something FROM sometable', function (error, results, fields) {
//     // And done with the connection.
//     connection.release();
//
//     // Handle error after the release.
//     if (error) throw error;
//
//     // Don't use the connection here, it has been returned to the pool.
//   });
// });
setInterval(function () {
    db.query('SELECT 1');
}, 5000);
// all environments
//app.set('port', process.env.PORT);
//app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(session({
//               secret: 'keyboard cat',
//               resave: false,
//               saveUninitialized: true,
//               cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }
//             }))

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))


app.use(fileUpload());

app.get('/', routes.index);//call for main index page

app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post
app.get('/login', routes.index);//call for login page
app.post('/login', user.login);//call for login post
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/home/logout', user.logout);//call for logout
app.get('/home/profile',user.profile);//to render users profile
app.get('/contact',user.contact); //to contact the admin
app.post('/contact',user.contact); //to contact the admin
app.get('/uploadfiles', user.uploadfiles);
app.post('/uploadfiles', user.uploadfiles);
// app.post('/uploadfiles', function(req, res) {
//   if (!req.files)
//     return res.status(400).send('No files were uploaded.');
//
//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   let sampleFile = req.files.file;
//   console.log(sampleFile);
//
// let blah = req.files.file.name;
// console.log(blah);
//   // Use the mv() method to place the file somewhere on your server
//   sampleFile.mv( __dirname + '/uploads/blah', function(err) {
//     if (err)
//       return res.status(500).send(err);
//
//     res.send('File uploaded!');
//
//   });
// });

app.get('/home/dashboard/prearrival', user.dashboard.prearrival);

app.get('/home/dashboard/postarrival',  user.dashboard.postarrival);
app.post('/home/dashboard/postarrival',  user.dashboard.postarrival);
app.get('/home/dashboard/immigration', user.dashboard.immigration);
app.get('/home/dashboard/maps', user.dashboard.maps);
app.get('/home/dashboard/campuslife', user.dashboard.campuslife);
app.get('/home/dashboard/transport', user.dashboard.transport);
app.get('/home/dashboard/dining', user.dining);
app.post('/home/dashboard/dining', user.dashboard.dining);
app.get('/home/dashboard/health', user.dashboard.health);
app.get('/home/dashboard/events', user.dashboard.events);

app.get('/editPage' , user.editPage) ;

app.post('/editPage' , user.editPage) ;
//Middleware
//app.listen('port')

// var port = process.env.PORT || 7777;
// app.listen(port, function() {
//     console.log("Listening on " + port);
// });


// app.listen(process.env.PORT || 3000, function(){
//   console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
// });

const port = process.env.PORT || 7888;
app.listen(port, () => {
  console.log('Express server listening on port', port)
});
