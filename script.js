 (function() {
             var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
             window.requestAnimationFrame = requestAnimationFrame;
         })();
         
         var canvas = document.getElementById("canvas"),
             ctx = canvas.getContext("2d"),
             width = 800,
             height = 400;
         
         canvas.width = width;
         canvas.height = height;