async function injectButtons() {
  const [tab] = await chrome.tabs.query({ active: true })
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      function copyToClipboard(textToCopy) {
        function listener(event) {
          event.clipboardData.setData('text/html', textToCopy)
          event.clipboardData.setData('text/plain', textToCopy)
          event.preventDefault()
        }
        document.addEventListener('copy', listener)
        document.execCommand('copy')
        document.removeEventListener('copy', listener)
      }
      function createButton(textToCopy) {
        const button = document.createElement('button')
        button.textContent = 'copy text'
        button.classList.add('button-74')
        button.role = 'button'

        button.addEventListener('click', () => {
          copyToClipboard(textToCopy)

          button.textContent = 'Copied!'
          button.classList.add('copied')
          setTimeout(function () {
            button.textContent = 'Copy text'
            button.classList.remove('copied')
          }, 1000)
        })
        return button
      }
      function createDescription(contentName, contentValue) {
        const descriptionContainer = document.createElement('div')
        const infoContainer = document.createElement('div')
        const subtitle = document.createElement('h3')
        const paragraph = document.createElement('p')
        const button = createButton(contentValue)
        subtitle.textContent = contentName + ' text'
        paragraph.textContent = contentValue

        infoContainer.classList.add('info-container')
        infoContainer.append(paragraph, button)
        descriptionContainer.append(subtitle, infoContainer)
        return descriptionContainer
      }

      function addHeaderImageBanner() {
        const bannerContainer = document.createElement('div')
        const header = document.querySelector('header')
        /** @type {HTMLImageElement} */
        const imageHeader = document.querySelector('header img')
        const imageName = getImageName(imageHeader)
        const imageNameDescription = createDescription('image source', imageName)
        const imageAltDescription = createDescription('image alt', imageHeader.alt)

        bannerContainer.classList.add('responsive-banner')
        bannerContainer.append(imageNameDescription, imageAltDescription)
        header.append(bannerContainer)
      }
      addHeaderImageBanner()

      function getImageName(element) {
        const path = element.currentSrc || element.attributes.srcset?.nodeValue

        const questionMarkPosition = path.lastIndexOf('?')
        const lastUnderscorePosition = path.lastIndexOf('_') + 1

        const shortPath = path.slice(lastUnderscorePosition, questionMarkPosition)

        return shortPath.replaceAll('-', '%20')
      }
    }
  })
}

function copyToClipboard() {
  const copyText = document.querySelector('#copyText')
  // @ts-ignore
  copyText.select()
  document.execCommand('copy')

  const copyButton = document.querySelector('#copyBtn')
  copyButton.textContent = 'Copied!'
  copyButton.classList.add('copied')

  setTimeout(function () {
    copyButton.textContent = 'Copy'
    copyButton.classList.remove('copied')
  }, 1000)
}

document.querySelector('#copyBtn').addEventListener('click', () => {
  copyToClipboard()
  injectButtons()
})
