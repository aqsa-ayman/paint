"use strict";

function press(element) {

  element = document.getElementById(element);
  console.log(element);

  // if there are no elements, we're done
  if (!element) { return; }

  // add class to chosen element
  element.classList.add('pressed');
}

function depress() {
  var actions = ['draw', 'erase'];

  for (var i in actions) {
    if (document.getElementById(actions[i]).classList.contains('pressed')) {
      // this is the element we want to depress
      document.getElementById(actions[i]).classList.remove('pressed');
      break;
    } else {
      continue;
    }
  }
  
}

function saveImage() {
  var link = document.createElement("a");
  try {
    link.href = canvas.toDataURL();
    console.log(link);
  }
  catch (error) {
    alert("Can't save: " + error.toString());
  }
  link.addEventListener("mouseover", saveImage);
  link.addEventListener("focus", saveImage);
  window.open(link);
}


// create canvas and context which has the properties we need 
var canvas = document.getElementById("canvas");
var cx = canvas.getContext("2d");

// set thickness of line
var radius = document.getElementById("thickness").value;
cx.lineWidth = 2*radius;

// set up variable that will tell us when to draw the line and when to stop
var dragging;

var colour = document.getElementById("pickColour");
colour.addEventListener("change", function() {
  cx.fillStyle = colour.value;
  cx.strokeStyle = colour.value;
});

// listen for any changes in the select thickness menu 
var select = document.querySelector("select");
select.addEventListener("change", function() {
  radius = document.getElementById("thickness").value;
  cx.lineWidth = 2*radius;
});

// main drawing function
var point = function(e) {
  if (dragging) {
    cx.lineWidth = 2*radius;
    cx.lineTo(e.offsetX, e.offsetY);
    cx.stroke();
    cx.beginPath();
    // 0 is our beginning angle and 2*PI is our end angle to draw a little circle
    // together these little circles make our line 
    cx.arc(e.offsetX, e.offsetY, radius, 0, 2*Math.PI);
    cx.fill();
    // to connect these circles if we draw too fast we connect them with lines
    cx.beginPath();
    cx.moveTo(e.offsetX, e.offsetY);
  }
  // listen for when to stop drawing
  canvas.addEventListener("mouseup", function(event) {
    if (event) {
      dragging = false;
      // so our new line doesn't start from our old line we begin again
      cx.beginPath();
    } 
  });
};

canvas.addEventListener("mousedown", function(event) {
  dragging = true;
  point(event);
  canvas.addEventListener("mousemove", point);
});

function erase() {
  depress();
  press('erase');
  cx.globalCompositeOperation = "destination-out";
}

function reDraw() {
  depress();
  press('draw');
  cx.globalCompositeOperation = "source-over";
}

function clearCanvas() {
  cx.beginPath();
  cx.clearRect(0, 0, canvas.width, canvas.height);
}

