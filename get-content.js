let htmlToCopy = "";

async function getContent() {
  let [tab] = await chrome.tabs.query({ active: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
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

document.getElementById("myContent").addEventListener("click", getContent);

