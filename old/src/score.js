const query = window.location.search;
const urlparams = new URLSearchParams(query);
const wpm = urlparams.get('wpm');
const mode = urlparams.get('mode');
document.getElementById('wpm').innerHTML = wpm;
const json = require('./data.json');
const render = require('./render')
const fs = require('fs');

let time_limit = 5;
let time_elapsed = 0;
let time_left = time_limit;

function newgame() {
    window.location = "index.html?mode="+mode;
}