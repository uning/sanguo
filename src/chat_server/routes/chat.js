



app.get('/chat', auth.loadUser, function(req, res, next) {
  // render chat interface
  res.render('chat/index', { locals:
    {
      user: req.currentUser
    }
  });
});


