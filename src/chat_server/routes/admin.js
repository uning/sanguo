

// login form route
app.get('/admin/useronline',auth.loadUser,function(req, res) {
  log.debug('params ',req.params); 
  res.render('admin/useronline', {
    locals: {
      uor: uor
      ,users: uor.getPage()
      ,user: req.currentUser
    }
  });

});


// login form route
app.get('/admin/banusers',auth.loadUser,function(req, res) {
  res.render('admin/banusers', {
    locals: {
      user: req.currentUser
    }
  });
});





app.get('/admin/sysnotice',auth.loadUser,function(req, res) {
  res.render('admin/sysnotice', {
    locals: {
      user: req.currentUser
    }
  });
});
