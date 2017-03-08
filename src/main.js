import App from './App.js';

(function() {
    var html = document.documentElement;
    var canvas = document.getElementById("myCanvas");
    var app;

    canvas.width = html.clientWidth * 0.5;
    canvas.height = html.clientHeight * 0.7;

    app = new App(canvas);
    app.init();
})();