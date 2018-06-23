console.log('HELLO THERE!?');
var game = require('./game.js');

window.setup = () => game.setup();
window.draw = () => game.draw();
window.mouseclicked = () => game.touched(mouseX, mouseY);
window.touchStarted = () => game.touched(mouseX, mouseY);

console.log('Initialized..?');