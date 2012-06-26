(function() {
	function toggleMessageBox(state) {
		var el = $('.chat-message');
		if (state == 'inactive') {
			if (el.hasClass('disabled'))
				return;
			el.removeClass('enabled');
			el.addClass('disabled');
			el.removeAttr('enabled');
			el.attr('disabled', 'disabled');
		} else {
			if (el.hasClass('enabled'))
				return;
			el.removeClass('disabled');
			el.addClass('enabled');
			el.removeAttr('disabled');
			el.attr('enabled', 'enabled');
		}
	}

	$(document).ready(function() {

		var hrefid = '#nav'+ window.location.pathname.replace(/\//g,"-");
		$(hrefid).css({background:'#00ff00'});

		// hook up submit events
		$('#submit-button').click(function() {
			var form = $(document.forms[0]);
			var validator = form.validate();
			if (validator.form())
				form.submit();
		});

		// manage flash messages
		function hideFlashMessages() {
			$(this).fadeOut();
		}
		setTimeout(function() {
			$('.flash').each(hideFlashMessages);
		}, 5000);
		$('.flash').click(hideFlashMessages);

		// check if we are showing the chat interface
		if ($('.chat-message').length > 0) {

			function message(from,msg){
				// append new message element
				elem = $('<li>')
				.html(
					  '</span><span class="name">' + from +
					  '</span>:<span class="message">&nbsp;' + msg + '</span>'
					  +'<span class="date">[' + new Date() + ']'
				);
				//$('#chat-messages').append(elem);
				elem.insertBefore($('#chat-messages li:first-child'));

			}

			var currentUsername = $('input[name="username"]').val();
			var currentUserid = $('input[name="userid"]').val();

			// set connection state
			message('System','Connecting to chat server...');
			socket = io.connect()
			socket.on('reconnect', function (e) {
				//$('#chat-messages').remove();
				message('System', 'Reconnected to the server');
				console.log(e)
			});

			socket.on('reconnecting', function () {
				message('System', 'Attempting to re-connect to the server');
			});

			socket.on('error', function (e) {
				message('System', e ? e : 'A unknown error occurred');
				console.log(e)
			});
			socket.on('login', function (e) {
				message('server-login',  JSON.stringify(e));
				console.log(e)
			});
			socket.on('offline', function (e) {
				message('server-offline',  JSON.stringify(e));
				console.log(e)
			});

			socket.on('connect', function(){
				//socket.send(jsonMsg)
				// set ui state
				$('.connection-state').html('Connected to chat server!');
				message('System', 'Connected to chat server!');
				toggleMessageBox('active');
			});

			socket.on('disconnect', function() {
				toggleMessageBox('inactive');
				$('.connection-state').html('Connection to chat server lost, retrying...');        
				socket = io.connect();
			});

			socket.on('connect_failed', function(e) {
				message('System', e ? e : ' connect_failed Connection to chat server failed');
			});

			socket.on('message', function(data){
				console.log('on message',data);
				message('received message',JSON.stringify(data))
				message(data._fn ,JSON.stringify(data.c))
			});

			


			// bind input event
			$('.chat-message').bind('keydown', function(e) {
				if (e.keyCode == 13) {
					var touids = $('input[name="touids"]').val();
					var msg = this.value;
					// send message to server
					jsonMsg = {
						c : msg
						,to: touids
					};
					//socket.send(JSON.stringify(jsonMsg));
					socket.emit('message',jsonMsg);
					message('me' ,msg)
					this.value = '';
				}
			});
		}
	});
})();
