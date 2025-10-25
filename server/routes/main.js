const { stringify } = require("flatted");

module.exports = (io) => {
  const express = require('express');
  const router = express.Router();
  function getPlayerFromColor(color, gameIndex){
    var game = global.games[gameIndex]
    if(!game) return null
    switch (color.toLowerCase()) {
      case 'red':
        return game.player1red
      case 'blue':
        return game.player2blue;
      case 'yellow':
        return game.player3yellow;
      case 'green':
        return game.player4green;
      default:
        return null;
    }
  }
  router.get('/', (req, res) => {
    res.redirect('/dashboard');
  });

  router.get('/dashboard', (req, res) => {
    // Uncomment to require login:
    // if (!req.session.userId) {
    //   return res.redirect('/login');
    // }

    // Extract query parameters
    const { color, gameIndex, name } = req.query;
    var joinMethod
    if((!color)||(!gameIndex)||(!name)){
      return res.redirect('/index')
    }
    var rejoinablePlayer = getPlayerFromColor(color, gameIndex)
    if(!rejoinablePlayer){
      return res.redirect('/index')
    }
    var rejoinablePlayerName = rejoinablePlayer.name
    if(rejoinablePlayerName){
      if(rejoinablePlayerName !== name){
        return res.redirect('/index')
      }
      joinMethod = 'rejoin'
    }else{
      joinMethod = 'join'
    }

    res.render('index', {
      title: 'Kugelfuhr',
      global: JSON.stringify(global.suits),
      data: JSON.stringify({
        color,
        gameIndex,
        name,
        mehtod: joinMethod
      }),
      gameName: global.games[gameIndex].name
    }); 
  });
   router.get('/index', (req, res) => {
    res.render('logonGame', { title: 'Kugelfuhr', globalGames: JSON.stringify(global.games)}); // index.ejs im views-Ordner
  });
  router.get('/login', (req, res) => {
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
  router.get('/win', (req, res) => {
    return res.render('win', {title: ":D"})
  })
  router.get('/serverRestartError', (req, res) => {
    return res.render('restartError', {title: "sorry about that"})
  })

  return router;
}