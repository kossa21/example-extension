async function sayHello() {
  let [tab] = await chrome.tabs.query({ active: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      console.log("holi from extension");
      document.body.style.background = "red";
      alert("Holiii from my extension <3");
    },
  });
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
        const ruta = element.currentSrc || element.attributes.srcset?.nodeValue;

        const questionMarkPosition = ruta.lastIndexOf("?");
        const lastUnderscorePosition = ruta.lastIndexOf("_") + 1;

        const shortRuta = ruta.slice(lastUnderscorePosition, questionMarkPosition);

        console.log("shortRuta", shortRuta);
        return shortRuta;
      }

      function createNewElement(element) {
        let elementEl;

        if (element.tagName === "IMG") {
          elementEl = document.createElement("div");
          elementEl.style.border = "1px solid black";

          const imageName = getImageName(element);

          imageNameEl = document.createElement("p");
          imageNameEl.textContent = `Image name: ${imageName}`;

          imageAltEl = document.createElement("p");
          imageAltEl.textContent = `Image alt: ${element.alt}`;

          elementEl.append(imageNameEl, imageAltEl);
        } else {
          elementEl = document.createElement(element.tagName);
          elementEl.textContent = element.textContent;
          if (elementEl.textContent.length === 0) {
            return ''
          }
        }
        const elementStyle = getComputedStyle(element);

         elementEl.style = {
          ...elementStyle
        }

        return elementEl;
      }

      const newHTML = document.createElement("div");
      const allElements = document.querySelectorAll("main h2, main p, main img");

      const elementsInfo = [...allElements].forEach((element) => {
        let elementEl = createNewElement(element);

        newHTML.appendChild(elementEl);
        console.log("nreHTML", newHTML);
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

document.getElementById("myButton").addEventListener("click", sayHello);
document.getElementById("myImages").addEventListener("click", getImages);
document.getElementById("myContent").addEventListener("click", getContent);
document.getElementById("copyContent").addEventListener("click", (event) => {
  copyContent(htmlToCopy, event);
});
