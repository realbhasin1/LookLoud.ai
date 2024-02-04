 
 chrome.runtime.sendMessage({
            action: "consolelog",
            message: "Links"
        });
        
 //const productName = window.myVariable;  
 //const finalProductName = productName.substring(15, 40);
 const finalProductName = "2023 MacBook Air M2 chip";
 
 chrome.runtime.sendMessage({
            action: "consolelog",
            message: finalProductName
        });
 
 chrome.runtime.sendMessage({
            action: "consolelog",
            message: document.documentElement.outerHTML
        });
 

const goodlinks = document.querySelectorAll('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal');
//LAKI const goodlinks = document.querySelectorAll('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal');

/* LAKI for (const element of goodlinks) {
  const link = element.href;
  const text = element.querySelector("span").textContent;
  
  chrome.runtime.sendMessage({
            action: "consolelog",
            message: link
   });
   
     chrome.runtime.sendMessage({
            action: "consolelog",
            message: text
   });

}*/

//chrome.runtime.sendMessage({
//            action: "consolelog",
//            message: goodlinks[0]
//   });

// LAKI goodlinks[0].click();

   chrome.runtime.sendMessage({
            action: "consolelog",
            message: goodlinks
        });

 for (const link of goodlinks) {

    /*chrome.runtime.sendMessage({
            action: "consolelog",
            message: "Text"
        });
    
      chrome.runtime.sendMessage({
            action: "consolelog",
            message: link.textContent
        });
        
       chrome.runtime.sendMessage({
            action: "consolelog",
            message: link.textContent.trim()
        });*/
        
        const productText = link.textContent.trim();

    if (productText.toLowerCase().includes(finalProductName.toLowerCase())) {
        chrome.runtime.sendMessage({
            action: "consolelog",
            message: "Found"
        });
        
        chrome.runtime.sendMessage({
            action: "consolelog",
            message: link.getAttribute('href')
        });
        
        link.click();
    }
  }
  
setTimeout(function() {
  chrome.runtime.sendMessage({
            action: "consolelog",
            message: "Before submit XXXXXXX"
        });  
}, 5000);
  
chrome.runtime.sendMessage({
            action: "consolelog",
            message: "Before submit"
        });  
setTimeout(function(){
chrome.runtime.sendMessage({
            action: "consolelog",
            message: document
        });
        
        chrome.runtime.sendMessage({
            action: "consolelog",
            message: "SUBMIT"
        });

const submitButtons = document.querySelectorAll('#add-to-cart-button');
for (const submitButton of submitButtons) {
    submitButton.click();
}


}
,5000);

