var express = require('express');
var router = express.Router();

let users = [
  { email: 'h@h.com', password: 'abcd', name: 'Harshitha' },
]


  router.get('/', function (req, res) {
    res.render('signin', { title: 'Sign in' })
  });

router.post('/', function (req, res) {
  let { email, password } = req.body;
  console.log(email);
  console.log(password);
  if (email != undefined && email !== '' && password != undefined && password !== '') {
    // get the user from DB based on the given details
    users.forEach((u) => {
      if (u.email === email && u.password === password) {
        req.session.isLoggedIn = true;
        req.session.user = u;
        res.redirect('/')
      }
    })
  } else {
    // validate inputs from request
    res.render('signin', { title: 'Sign in' });
  }
});

module.exports = router;
 