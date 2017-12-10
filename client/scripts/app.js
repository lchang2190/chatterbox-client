// YOUR CODE HERE:

class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
    this.rooms = [];
    this.mostRecentTimestamp = null;
  }

  init() {
    var oReq = new XMLHttpRequest();
    oReq.open('GET', this.server);

  }
  send(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent', message);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch(roomname = null) {
    var dataObject = {
      'limit': 100, 
      'order': '-createdAt'
    };

    // var data2 = {
    //   'limit': 100, 
    //   'order': '-createdAt',
    //   'where': {
    //     'createdAt':{
    //       "$gte":
    //         {
    //         "__type":"Date",
    //         "iso":"2017-12-09T05:31:15.126Z"
    //       }
    //     }
    //   }
    // }
    debugger;
    if (roomname || this.mostRecentTimestamp) {
      dataObject['where'] = {};
    }
    
    if (roomname && roomname !== 'default') {
      dataObject['where']['roomname'] = roomname;
    }

    if (this.mostRecentTimestamp) {
      dataObject['where']['createdAt'] = {
        '$gt': {
          '__type': 'Date',
          'iso': this.mostRecentTimestamp}
      };
    }

    
    $.ajax({
      context: this,
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      data: dataObject,
      contentType: 'application/json',
      success: function (data) { 
        debugger;
        this.mostRecentTimestamp = data.results && data.results[0] && data.results[0].createdAt;

        var allmessage = data.results;        
        for (var i = 0; i < allmessage.length; i++) {  
          // if the message has no username and no text, do not render
          if (allmessage[i].username || allmessage[i].text) {
            var escapedRoomname = this.escapeHtml(allmessage[i].roomname);
            this.renderRoomnames(escapedRoomname);
            // Within a room, restrict to latest 10 messages:

            if (roomname && (i < 10)) {
              this.renderMessage(allmessage[i]);    
            }
          }
          
        }
        
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
   
  }

  escapeHtml(string) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(string));
    return div.innerHTML;
  }

  clearMessages() {
    $('#chats').empty();
  }

  renderRoomnames(roomname) {
    // var roomName = this.escapeHtml(roomname);
    if (this.rooms.indexOf(roomname) === -1) {
      this.rooms.push(roomname);
      var roomSpan = '<option value ="' + roomname + '">' + roomname + '</option>';
      $('#roomList').append(roomSpan);
    }
  }
  
  renderMessage(message) {
    var username = this.escapeHtml(message.username);
    var user = '<span class="username">' + username + '</span>';
    var message = '<span>: ' + this.escapeHtml(message.text) + '</span>';
    var completeMessage = '<p class="fullchat" data-author="' + username + '">' + user + message + '</p>';

    $('#chats').prepend($(completeMessage).click(
      function() {
        app.handleUsernameClick(username);  
      } 
    ));
  }
  
  renderRoom(roomName) {
    $('#roomSelect').append('<div>' + roomName + '</div>');
  }

  handleUsernameClick(username) {
    $('#chats').find('[data-author=' + username + ']').toggleClass('bolded');
    /// console.log('click registered! updated string');
  }
  
  handleSubmit(username, text, roomname) {
    // build our message object
    var message = {
      username: username,
      text: text,
      roomname: roomname
    };
    this.send(message);
    this.fetch(roomname);
  }

  refresh() {
    //app.clearMessages();
    var roomname = $("#roomList").find(":selected").val();
  //   console.log('data refreshed');
    app.fetch(roomname);
  }
}

var app = new App();

