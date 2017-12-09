// YOUR CODE HERE:
//

class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';

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

  fetch() {
    $.ajax({
      context: this,
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      //data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        var allmessage = data.results;
        for (var i = 0; i < 10; i++) {
          this.renderMessage(allmessage[i]);
        }
        
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  clearMessages() {
    $('#chats').empty();
  }
  
  renderMessage(message) {
    var user = '<p class="username">' + message.username + '</p>';
    var add = '<span>' + user + '<p>' + message.text + '</p></span>';
    $('#chats').append(add);
    $('#main').append(user);
    // add any new room-names to our roomname array
    var roomName = message.roomname;
    var roomSpan = '<option value ="' + roomName + '">' + roomName + '</option>';

    // CHECK IF NODE EXISTS, only add if not! TODO: 
    $('#roomList').append(roomSpan);
    

        
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
  
  handleSubmit() {
    console.log('form submission was hit!');
  }
}

var app = new App();

