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

async function copyContent(str) {
  let [tab] = await chrome.tabs.query({ active: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      copyToClip(str);
    },
  });
}

async function getContent() {
  let [tab] = await chrome.tabs.query({ active: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const newHTML = document.createElement("div");
      const allElements = document.querySelectorAll("main h2, main p, main img");

      const elementsInfo = [...allElements].forEach((element) => {
        let elementEl;

        if (element.tagName === "IMG") {
          elementEl = document.createElement("div");
          elementEl.innerHTML = `<p>Aqui va la imagen con esta ruta: ${
            element.currentSrc || element.attributes.srcset?.nodeValue
          }</p><p>Y este es el alt: ${element.alt}</p>`;
        } else {
          elementEl = document.createElement(element.tagName);
          elementEl.textContent = element.textContent;
        }

        const elementStyle = getComputedStyle(element);

        elementEl.style.fontSize = elementStyle.fontSize;
        elementEl.style.color = elementStyle.color;
        elementEl.style.fontFamily = elementStyle.fontFamily;
        elementEl.style.fontWeight = elementStyle.fontWeight;
        elementEl.style.fontStyle = elementStyle.fontStyle;
        elementEl.style.textAlign = elementStyle.textAlign;
        elementEl.style.textDecoration = elementStyle.textDecoration;
        elementEl.style.textTransform = elementStyle.textTransform;
        elementEl.style.lineHeight = elementStyle.lineHeight;
        elementEl.style.letterSpacing = elementStyle.letterSpacing;
        elementEl.style.wordSpacing = elementStyle.wordSpacing;

        newHTML.appendChild(elementEl);
        console.log("nreHTML", newHTML);
      });

      console.log("elements from extension", elementsInfo);
      htmlToCopy = newHTML.innerHTML;
      console.log("htmlToCopy", htmlToCopy);
    },
  });
}

document.getElementById("myButton").addEventListener("click", sayHello);
document.getElementById("myImages").addEventListener("click", getImages);
document.getElementById("myContent").addEventListener("click", getContent);
document.getElementById("copyContent").addEventListener("click", () => copyContent(htmlToCopy));
