// YOUR CODE HERE:

class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
    this.rooms = [];
    this.newestRenderedMessageTimeStamp;
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

  fetch(roomname = null) {
    var dataRestrictions = {
      'limit': 100, 
      'order': '-createdAt',
    };

    var data2 = {
      'limit': 100, 
      'order': '-createdAt',
      'where': {"createdAt":{"$gte":{"__type":"Date","iso":"2017-12-09T05:31:15.126Z"}}}
    }
    
    $.ajax({
      context: this,
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      data: dataRestrictions,
      contentType: 'application/json',
      success: function (data) {
        var allmessage = data.results;
        // if the user has not selected a room, default into the room of the first message
        // this.newestRenderedMessageTimeStamp = allmessage[0].createdAt;
        console.log('fetch initated', allmessage.length); 
        for (var i = 0; i < allmessage.length; i++) {  
          if (!roomname && allmessage[i].roomname) {
            roomname = this.escapeHtml(allmessage[i].roomname);
            $("#roomList").val(roomname);            
          }

          var messageObject = allmessage[i];

          if (messageObject.roomname === roomname) {
            console.log(roomname);
            this.renderMessage(allmessage[i]);

            // Check to see if the messages are newer than our last Rendered
            // if (allmessage[i].createdAt > this.newestRenderedMessageTimeStamp) {
            // if (!this.newestRenderedMessageTimeStamp || allmessage[i].createdAt < this.newestRenderedMessageTimeStamp) {
              
            // }
  
            // console.log(allmessage[i].createdAt, this.newestRenderedMessageTimeStamp, allmessage[i].createdAt > this.newestRenderedMessageTimeStamp)
            // }    
          }
          this.renderRoomnames(messageObject.roomname);
        }
        this.newestRenderedMessageTimeStamp = data.results[0].createdAt;
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
    var username = this.escapeHtml(message.username);
    var user = '<span class="username">' + username + '</span>';
    var message = '<span>: ' + this.escapeHtml(message.text) + '</span>';
    var completeMessage = '<p class="fullchat" data-author="' + username + '">' + user + message + '</p>';


    $('#chats').append($(completeMessage).click(
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
    console.log('click registered! updated string');
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

  refresh(roomname) {
    app.clearMessages();
    app.fetch(roomname);
  }
}

var app = new App();

