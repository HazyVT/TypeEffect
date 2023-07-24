const json = require('./data.json');

let words = []
let typing = false;
let count = 0;
let time_limit = 30
let time_left = time_limit;
let time_elapsed = 0
var audio = new Audio("kp.mp3");
const query = window.location.search;
const urlparams = new URLSearchParams(query);
const mode = urlparams.get('mode');
console.log(mode);

let line1 = "";
let codeline = "";
let livefeed = "";
let wordcont = document.createElement('label');

function applySettings() {
    let body = document.body;
    let strength = json.settings[0]['crt-effect-strength'];
    console.log(strength);
    if (json.settings[0]['crt-effect']) {
        switch(strength) {
            case 0:
                body.className = "";
                break;
            case 1:
                body.className = "crt";
                break;
            case 2:
                body.className = "crt crt-text";
                break;
        }
    }
}

function rollNewWords() {
    if (mode == "TE Mode") {
        let wordnum =  Math.floor(Math.random() * json.words.length);
        let exword0 = document.getElementsByClassName('word0');
        let exword1 = document.getElementsByClassName('word1');
        let exword2 = document.getElementsByClassName('word2');
        words.shift();
        exword0[0].innerHTML = "<span></span>" + words[0];
        exword1[0].innerHTML = "<span></span>" + words[1];
        exword2[0].innerHTML = "<span></span>" + json.words[wordnum];
        words.push(json.words[wordnum]);
        console.log(words);
        count++;
        console.log(count);
        typing = false;
    } 
}

function adplay() {
    var audio = new Audio("kp.mp3");
    audio.volume = 0.1;
    audio.play();
}

function updateTimer() {
    if (time_left > 0) {
        time_left--;
        time_elapsed++;
        document.getElementById('timer').innerHTML = time_left;
        if (mode == "TE Mode") {
            let wpm = (count) * 2;
            document.getElementById('wpm').innerHTML = "WPM: " + wpm;
        } else if (mode == "MT Mode" || mode == "TR Mode") {
            let end = livefeed.indexOf('</span>');
            let sent = codeline.substring(6,end);
            let wpm = Math.floor(((sent.length / 5) / (time_elapsed / 60)));
            document.getElementById('wpm').innerHTML = "WPM: " + wpm;
        } 
    } else if (time_left == 0) {
        if (mode == "TE Mode") {
            let wpm = (count) * 2;
            document.getElementById('wpm').innerHTML = "WPM: " + wpm;
            time_left--;
            window.location = "score.html?wpm=" + wpm+"&mode="+mode;
        } else if (mode == "MT Mode" || mode == "TR Mode") {
            let end = livefeed.indexOf('</span>');
            let sent = codeline.substring(6,end);
            let wpm = Math.floor(((sent.length / 5) / (time_elapsed / 60)));
            document.getElementById('wpm').innerHTML = "WPM: " + wpm;
            time_left--;
            window.location = "score.html?wpm=" + wpm+"&mode="+mode;
        }
    }
}

function WordCount(str) { 
    return str.split(" ").length;
}

function test(e) { 
    if (mode == "TE Mode") {
        //Check if value matches the focused word
        let focusedword = words[0];
        adplay();
        //roll new words when word matches input
        if (inp.value == focusedword) {
            inp.value = "";
            rollNewWords();
        }

        //Animations when typing
        let char = "";
        for (let i = 0; i < focusedword.length; i++) {
            char += focusedword[i];
            if (inp.value == char && inp.value != "") {
                typing = true;
                //Now change the color if the word is correct
                //Find length of char and wrap it around those letters
                let exword0 = document.getElementsByClassName('word0');
                let newstring = "<span class='correct'>" + focusedword.substring(0,char.length) + "</span>" + focusedword.substring(char.length,focusedword.length);
                exword0[0].innerHTML = newstring;
                console.log(char);
                return;
            } else if (inp.value == "" && typing) {
                let newstring = "<span></span>" + focusedword;
                let exword0 = document.getElementsByClassName('word0');
                exword0[0].innerHTML = newstring;
            } else if (inp.value != "" && inp.value != char) {
                typing = true;
                let exword0 = document.getElementsByClassName('word0');
                let newstring = "<span class='wrong'>" + focusedword.substring(0,inp.value.length) + "</span>" + focusedword.substring(inp.value.length,focusedword.length);
                exword0[0].innerHTML = newstring;
            }
        }
    } else if (mode == "MT Mode") {
        let focusedword = words[0];
        adplay();
        let char = "";
        let sent = codeline.substring(13,codeline.length);

        if (inp.value == sent) {
            window.location = "score.html?wpm=" + Math.floor(((sent.length / 5) / (time_elapsed / 60))) + "&mode="+mode;
        }
        
        for (let i = 0; i < sent.length; i++) {
            char += sent[i];
            if (inp.value == char && inp.value != "") {
                typing = true;
                //Now change the color if the word is correct
                //Find length of char and wrap it around those letters
                let exword0 = document.getElementsByClassName('mtword0');
                let newstring = "<span class='correct'>" + sent.substring(0,char.length) + "</span>" + sent.substring(char.length,sent.length);
                exword0[0].innerHTML = newstring;
                livefeed = newstring;
                console.log(char);
                return;
            } else if (inp.value == "" && typing) {
                let newstring = "<span></span>" + sent;
                let exword0 = document.getElementsByClassName('mtword0');
                exword0[0].innerHTML = newstring;
                livefeed = newstring;
            } else if (inp.value != "" && inp.value != char) {
                typing = true;
                let exword0 = document.getElementsByClassName('mtword0');
                let newstring = "<span class='wrong'>" + sent.substring(0,inp.value.length) + "</span>" + sent.substring(inp.value.length,sent.length);
                exword0[0].innerHTML = newstring;
                livefeed = newstring;
            }
        }
    } else if (mode == "TR Mode") {
        adplay();
        let char = "";
        let sent = codeline.substring(13,codeline.length);

        if (inp.value == sent) {
            window.location = "score.html?wpm=" + Math.floor(((sent.length / 5) / (time_elapsed / 60))) + "&mode="+mode;
        }

        for (let i = 0; i < sent.length; i++) {
            char += sent[i];
            if (inp.value == char && inp.value != "") {
                typing = true;
                //Now change the color if the word is correct
                //Find length of char and wrap it around those letters
                let exword0 = document.getElementsByClassName('trword');
                let newstring = "<span class='correct'>" + sent.substring(0,char.length) + "</span>" + sent.substring(char.length,sent.length);
                exword0[0].innerHTML = newstring;
                console.log(char);
                livefeed = newstring;
                return;
            } else if (inp.value == "" && typing) {
                let newstring = "<span></span>" + sent;
                let exword0 = document.getElementsByClassName('trword');
                exword0[0].innerHTML = newstring;
                livefeed = newstring;
            } else if (inp.value != "" && inp.value != char) {
                typing = true;
                let exword0 = document.getElementsByClassName('trword');
                let newstring = "<span class='wrong'>" + sent.substring(0,inp.value.length) + "</span>" + sent.substring(inp.value.length,sent.length);
                exword0[0].innerHTML = newstring;
                livefeed = newstring;
            }
        }
    }
}

function setMode() {
    let md = document.getElementById('modetext');
    if (md.innerHTML == "TE Mode") {
        md.innerHTML = "MT Mode";
    } else if (md.innerHTML == "MT Mode") {
        md.innerHTML = "TR Mode";
    } else if (md.innerHTML == "TR Mode") {
        md.innerHTML = "TE Mode";
    }
}

function MTMode() {
    let cont = document.getElementById('wordcontainer');
    cont.classList.toggle("mt");
    for (let x = 0; x < 6; x++ ) {
        for (let i = 0; i < 10; i++ ) {
            if (i == 0 && x == 0) {
                let wordnum =  Math.floor(Math.random() * json.words.length);
                let word = document.createElement('label');
                wordcont.innerHTML = wordcont.innerHTML +   "<span></span>" + json.words[wordnum] + " ";
                wordcont.className = "mtword" + i;
                words.push(json.words[wordnum]);
                codeline = wordcont.innerHTML;
                livefeed = wordcont.innerHTML;
            } else {
                let wordnum =  Math.floor(Math.random() * json.words.length);
                let word = document.getElementsByClassName("mtword0");
                wordcont.innerHTML = wordcont.innerHTML + (json.words[wordnum] + " ");
                codeline = wordcont.innerHTML;
                livefeed = wordcont.innerHTML;
            }
        }
        console.log(codeline);
        cont.appendChild(wordcont);
    }
    console.log(words);

    timer = setInterval(updateTimer, 1000);
}

function TRMode() { 
    let cont = document.getElementById('wordcontainer');
    let wordnum =  Math.floor(Math.random() * json.sentences.length);
    wordcont.innerHTML = "<span></span>" + json.sentences[wordnum];
    wordcont.className = "trword";
    codeline = wordcont.innerHTML;
    cont.appendChild(wordcont);
    time_left = 120;
    timer = setInterval(updateTimer, 1000);
}

window.onload = function() {
    if (mode == "TE Mode") {
        //Load 3 words onto the screen ready for the user to type
        let cont = document.getElementById('wordcontainer');
        //Loading 3 words in at a time
        for (let i = 0; i < 3; i++) {
            let wordnum =  Math.floor(Math.random() * json.words.length);
            let word = document.createElement('label');
            word.innerHTML = "<span></span>" + json.words[wordnum];
            word.className = "word" + i;
            words.push(json.words[wordnum]);
            cont.appendChild(word);
        }

        timer = setInterval(updateTimer, 1000);

        console.log(words);
    } else if (mode == "TR Mode") {
        document.getElementById('timer').innerHTML = "120";
    }
}

//Main Loop for page
applySettings();

if (mode == "MT Mode") {
    MTMode();
} else if (mode == "TR Mode") {
    TRMode();
}

//Checking for change in input
let inp = document.getElementById("wordtyping");
inp.addEventListener("input", test);


