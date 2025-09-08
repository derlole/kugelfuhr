const { stringify } = require("flatted");

module.exports = (io) => {
  const express = require('express');
  const router = express.Router();

  router.get('/', (req, res) => {
      res.redirect('/dashboard');
  });

  router.get('/dashboard', (req, res) => {
    // CHANGE ME
    //   if (!req.session.userId) {
    //       return res.redirect('/login');
    //   }
    res.render('index', { title: 'Home', global: JSON.stringify(global.suits)  }); // index.ejs im views-Ordner
  });

  router.get('/login', (req, res) => {
    // CHANGE ME
    res.redirect('/dashboard');
    //res.render('login', { title: "Login"}); // login.ejs im views-Ordner

  });
  const users = [
    { id: 1, username: 'admin', password: '1' }
  ]; 
  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // Session speichern
      req.session.userId = user.id;
      req.session.username = user.username;
      res.redirect('/dashboard');
    } else {
      res.render('login', { title: "login", error: 'Falscher Benutzername oder Passwort' });
    }
  });
  router.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) return res.status(500).send('Fehler beim Logout');
      res.redirect('/login');
    });
  });

  
  return router;
}