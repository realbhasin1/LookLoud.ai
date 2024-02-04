document.getElementById('start-recognition').addEventListener('click', async () => {
    const activeTab = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });
    const activeTabId = activeTab[0].id;
    chrome.scripting.executeScript({
        target: {
            tabId: activeTabId
        },
        files: ["content.js"]
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    
      if (request.action === 'captureForPrice') {
      
      const speechResult = request.speechResult;
      
      chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(imageUrl) {
        if (chrome.runtime.lastError) {
            alert('Error capturing screenshot: ' + chrome.runtime.lastError.message);
            return;
        }

        // Convert the data URL to a Blob for uploading
        fetch(imageUrl)
            .then(res => res.blob())
            .then(blob => {
                const formData = new FormData();
                formData.append('image', blob);
                formData.append('key', '7f6e15ba900a9760626037ab4946451c'); // Replace with your ImgBB API key

                // POST request to ImgBB API
                return fetch('https://api.imgbb.com/1/upload', {
                    method: 'POST',
                    body: formData
                });
            }) 
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    const uploadedImageUrl = result.data.url;

                    // Copy the URL to the clipboard
                    //navigator.clipboard.writeText(uploadedImageUrl).then(() => {
                    //    console.log('Image URL copied to clipboard');
                    //});

                    // Prepare the body for the second API call
                    const body = JSON.stringify({
                        image_url: uploadedImageUrl,
                        speech_prompt: speechResult
                    });

                    // Make the second API call within this scope
                    return fetch('https://still-lowlands-42660-f33a7feb5e1b.herokuapp.com/price', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json' // Set the correct content type
                        },
                        body: body
                    });
                } else {
                    throw new Error('Error uploading image: ' + JSON.stringify(result));
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }
                return response.json(); // Parse the JSON response
            })
            .then(data => {
                console.log('API response:', data);

                // Assuming 'data' contains a property 'result' with text to speak
                const speechText = data.result; // Replace 'result' with the property name from your API response
                
                // Speech synthesis
                if ('speechSynthesis' in window) {
                    const speech = new SpeechSynthesisUtterance(speechText);
                    speech.lang = 'en-US'; // Set language if needed
                    speech.volume = 1; // Set volume (0 to 1)
                    speech.rate = 1; // Set rate (0.1 to 10)
                    
                    // Speak the response
                    window.speechSynthesis.speak(speech);
                } else {
                    console.error('Speech synthesis not supported');
                    

                }
                
                console.log("Speech ended");
                
                //clickOnProduct(speechText);
                //clickOnProduct("Apple");
                
                console.log(document); 
                
                injectLink(speechText);
                
                //chrome.runtime.sendMessage({ action: "clickOnProduct", productName: speechText });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
    
      
  }
  
  if (request.action === 'captureScreen') {
      
      //const speechResult = request.speechResult;
      
      chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(imageUrl) {
        if (chrome.runtime.lastError) {
            alert('Error capturing screenshot: ' + chrome.runtime.lastError.message);
            return;
        }

        // Convert the data URL to a Blob for uploading
        fetch(imageUrl)
            .then(res => res.blob())
            .then(blob => {
                const formData = new FormData();
                formData.append('image', blob);
                formData.append('key', '7f6e15ba900a9760626037ab4946451c'); // Replace with your ImgBB API key

                // POST request to ImgBB API
                return fetch('https://api.imgbb.com/1/upload', {
                    method: 'POST',
                    body: formData
                });
            }) 
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    const uploadedImageUrl = result.data.url;

                    // Copy the URL to the clipboard
                    //navigator.clipboard.writeText(uploadedImageUrl).then(() => {
                    //    console.log('Image URL copied to clipboard');
                    //});

                    // Prepare the body for the second API call
                    const body = JSON.stringify({
                        image_url: uploadedImageUrl,
                        speech_prompt: ["delta  what is on my screen?"]
                    });

                    // Make the second API call within this scope
                    return fetch('https://still-lowlands-42660-f33a7feb5e1b.herokuapp.com/run', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json' // Set the correct content type
                        },
                        body: body
                    });
                } else {
                    throw new Error('Error uploading image: ' + JSON.stringify(result));
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }
                return response.json(); // Parse the JSON response
            })
            .then(data => {
                console.log('API response:', data);

                // Assuming 'data' contains a property 'result' with text to speak
                const speechText = data.result; // Replace 'result' with the property name from your API response
                
                // Speech synthesis
                if ('speechSynthesis' in window) {
                    const speech = new SpeechSynthesisUtterance(speechText);
                    speech.lang = 'en-US'; // Set language if needed
                    speech.volume = 1; // Set volume (0 to 1)
                    speech.rate = 1; // Set rate (0.1 to 10)
                    
                    // Speak the response
                    window.speechSynthesis.speak(speech);
                } else {
                    console.error('Speech synthesis not supported');
                    

                }
                
                console.log("Speech ended");
                
                
                //chrome.runtime.sendMessage({ action: "clickOnProduct", productName: speechText });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
    
      
  }
});


function injectLink(speechText) {
    
    const activeTab = chrome.tabs.query({
        active: true,
        currentWindow: true
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const activeTabId = tabs[0].id;
    chrome.scripting.executeScript({
        target: {
            tabId: activeTabId
        },
        files: ["links.js"]
        
    });
});
}
/*function clickOnProduct(productName) {
    
    
 console.log('Inside clickOnProduct');
 //const finalProductName = productName.substring(15, 40);
 const finalProductName = "Apple";
 console.log(finalProductName);
 
 //const targetClass = "a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal";
  //const links = document.querySelectorAll(`a.${targetClass}`);
 
 
console.log(document); 
const links = document.querySelectorAll('a');

 
 //const links = document.querySelectorAll('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal');
 //const links = document.querySelectorAll('a[class="a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal"]');
 //const links = document.getElementsByTagName('a');
 //const links = document.querySelectorAll('input[type="search"], input[type="text"]');
 
 console.log(links);
 
 /*
 const searchBars = document.querySelectorAll('input[type="search"], input[type="text"]');

    for (const searchBar of searchBars) {
        searchBar.click();
    searchBar.value = "TEST"; }


 console.log(searchBars);

 for (const link of links) {
    const productText = link.querySelector('span.a-size-medium').textContent.trim();

    if (productText.toLowerCase().includes(finalProductName.toLowerCase())) {
        console.log("Found");
      console.log(link.getAttribute('href')); // Return the href if product name matches
    }
  }
 
 /*const links = document.querySelectorAll('a');
 for (const link of links) {
    console.log(link);
    console.log(link.textContent);
    const linkText = link.textContent.trim(); // Get the text content of the link

    if (linkText.includes(finalProductName)) { // Check if the text part is present
    console.log(link);
      link.click(); // Click the link if it matches
      break; // Exit the function after clicking
    }
  }
  
  console.log('Exit clickOnProduct');
 
}   */