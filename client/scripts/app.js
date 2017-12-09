// YOUR CODE HERE:

class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
    this.rooms = [];
    this.latestPull;
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
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch(roomname = 'default') {
    var dataRestrictions = {
      'limit': 100, 
      'order': '-createdAt',
    };

    // var data2 = {
    //   'limit': 100, 
    //   'order': '-createdAt',
    //   'where': {"createdAt":{"$gte":{"__type":"Date","iso":"2017-12-09T05:31:15.126Z"}}}
    // }
    
    $.ajax({
      context: this,
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      data: dataRestrictions,
      contentType: 'application/json',
      success: function (data) {
        this.latestPull = data.results[0].createdAt;
        var allmessage = data.results;
        for (var i = 0; i < allmessage.length; i++) {
          var messageObject = allmessage[i];

          if (roomname === 'default' || messageObject.roomname === roomname) {
            this.renderMessage(allmessage[i]);
          }
          this.renderRoomnames(messageObject.roomname);
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
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
    var roomName = this.escapeHtml(roomname);
    // console.log(roomName, roomName2);
    if (this.rooms.indexOf(roomName) === -1) {
      this.rooms.push(roomName);
      var roomSpan = '<option value ="' + roomName + '">' + roomName + '</option>';
      $('#roomList').append(roomSpan);
    }
  }
  
  renderMessage(message) {
    var user = '<span class="username">' + this.escapeHtml(message.username) + '</span>';
    var add = '<p>' + user + '<span>: ' + this.escapeHtml(message.text) + '</span></p>';
    $('#chats').append(add);
    // $('#main').append(user);

        
    $('#main').on('click', '.username', function(event) {
      app.handleUsernameClick();   
    });
  }
  
  renderRoom(roomName) {
    $('#roomSelect').append('<div>' + roomName + '</div>');
  }

  handleUsernameClick(username) {
    console.log('click registered!');
  }
  
  handleSubmit(username, text, roomname) {
    // build our message object
    var message = {
      username: username,
      text: text,
      roomname: roomname
    };
    this.send(message);
  }
}

var app = new App();

