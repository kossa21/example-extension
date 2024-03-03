

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

let htmlToCopy = "";

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

async function getContent() {
  let [tab] = await chrome.tabs.query({ active: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      console.log("holi from extension");
      function getImageName(element) {
        const path = element.currentSrc || element.attributes.srcset?.nodeValue;

        const questionMarkPosition = path.lastIndexOf("?");
        const lastUnderscorePosition = path.lastIndexOf("_") + 1;

        const shortPath = path.slice(lastUnderscorePosition, questionMarkPosition);

        console.log("shortPath", shortPath);
        return shortPath;
      }

      function createNewImage(element) {
        const elementEl = document.createElement("div");
        elementEl.style.border = "1px solid black";

        const imageName = getImageName(element);

        imageNameEl = document.createElement("p");
        imageNameEl.textContent = `Image name: ${imageName}`;

        imageAltEl = document.createElement("p");
        imageAltEl.textContent = `Image alt: ${element.alt}`;

        elementEl.append(imageNameEl, imageAltEl);

        return elementEl;
      }

      function createOtherHtmlElements(element) {
        elementEl = document.createElement(element.tagName);
        elementEl.textContent = element.textContent;

        return elementEl;
      }

      function createNewElement(element) {
        let elementEl;

        if (element.tagName === "IMG") {
          elementEl = createNewImage(element);
        } else {
          elementEl = createOtherHtmlElements(element);
        }

        const elementStyle = getComputedStyle(element);

        elementEl.style = {
          ...elementStyle,
        };

        return elementEl;
      }

      const newHTML = document.createElement("div");
      const selectorAllElementsInsideMain =
        "main h2:not(.conversion h2), main p:not(.conversion p), main img:not(.conversion img)";

      const allElements = document.querySelectorAll(selectorAllElementsInsideMain);
      const elementsInfo = [...allElements].forEach((element) => {
        let elementEl = createNewElement(element);
        if (elementEl) {
          newHTML.appendChild(elementEl);
          console.log("nreHTML", newHTML);
        }
      });

      console.log("elements from extension", elementsInfo);
      htmlToCopy = newHTML.innerHTML;
      console.log("htmlToCopy", htmlToCopy);

      function listener(e) {
        e.clipboardData.setData("text/html", htmlToCopy);
        e.clipboardData.setData("text/plain", htmlToCopy);
        e.preventDefault();
      }
      document.addEventListener("copy", listener);
      document.execCommand("copy");
      document.removeEventListener("copy", listener);

      alert("Content copied to clipboard");
    },
  });
}

// document.getElementById("myButton").addEventListener("click", sayHello);
document.getElementById("myImages").addEventListener("click", getImages);
document.getElementById("myContent").addEventListener("click", getContent);
document.getElementById("copyBtn").addEventListener("click", (e) => {
  copyToClipboard(e)
  injectButtons()
});
document.getElementById("copyContent").addEventListener("click", (event) => {
  copyContent(htmlToCopy, event);
});
