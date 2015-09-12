define([
  'underscore',
  'jquery',
  'backbone',
], function(_, $, Backbone) {

  var AppView = Backbone.View.extend({

    el: 'body', 

    initialize: function() {
      var canvas = document.getElementById('c');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      var context = canvas.getContext('2d');
      context.fillStyle = '#000';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  
  });

  return AppView;

});
