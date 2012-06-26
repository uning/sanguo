

// login form route
app.get('/admin/useronline',auth.loadUser,function(req, res) {
  res.render('admin/useronline', {
    locals: {
      users: uor._currentUsers
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
