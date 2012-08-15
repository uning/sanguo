

/**
 *
 * server 的通用配置代码
 *
 * @param app  {express()}
 * @param s    {configservice} 
 * @param comm {common} 
 *
 *
 */
module.exports = function(app){

	app.use(function(req, res, next){
		//console.log('!!! in helper.setLocals')
		res.locals.flashMessages = function(){
			var html = '';
			[ 'info', 'error' ].forEach(function(type) {
				var messages = req.flash(type);
				if (messages.length > 0) {
					html += new FlashMessage(type, messages).toHtml();
				}
			});
			return html;
		}
		res.locals.isLoggedIn = function(){
			return !!(req.currentUser)};
			next()
	});

	//生成flash html 的工具函数
	function FlashMessage(type, msgs) {
		this.type = type;
		this.messages = typeof msgs === String ? [msgs] : msgs;
	}
	
	FlashMessage.prototype = {
		getIcon: function() {
			switch (this.type) {
				case 'info':
					return 'ui-icon-info';
				case 'error':
					return 'ui-icon-error';
			}
		},    
		getStateClass: function() {
			switch (this.type) {
				case 'info':
					return 'ui-state-highlight';
				case 'error':
					return 'ui-state-error';
			}
		},    
		toHtml: function() {
			return '<div class="ui-widget flash">' +
				'<div style="padding: 0pt 0.7em;" class="' + this.getStateClass() + ' ui-corner-all">' +
				'<p><span style="float: left; margin-right: 0.3em;" class="ui-icon ' + this.getIcon() + '"></span>' +
				this.messages.join('<br />') + '</p>' +
				'</div></div>';
		}
	};

};
