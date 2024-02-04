var recognition;

navigator.mediaDevices.getUserMedia({
        audio: true
    })
    .then(stream => {
        chrome.runtime.sendMessage({
            action: "consolelog",
            message: "Microphone permission granted"
        });

        chrome.runtime.sendMessage({
            action: "consolelog",
            message: "Started Listening:"
        });

        recognition = new(window.webkitSpeechRecognition || window.SpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.continuous = true; // Set to true to keep listening even after a result is returned
        recognition.interimResults = true;
        
        let commandBuffer = [];
        let isListeningForCommand = false;
        let result = "";

        recognition.onresult = function(event) {
            
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript.trim();
        
        	//const result = event.results[event.results.length - 1][0].transcript.toLowerCase();

            //chrome.runtime.sendMessage({ action: "consolelog", message: transcript });
            
            if (transcript.toLowerCase().includes('lolo')) {
                chrome.runtime.sendMessage({ action: "consolelog", message: "Lolo found" });
                isListeningForCommand = true;
                commandBuffer = []; // Clear the buffer to start a new command
                
                if (isListeningForCommand) {
                    commandBuffer.push(transcript);
                }
          
                if (event.results[current].isFinal) {
                    if (isListeningForCommand) {
                      result = commandBuffer;
                      chrome.runtime.sendMessage({ action: "consolelog", message: "Final transcript i.e. result" });
                      chrome.runtime.sendMessage({ action: "consolelog", message: result });
                      performAction(result);
                      isListeningForCommand = false; // Reset listening state
                      commandBuffer = []; // Clear the command buffer
                    }
                  }
            }
            
        };
        
        recognition.onstart = function(event) {
            chrome.runtime.sendMessage({
                action: "consolelog",
                message: "Recog start"
            });
        };

        recognition.onerror = function(event) {
            chrome.runtime.sendMessage({
                action: "consoleerror",
                message: event.error
            });
        };

        recognition.onend = function() {
            chrome.runtime.sendMessage({
                action: "consolelog",
                message: "Speech recognition ended"
            });
            console.log('Speech recognition started again');
            recognition.start();

        };
    recognition.start();

    })
    .catch(err => {
        console.error('Error accessing microphone:', err);
        console.error('Error accessing microphone:', err.message);
        console.error('Error accessing microphone:', err.name);
    })

function performAction(result) {

    chrome.runtime.sendMessage({
        action: "consolelog",
        message: "Inside performAction"
    });
    chrome.runtime.sendMessage({
        action: "consolelog",
        message: result
    });
    
    if (result[0].includes('screen')) {
        chrome.runtime.sendMessage({
        action: "consolelog",
        message: "Screen found"
        });
        captureAndScreen();
        //recognition.start();
    }

    if (result[0].includes('search')) {
        
        chrome.runtime.sendMessage({
        action: "consolelog",
        message: "Search found"
        });

        const indexAfterSearch = result[0].indexOf("search") + "search ".length;
        const textAfterSearch = result[0].substring(indexAfterSearch);
        performSearch(textAfterSearch);
    }
    
    if (result[0].includes('price')) {
        
        chrome.runtime.sendMessage({
        action: "consolelog",
        message: "Price found"
        });
    
    const indexAfterDelta = result[0].indexOf("lolo") + "lolo ".length;
        const metricText = result[0].substring(indexAfterDelta);
        captureAndProcess(metricText);
        //captureAndProcess("delta");
    }
}

function performSearch(textAfterSearch) {

    chrome.runtime.sendMessage({
        action: "consolelog",
        message: "Inside performSearch"
    });

    const searchBars = document.querySelectorAll('input[type="search"], input[type="text"]');

    for (const searchBar of searchBars) {
        searchBar.click();
        searchBar.value = textAfterSearch;

        // If Enter key press didn't trigger a search, try clicking the search button:
        const searchButtons = document.querySelectorAll('button[type="submit"], input[type="submit"]');
        for (const searchButton of searchButtons) {
            if (searchButton.form === searchBar.form) { // Ensure the button belongs to the same form as the search bar
                searchButton.click();
                break; // Exit the loop after clicking a matching button
            }
        }
    }

    askMetrics();
}


function askMetrics() {
    
    chrome.runtime.sendMessage({
        action: "consolelog",
        message: "Inside askMetrics"
    });

    if ('speechSynthesis' in window) {

        let instructions = "Please tell your pricing budget, the review threshold and expected delivery date";

        const instructionsObj = new SpeechSynthesisUtterance(instructions);
        instructionsObj.lang = 'en-US';
        instructionsObj.volume = 1;
        instructionsObj.rate = 1;

        window.speechSynthesis.speak(instructionsObj);

    }
    
    //getMetrics();
}

function getMetrics(){
    
    chrome.runtime.sendMessage({
        action: "consolelog",
        message: "Inside getMetrics"
    });
    //recognition.abort();
    //recognition.start();
}

function captureAndProcess(result) {
    chrome.runtime.sendMessage({ action: "consolelog", message: "Capture start" });
    chrome.runtime.sendMessage({ action: "captureForPrice", speechResult: result });
    chrome.runtime.sendMessage({ action: "consolelog", message: "Capture end" });
    //recognition.abort();
    //recognition.start();
}

function captureAndScreen() {
    
    chrome.runtime.sendMessage({
        action: "consolelog",
        message: "Inside captureAndScreen"
    });
    
    chrome.runtime.sendMessage({ action: "consolelog", message: "Capture start" });
    chrome.runtime.sendMessage({ action: "captureScreen"});
    chrome.runtime.sendMessage({ action: "consolelog", message: "Capture end" });
    //recognition.abort();
    //recognition.start();
}

/*
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

chrome.runtime.sendMessage({
        action: "consolelog",
        message: "Inside clickOnProduct"
    });

    
    
    
});    */