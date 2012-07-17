doctype 5
html ->
  head ->
	  meta character:'utf-8'
	  title "#{@title or ''} -- chat server"
	  link rel:'stylesheet', href:'/css/core.css'
	  link rel:'stylesheet', href:'/css/form.css'
	  link rel:'stylesheet', href:'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.7/themes/base/jquery-ui.css'
	  script type:'text/javascript', src:'https://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js'
	  script type:'text/javascript', src:'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.7/jquery-ui.min.js'
	  script type:'text/javascript', src:'/js/jquery.validate.pack.js'
	  script type:'text/javascript', src:'/socket.io/socket.io.js'
	  script type:'text/javascript', src:'/js/json2.js'
  body->
    div '#content', ->
		#{@flashMessages}
        != body    
		div '.logindiv',style:'float:right', -> 
			if isLoggedIn
				#{@user.name}, 
				a '.ui-button',href:'/logout',-> Logout
			else
				a '.ui-button',href:'/') Login
    script type:'text/javascript', src:'/js/core.js'
