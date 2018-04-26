  var store = require('store');
  //---------------------------------------------signup page call------------------------------------------------------
  exports.signup = function (req, res) {
      message = '';
      if (req.method == "POST") {
          var post = req.body;
          var name = post.user_name;
          var pass = post.password;
          var fname = post.first_name;
          var lname = post.last_name;
          var mob = post.mob_no;
          var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";
          var query = db.query(sql, function (err, result) {
              message = "Succesfully! Your account has been created.";
              res.render('dashboard.ejs', {
                  message: message
              });
          });
      }
      else {
          res.render('signup');
      }
  };
  //-----------------------------------------------login page call------------------------------------------------------
  exports.login = function (req, res) {
      var message = '';
      var sess = req.session;
      //console.log(store);
      if (req.method == "POST") {
          var post = req.body;
          var name = post.user_name;
          var pass = post.password;
          var sql = "SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='" + name + "' and password = '" + pass + "'";
          db.query(sql, function (err, results) {
              if (results.length) {
                  req.session.userId = results[0].id;
                  req.session.user = results[0];
                  res.redirect('/home/dashboard');
              }
              else {
                  message = 'Wrong Credentials.';
                  res.render('index.ejs', {
                      message: message
                  });
              }
          });
      }
      else {
          res.render('index.ejs', {
              message: message
          });
      }
  };
  //-----------------------------------------------dashboard page functionality----------------------------------------------
  exports.dashboard = function (req, res, next) {
      var user = req.session.user
          , userId = req.session.userId;
      if (userId == null) {
          res.redirect("/login");
          return;
      }
      var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
      db.query(sql, function (err, results) {
          res.render('dashboard.ejs', {
              user: user
          });
      });
  };
  //------------------------------------logout functionality----------------------------------------------
  exports.logout = function (req, res) {
      // req.session.destroy(function (err) {
      //     res.redirect("/login");
      // })

      req.session = null;
      res.redirect("/login");
  };
  //--------------------------------render user details after login--------------------------------
  exports.profile = function (req, res) {
      var userId = req.session.userId;
      if (userId == null) {
          res.redirect("/login");
          return;
      }
      var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
      db.query(sql, function (err, result) {
          res.render('profile.ejs', {
              data: result
          });
      });
  };

  //---------------------------------edit users details after login----------------------------------
  exports.editprofile = function (req, res) {
      var userId = req.session.userId;
      if (userId == null) {
          res.redirect("/login");
          return;
      }
      var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
      db.query(sql, function (err, results) {
          res.render('edit_profile.ejs', {
              data: results
          });
      });
  };
  var nodemailer = require("nodemailer");
  var fs = require('fs');
  var Papa = require('papaparse');

  //--------------------------------render file upload --------------------------------
  exports.uploadfiles = function (req, res) {
      message = {};
      if (req.method == "POST") {
          if (!req.files) return res.status(400).send('No files were uploaded.');
          // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
          let sampleFile = req.files.file;
          let blah = req.files.file.name;
          // Use the mv() method to place the file somewhere on your server
          sampleFile.mv(__dirname + '/uploads/' + blah, function (err) {
              if (err) return res.status(500).send(err);
              //  console.log(res);
              //res.send('File uploaded!');
              //res.render('uploadfiles.ejs');
          });
          var csvParser = require('csv-parse');
          //var file = req.body ;
          //console.log(file);
          console.log(__dirname + '/uploads/' + blah);
          var temp_file_name = __dirname + '/uploads/' + blah;
          filePath = temp_file_name;
          console.log(filePath)
          //var content = fs.readFileSync(temp_file_name, "utf8");

          //console.log(content);

          fs.readFile(filePath, {
              encoding: 'utf-8'
          }, function (err, csvData) {
              if (err) {
                  console.log(err);
              }
              csvParser(csvData, {
                  delimiter: ','
              }, function (err, data) {
                  if (err) {
                      console.log(err);
                  }
                  else {
                      var content = fs.readFileSync(temp_file_name, "utf8");
                      Papa.parse(content, {
                        header: false,
                        newline: "",
                        quoteChar: '"',
                        skipEmptyLines: true,
                        escapeChar: '"',
                        delimiter:",",
                        dynamicTyping: false,
                        newline: "↵",
                        complete: function(results) {
                          message = results.data;
                        }
                      });

                      if(message){
                        var sql = "INSERT INTO `user_form_data`(`campus`, `accomodation`, `shopping`, `internet` ,`club` , `status` ) VALUES ? " ;

                        var query = db.query(sql, [message] , function (err, result) {
                        console.log(err);
                        var success = "Succesfully! Your account has been created.";
                        });
                      }
                      res.render('uploadfiles.ejs', message);


                  }
              });
          });


      }
      else {
          res.render('uploadfiles.ejs', message);
      }
  };

  exports.editPage = function(req, res){

      message = '' ;
       if(req.method == "GET"){
        var sql = "SELECT *  FROM `user_form_data` where status= '1' limit 5";
          console.log(sql);
          db.query(sql, function (err, result) {
              if (result.length) {
                  message =result;
                  res.render('editPage', message);
              }
              else{
                  message = '';
                  res.render('editPage', message);
              }
          });
       }
      else{
          var a = req.body ;
          if(a.approve){
              var sql = "UPDATE `user_form_data` SET `campus`="+a.select+", `accomodation`='"+a.accomodation+"' , `shopping`='"+a.shopping+"', `internet`='"+a.internet+"', `club`='"+a.club+"', `status` = '2' WHERE `user_form_data`.`id` =" +a.hidden_field ;
              console.log(sql);
              var query = db.query(sql, function (err, result) {
                message ="approved" ;
                      res.render('editPage');
                   //res.redirect('/home/dashboard/campuslife');
                        });
          }
          else{
                message = '';
                res.render('editPage', message);
          }

      }
  }

  //--------------------------------end file upload --------------------------------
  //--------------------------------render contact details--------------------------------
  exports.contact = function (req, res) {
      message = '';

      //const sendmail = require('sendmail')();
      if (req.method == "POST") {
          var post = req.body;
          var hidden = post.hiddenValue ;
          var selectList = post.select;
          var accomodation = post.accomodation;
          var shopping = post.shopping ;
          var internet = post.internet ;
          var clubs = post.club;
          var userId = req.session.user.id;
          console.log("sdfsd", userId);
          console.log(post);

          message = post ;
          //add to DB
          if(message){
              var id=0;
                        var sql = "INSERT INTO `user_form_data`(`campus`, `accomodation`, `shopping` , `internet`, `club`, `status` ) VALUES ('" + selectList + "','" + accomodation + "','" + shopping + "','" + internet + "','" + clubs + "','" + 1 + "')";
                        ;

                        var query = db.query(sql, function (err, result) {
                        //console.log(result.insertId);
                          //id = result.insertId ;
                        var success = "Succesfully! data added";
                        });
              const output = `
                    <p>you have a new contact request</p>
                    <h3>Contact Form</h3>
                    <ul>
                      <li>New form submission!</li>
                    </ul>`
          let transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com'
              , port: 587
              , secure: false, // true for 465, false for other ports
              auth: {
                  user: 'ritinternationalhelper@gmail.com', // generated ethereal user
                  pass: 'boombox123' // generated ethereal password
              }
              , tls: {
                  rejectUnauthorized: false
              }
          });
          // setup email data with unicode symbols
          let mailOptions = {
              from: req.body.email, // sender address
              to: "ritinternationalhelper@gmail.com", // list of receivers
              subject: 'Node Contact Request', // Subject line
              text: 'Hello world?', // plain text body
              html: output // html body
          };
          // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
              res.render('contact', {
                  message: 'Email has been sent!'
              });
          });

          //res.render('contact');

              //res.render('contact');
              //res.render('editPage' , message);

      }


  //        var tableToCsv = require('node-table-to-csv');
  //
  //var htmlTable =
  //
  //    ` <table>
  //                    <tr><td>` + fname + `</td>
  //                    <tr><td>Email :` + lname + `</td></tr>
  //
  //                  </table>`
  //csv = tableToCsv(htmlTable);
  //
  //console.log(csv);
  //        message = [csv] ;
  //
  //        res.render('contact', message);
  //        csv.mv(__dirname + '/sample/', function (err) {
  //            if (err) return res.status(500).send(err);
  //            console.log(err);
  //            //  console.log(res);
              //res.send('File uploaded!');
              //res.render('uploadfiles.ejs');
  //        });


      }
      else {
          res.render('contact');
      }
  };
  //--------------------------------render prearrival details--------------------------------
  exports.dashboard.prearrival = function (req, res) {
      console.log("prearrival");
      res.render('prearrival.ejs');
  };
  //--------------------------------render postarrival details--------------------------------
  exports.dashboard.postarrival = function (req, res) {
      if (req.method == "POST") {
          var post = req.body;
          res.render('postarrival.ejs');
          var aa = store.set('some', JSON.stringify(post));
      }
      else {
          var message = '';
          console.log("get" + store.get('some'));
          var getStorage = store.get('some');
          if (getStorage) {
              message = getStorage;
              res.render('postarrival.ejs', {
                  message: message
              });
          }
          res.render('postarrival.ejs');
      }
  };
  //--------------------------------render immigration details--------------------------------
  exports.dashboard.immigration = function (req, res) {
      console.log("immigration");
      res.render('immigration.ejs');
  };
  //--------------------------------render maps details--------------------------------
  exports.dashboard.maps = function (req, res) {
      console.log("maps");
      res.render('maps.ejs');
  };
  //--------------------------------render health details--------------------------------
  exports.dashboard.health = function (req, res) {
      console.log("health");
      res.render('health.ejs');
  };
  //--------------------------------render dining details--------------------------------
  exports.dashboard.dining = function (req, res) {
      message = '';
      if (req.method == "POST") {
          var post = req.body;
          console.log(req.body);
          var country_id = post.select_country;
          console.log(country_id);
          var sql = "SELECT id, name FROM `country_dining` WHERE `id`='" + country_id + "'";
          console.log(sql);
          db.query(sql, function (err, messages) {
              if (messages.length) {
                  country_id = messages[0].id;
                  res.render('dining', {
                      messages: messages
                  });
              }
              else {
                  message = 'Please choose somthing';
                  res.render('/home/dashboard/dining.ejs');
              }
          });
      }
      else {
          res.render('dining.ejs');
      }
  };
  exports.dining = function (req, res) {
      var messages = '';
      res.render('dining', {
          messages: messages
      });
  };
  //--------------------------------render transport details--------------------------------
  exports.dashboard.transport = function (req, res) {
      res.render('transport.ejs');
  };
  //--------------------------------render campuslife details--------------------------------
  exports.dashboard.campuslife = function (req, res) {
  message = '';
      var sql = "SELECT * FROM user_form_data where status =2"
      var query = db.query(sql, function (err, result) {
          console.log(result);
          message = result ;
              res.render('campuslife.ejs', message);

      //var success = "Succesfully! Your account has been created.";

      });
  };
  //--------------------------------render events details--------------------------------
  exports.dashboard.events = function (req, res) {
      console.log("postarrival");
      res.render('events.ejs');
  };
