async function getImages() {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const images = [...document.querySelectorAll("img.image__img")];
        const imagesInfo = images.map((image) => ({
          src: image.attributes.srcset.nodeValue
            ? image.attributes.srcset.nodeValue
            : image.currentSrc,
          alt: image.alt,
        }));
        console.log("images from extension", imagesInfo);
      },
    });
  }

  function copyToClip(str) {
    function listener(e) {
      e.clipboardData.setData("text/html", str);
      e.clipboardData.setData("text/plain", str);
      e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
  }
  
  async function copyContent(stringy, events) {
    console.log("stringy", stringy, "events", events);
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (stringy, events) => {
        console.log("event", events, "str", stringy);
        //   copyToClip(str);
      },
    });
  }

//this may be deleted later
  document.getElementById("copyContent").addEventListener("click", (event) => {
    copyContent(htmlToCopy, event);
  });
  document.getElementById("myImages").addEventListener("click", getImages);