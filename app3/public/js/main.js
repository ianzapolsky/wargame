require.config({
  shim: {
    backbone: {
      deps: ['jquery', 'underscore']
    }
  },
  paths: {
    "backbone": "vendor/backbone",
    "jquery": "vendor/jquery.min",
    "socketio": "vendor/socket.io",
    "underscore": "vendor/underscore.min"
  }
});
