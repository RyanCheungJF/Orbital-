texttoSpeech// Global speed, future feature to customize voice of reader and speed.
var speak_rate = 1.1;
//******************************************************************
const paragraphs = document.querySelectorAll('p');
var para_counter = -1;
var para_pressed = false;
//******************************************************************
const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
var headers_counter = 0;
//******************************************************************
const links = document.querySelectorAll('a');
var links_counter = 0;
var searched = false;
var last_link = null;
//******************************************************************


// Hyperlink Handling
var hyperlinks = [];
var linkTitles = [];
// Interestingly, this gives an error if done with a simple for loop statement,
// reference: https://stackoverflow.com/questions/40835675/why-does-chrome-throw-getattribute-is-not-a-function-error-inside-a-for-loop
for (var link = 0; link < links.length; link++)  {
    let hyperlink = links[link].getAttribute("href");
    // Certain links will not return the full link path, hence we manually concat it to the current webpage we are on.
    // eg. returns /section/politics after filtering but link should be https://www.nytimes.com/section/politics
    if (hyperlink != null && hyperlink.substring(0, 4) != "http") {
        if (hyperlink.substring(0, 1) == "/") {
            hyperlink = window.location.href.concat(hyperlink.substring(1, hyperlink.length));
        } else {
            hyperlink = window.location.href.concat(hyperlink.substring(0, hyperlink.length));
        }
    }
    let linkName = links[link].innerText;
    // Certain links do not have a name associated, so we sieve through the url link to obtain one.
    // Has potential for machine learning techniques.
    if (linkName == "") {
        //Pops up an error because google returns a null for the hyperlink element. Need to find how to query google searches
        var lastslash = hyperlink.lastIndexOf("/");
        var str = hyperlink.substring(lastslash + 1, hyperlink.length);
        if (str.indexOf(".html") != -1) {
            str = str.substring(0, str.indexOf(".html"));
        }
        linkName = str.replace("-", " ");
    }
    hyperlinks[link] = hyperlink;
    linkTitles[link] = linkName;
    console.log(link);
    console.log(hyperlink);
    console.log(linkName);
}

// Additional function to filter through the hyperlinks
var filterlinks = [];
var filtertitles = [];
function findLink(str) {
    filterlinks = [];
    filtertitles = [];
    for (i in hyperlinks) {
        if (hyperlinks[i].toLowerCase().includes(str.toLowerCase())) { //Lower case to make case insensitive case
            filterlinks.push(hyperlinks[i]);
            filtertitles.push(linkTitles[i]);
        }




    }
}
function texttoSpeech(text){   //Just call this everytime u want a speech
  let engine = window.speechSynthesis;
  engine.cancel();
  engine.speak(new SpeechSynthesisUtterance(text));


};


// This event listener will await a prompt from the user to search for. Entering nothing will return all hyperlinks.
window.addEventListener("keypress",
    function(event) {
        if (event.key.charCodeAt(0) === 51) {
            searched = true;
            let engine = window.speechSynthesis;
            engine.rate = speak_rate;

            texttoSpeech("Please type in the keyword and hit enter to search among hyperlinks!");
            var search = window.prompt("Search keyword for hyperlinks: ");
            findLink(search);
            texttoSpeech("Filtering for keyword " + search);
            if (filterlinks.length === 0) {
                texttoSpeech("Sorry, there is no link with this keyword " + search);
            } else {
                texttoSpeech("Done! Press 4 to alternate between the search results!");
            }
        }
    }
);

// Used to alternate through the hyperlinks, similar to paragraphs.
window.addEventListener("keypress",
    function(event) {
        if (event.key.charCodeAt(0) === 52) {
            let engine = window.speechSynthesis;
            engine.rate = speak_rate;
            if (!searched) {
                texttoSpeech("Please search for a keyword by hitting 3!");
            } else {
                if (links_counter === filterlinks.length) {
                    links_counter = 0;
                }
                texttoSpeech(filtertitles[links_counter]);
                links_counter++;
            }
        }
    }
);

// Used to visit a hyperlink after choosing.
window.addEventListener("keypress",
    function(event) {
        if (event.key.charCodeAt(0) === 48) {
            let engine = window.speechSynthesis;
            engine.rate = speak_rate;
            if (last_link == null) {
                texttoSpeech("Please search for a keyword by hitting 3!");
            } else {
                texttoSpeech("Redirecting you to " + last_link[1]);
                window.location.href = last_link[0];
            }
        }
    }
);

// Reporting ads. ("r" key)
window.addEventListener("keypress",
    function(event) {
        if (event.key.charCodeAt(0) === 114) {
            let engine = window.speechSynthesis;
            engine.rate = speak_rate;
            console.log("kachow");
        }
    }
);

// Paragraphs
    // **************************************************************************************************
    // Currently has the functionality where if double pressed within 500ms, will read the previous para.
    // Hence, there is back and forward navigation ability.
    // **************************************************************************************************
var delta = 500;
window.addEventListener("keypress",
    function(event) {
        if (event.key.charCodeAt(0) === 49) {
            let engine = window.speechSynthesis;
            engine.rate = speak_rate;
            if (para_pressed) {
                para_counter === 0 ? para_counter = paragraphs.length : para_counter = para_counter - 2;
                para_pressed = !para_pressed;
            } else {
                para_counter++;
                para_pressed = !para_pressed;
                window.setTimeout(function() {para_pressed = false;}, 500);
            }

            texttoSpeech(paragraphs[para_counter].childNodes[0].nodeValue);

        }
    }
);

// Headers
window.addEventListener("keypress",
    function(event) {
        if (event.key.charCodeAt(0) === 50) {
            if (headers_counter > headers.length) {
                headers_counter = 0;
            }
            //let engine = new SpeechSynthesisUtterance(headers[headers_counter].childNodes[0].nodeValue);
            //engine.rate = speak_rate;
            //window.speechSynthesis.speak(engine);
            texttoSpeech(headers[headers_counter].childNodes[0].nodeValue);
            headers_counter++;
        }
    });




// Test/ Debug Code
/*
new Promise((resolve, reject) => {
    if (h2.length !== 0) {
        resolve("Reading h2 tags!");
    } else {
        reject("No h2 tags available!");
    }
}).then((msg) => {
    window.addEventListener("keypress",
        function(event) {
            if (event.key.charCodeAt(0) === 51) {
                if (h2_counter > h2.length) {
                    h2_counter = 0;
                }
                let engine = new SpeechSynthesisUtterance((h2)[h2_counter].innerText);
                window.speechSynthesis.speak(engine);
                h2_counter++;
            }
        }
    )
}).catch((msg) => {
    console.log(msg);
});
*/
