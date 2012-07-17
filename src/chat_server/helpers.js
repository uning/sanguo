exports.helpers = {
  nameAndVersion: function(name, version) {
    return name + ' v' + version;
  },
  
  appName: 'chat-server',
  version: '0.01'
};

// flash message class
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

exports.dynamicHelpers = {
  flashMessages: function(req, res) {
    var html = '';
    [ 'info', 'error' ].forEach(function(type) {
      var messages = req.flash(type);
      if (messages.length > 0) {
        html += new FlashMessage(type, messages).toHtml();
      }
    });
    return html;
  },
  isLoggedIn: function(req, res){
      return !!(req.currentUser);
  }
  
  /*
  ,helpContent: function(req, res){
    var markdown = require('markdown').markdown,fs = require('fs')
	  var md = fs.readFileSync(app.set('views') + '/readme.md','utf-8')
		return markdown.toHTML(md)
  }
  */


};
