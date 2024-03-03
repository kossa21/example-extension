
async function injectButtons() {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const button = document.createElement('button')
        button.innerText = 'copy alt text'
        button.classList.add('root')
  
        const header = document.querySelector("header")
        const imageHeader =  document.querySelector("header img")
        header.append(button)
      },
    });
  }
  
  

function copyToClipboard() {
    var copyText = document.getElementById("copyText");
    copyText.select();
    document.execCommand("copy");
  
    var copyBtn = document.getElementById("copyBtn");
    copyBtn.innerText = "Copied!";
    copyBtn.classList.add("copied");
  
    setTimeout(function () {
      copyBtn.innerText = "Copy";
      copyBtn.classList.remove("copied");
    }, 2000); // Change 2000 to the number of milliseconds you want the "Copied!" message to display
  }

document.getElementById("copyBtn").addEventListener("click", (e) => {
    copyToClipboard(e)
    injectButtons()
  });