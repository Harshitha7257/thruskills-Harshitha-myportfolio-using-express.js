var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ObjectId = require('mongodb').ObjectID;

let authenticate = function (req, res, next) {
  var loggedIn = req.session.isLoggedIn;
  console.log(loggedIn)
  if (loggedIn) {
    next()
  } else {
    res.redirect('/signin')
  }
}

let authenticated = function (req, res, next) {
  req.session.isLoggedIn = req.session.isLoggedIn ? true : false;
  console.log('authenticated', req.session)
  if (req.session.isLoggedIn) {
    res.locals.user = req.session.user;
    next();
  } else {
    next();
  }
}


router.use(authenticated);
router.use(authenticate);

/* GET home page. */
router.get('/',

  function (req, res, next) {
    res.render('index', { layout: 'layout_dashboard', title: 'My Portfolio Dashboard' });
  });

  
/* list of  Projects. */
router.get('/projects', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db('myportfolio');
    let d = new Date();
    //get the projects
    dbo.collection('projects').find({}).limit(10).toArray(function (err, projects) {
      if (err) throw err;
      console.log(JSON.stringify(projects));
      db.close();
      //get the blog
      res.render('projects/listProjects', { layout: 'layout_dashboard', projects: projects });
    })
  });
});


/* Create New Projects. */
router.get('/projects/new', function (req, res, next) {
  res.render('projects/createProject', { layout: 'layout_dashboard', 'title': 'Create new project' })
});

/* Submit create Projects. */
router.post('/projects/new', function (req, res, next) {
  let title = req.body.title;
  let image = req.body.image;
  let description = req.body.description;
  let project = { title, image, description };

  //write it to the DB
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db('myportfolio');
    let d = new Date();
    //get the projects
    dbo.collection('projects').insertOne(project, function (err, project) {
      if (err) throw err;
      console.log(JSON.stringify(project));
      db.close();
      //redirect to list of projects page 
      res.redirect('/projects')
    })
  });
});


/* Project details. */
router.get('/projects/:id', function (req, res, next) {
  //read the id from the path param
  let id = req.params.id;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("myportfolio");
    dbo.collection('projects').findOne({ _id: new ObjectId(id) }, function (err, projects) {
      if (err) throw err;
      console.log(JSON.stringify(projects));
      db.close();
      res.render('projects/projectDetails', { project: projects, layout: 'layout_dashboard' })
    })
  });
});


/* update Project. */
router.post('/projects/:id', function (req, res, next) {
  let id = req.params.id;
  let title = req.body.title;
  let image = req.body.image;
  let description = req.body.description;
  let project = { title, image, description };
  let updatedProject = { $set: project };

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("myportfolio");
    dbo.collection('projects').updateOne({ _id: new ObjectId(id) }, updatedProject, function (err, p) {
      if (err) throw err;
      console.log(JSON.stringify(p));
      db.close();
      res.render('projects/projectDetails', { project: project, layout: 'layout_dashboard', success: true })
    })
  });
});


/* delete Project. */
router.get('/projects/:id/delete', function (req, res, next) {
  let id = req.params.id;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("myportfolio");
    dbo.collection('projects').deleteOne({ _id: new ObjectId(id) }, function (err, p) {
      if (err) throw err;
      console.log(JSON.stringify(p));
      db.close();
      res.redirect('/projects')
    })
  });
});


/* list of  Blog. */
router.get('/blog', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db('myportfolio');
    let d = new Date();
    dbo.collection('blog').find({}).limit(10).toArray(function (err, blog) {
      if (err) throw err;
      console.log(JSON.stringify(blog));
      db.close();
      //get the blog
      res.render('blog/listofBlog', { layout: 'layout_dashboard', blog: blog });
    })
  });
});


/* Create New Blog. */
router.get('/blog/new', function (req, res, next) {
  res.render('blog/createBlog', { layout: 'layout_dashboard', 'title': 'Create new Blog' })
});


/* Submit create Blog. */
router.post('/blog/new', function (req, res, next) {
  let title = req.body.title;
  let image = req.body.image;
  let description = req.body.description;
  let project = { title, image, description };

  //write it to the DB
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db('myportfolio');
    let d = new Date();
    //get the blog
    dbo.collection('blog').insertOne(project, function (err, blog) {
      if (err) throw err;
      console.log(JSON.stringify(blog));
      db.close();
      //redirect to list of blog page 
      res.redirect('/blog')
    })
  });
});


/* Blog details. */
router.get('/blog/:id', function (req, res, next) {
  //read the id from the path param
  let id = req.params.id;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("myportfolio");
    dbo.collection('blog').findOne({ _id: new ObjectId(id) }, function (err, blog) {
      if (err) throw err;
      console.log(JSON.stringify(blog));
      db.close();
      res.render('blog/blogDetails', { blog: blog, layout: 'layout_dashboard' })
    })
  });
});


/* update Blog. */
router.post('/blog/:id', function (req, res, next) {
  let id = req.params.id;
  let title = req.body.title;
  let image = req.body.image;
  let description = req.body.description;
  let blog = { title, image, description };
  let updatedBlog = { $set: blog };

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("myportfolio");
    dbo.collection('blog').updateOne({ _id: new ObjectId(id) }, updatedBlog, function (err, p) {
      if (err) throw err;
      console.log(JSON.stringify(p));
      db.close();
      res.render('blog/blogDetails', { blog: blog, layout: 'layout_dashboard', success: true })
    })
  });
});


/* delete Blog. */
router.get('/blog/:id/delete', function (req, res, next) {
  let id = req.params.id;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("myportfolio");
    dbo.collection('blog').deleteOne({ _id: new ObjectId(id) }, function (err, b) {
      if (err) throw err;
      console.log(JSON.stringify(b));
      db.close();
      res.redirect('/blog')
    })
  });
});


/* Contact Page. */
router.get('/contact', function (req, res, next) {
  res.render('contact', { layout: 'layout_dashboard' });
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
        let dbo = db.db("myportfolio");
        let d = new Date();
        let contact = { name, mobile, email, message: description, date_created: d, date_modified: d };
        dbo.collection('contact').insertOne(contact, function (err, contactObj) {
          if (err) throw err;
          console.log("1 document inserted. Id = " + contactObj._id);
          db.close();
          res.render('contact', { layout: 'layout_dashboard', success: true });
        })
      });
    }
  });


/* Subscribe page */
router.get('/subscribe', function (req, res, next){
  res.render('subscribe',{layout: 'layout_dashboard'});
});


/* Logout Page. */
router.get('/logout', function (req, res) {
  req.session.isLoggedIn = false;
  delete req.session.user;
  res.redirect('/signin')
});

module.exports = router;
