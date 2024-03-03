async function injectButtons() {
  const [tab] = await chrome.tabs.query({ active: true })
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const button = document.createElement('button')
      button.innerText = 'copy alt text'
      button.classList.add('root')

      const header = document.querySelector('header')
      const imageHeader = document.querySelector('header img')
      header.append(button)
    }
  })
}

function copyToClipboard() {
  const copyText = document.querySelector('#copyText')
  copyText.select()
  document.execCommand('copy')

  const copyButton = document.querySelector('#copyBtn')
  copyButton.innerText = 'Copied!'
  copyButton.classList.add('copied')

  setTimeout(function () {
    copyButton.innerText = 'Copy'
    copyButton.classList.remove('copied')
  }, 2000) // Change 2000 to the number of milliseconds you want the "Copied!" message to display
}

document.querySelector('#copyBtn').addEventListener('click', (e) => {
  copyToClipboard(e)
  injectButtons()
})
