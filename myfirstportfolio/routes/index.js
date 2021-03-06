var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ObjectId = require('mongodb').ObjectID;
let userloggedin=false;
let user={}


//get homepage
router.get('/', function(req, res, next){
  res.render('homepage');
});

//Resume
router.get('/resume', function(req, res, next){
  res.render('resume');
});




/* GET home page. */
router.get('/portfolio', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db('myportfolio');
    let d = new Date();
    //get the projects
    dbo.collection('projects').find({}).limit(3).toArray(function (err, projects) {
      if (err) throw err;
      console.log(JSON.stringify(projects));
      //get the blog
      dbo.collection('blog').find({}).limit(3).toArray(function (err, blog) {
        if (err) throw err;
        console.log(JSON.stringify(blog));
        db.close();
        res.render('index', { projects: projects, blog: blog });
      })
    })
  });
});
// subscribe
router.post('/subscribe', function (req, res) {
  let email = req.body.email;
  console.log(email);
  if (email && email !== '') {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      let dbo = db.db("myportfolio");
      let d = new Date();
      let newsletter = { email, date_created: d };
      dbo.collection('newsletter').insertOne(newsletter, function (err, obj) {
        if (err) throw err;
        // get the projects
        dbo.collection('projects').find({}).limit(3).toArray(function (err, projects) {
          if (err) throw err;
          console.log(JSON.stringify(projects));
          // get the posts
          dbo.collection('posts').find({}).sort({ 'date_created': -1 }).limit(3).toArray(function (err, blog) {
            if (err) throw err;
            console.log(JSON.stringify(blog));
            db.close();
            res.render('homepage', { projects: projects, blog: blog, success: true })
          })
        })
      })
    });
  }
});

/* GET Project page. */
router.get('/projects', function (req, res, next) {

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db('myportfolio');
    dbo.collection('projects').find({}).toArray(function (err, data) {
      if (err) throw err;
      console.log(JSON.stringify(data));
      db.close();
      res.render('projects', { title: 'Express hbs', projects: data });
    })
  });
});

/* GET Project-details page. */
router.get('/projects/:id', function (req, res) {
  let id = req.params.id;
  console.log('id --- > ', id);

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("myportfolio");
    dbo.collection('projects').findOne({ _id: new ObjectId(id) }, function (err, projects) {
      if (err) throw err;
      console.log(JSON.stringify(projects));
      db.close();
      res.render('project-details', { data: projects })
    })
  });
})

/* GET Blog page. */
router.get('/blog', function (req, res, ) {

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db('myportfolio');
    let d = new Date();
    dbo.collection('blog').find({}).toArray(function (err, details) {
      if (err) throw err;
      console.log(JSON.stringify(details));
      db.close();
      res.render('blog', { blog: details });
    })
  });
});


/* GET Blog-details page. */
router.get('/blog/:id', function (req, res) {
  let id = req.params.id;
  console.log('id --- >', id);

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("myportfolio");
    dbo.collection('blog').findOne({ _id: new ObjectId(id) }, function (err, blog) {
      if (err) throw err;
      console.log(JSON.stringify(blog));
      db.close();
      res.render('blog-details', { details: blog });
    })
  });
});

/* GET Contact page. */
router.get('/contact', function (req, res) {
  res.render('contact');
});

router.post('/contact', [
  check('email').isEmail().withMessage('Please enter a valid email id'),
  check('mobile').isLength({ min: 10 }).withMessage('Mobile  number must be atleast 10 characters')
],
  function (req, res) {
    const errors = validationResult(req);
    console.log(JSON.stringify(errors))
    if (!errors.isEmpty()) {
      var messages = [];
      errors.errors.forEach(function (err) {
        console.log(JSON.stringify(err))
        messages.push(err.msg)
      })
      let name = req.body.name;
      let mobile = req.body.mobile;
      let email = req.body.email;
      let description = req.body.description;
      res.render('contact', { errors: true, messages: messages, name, mobile, email, description });
    } else {
      // read the values and save it in the DB
      let name = req.body.name;
      let mobile = req.body.mobile;
      let email = req.body.email;
      let description = req.body.description;

      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db("users");
        let d = new Date();
        let contact = { name, mobile, email, message: description, date_created: d, date_modified: d };
        dbo.collection('contact').insertOne(contact, function (err, contactObj) {
          if (err) throw err;
          console.log("1 document inserted. Id = " + contactObj._id);
          db.close();
          res.render('contact', { success: true });
        })
      });
    }
  });

module.exports = router;

