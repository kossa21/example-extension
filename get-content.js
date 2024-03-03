/* eslint-disable unicorn/consistent-function-scoping */
let htmlToCopy = ''

async function getContent() {
    const [tab] = await chrome.tabs.query({ active: true })
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            function getImageName(element) {
                const path =
                    element.currentSrc || element.attributes.srcset?.nodeValue

                const questionMarkPosition = path.lastIndexOf('?')
                const lastUnderscorePosition = path.lastIndexOf('_') + 1

                const shortPath = path.slice(
                    lastUnderscorePosition,
                    questionMarkPosition
                )

                return shortPath
            }

            function createNewImage(element) {
                const infoImageElementContainer = document.createElement('div')
                infoImageElementContainer.style.border = '1px solid black'

                const imageName = getImageName(element)

                const imageNameElement = document.createElement('p')
                imageNameElement.textContent = `Image name: ${imageName}`

                const imageAltElement = document.createElement('p')
                imageAltElement.textContent = `Image alt: ${element.alt}`

                infoImageElementContainer.append(
                    imageNameElement,
                    imageAltElement
                )

                return infoImageElementContainer
            }

            function createNewParagraph(element) {
                console.log(
                    'receiving element:',
                    element,
                    'calling createNewParagraph'
                )
                const dynamicElement = document.createElement('p')
                dynamicElement.textContent = element.innerHTML

                console.log('dynamicElement', dynamicElement)

                return dynamicElement
            }

            function createOtherHtmlElements(element) {
                const dynamicElement = document.createElement(element.tagName)
                dynamicElement.textContent = element.textContent

                return dynamicElement
            }

            function createNewElement(element) {
                let bodyDynamicElement

                switch (element.tagName.toLowerCase()) {
                    case 'img': {
                        bodyDynamicElement = createNewImage(element)
                        break
                    }
                    // case 'p': {
                    //     bodyDynamicElement = createNewParagraph(element)
                    //     break
                    // }

                    default: {
                        bodyDynamicElement = createOtherHtmlElements(element)
                        break
                    }
                }

                const elementStyle = getComputedStyle(element)

                bodyDynamicElement.style = {
                    ...elementStyle,
                }
                return bodyDynamicElement
            }

            const newHTML = document.createElement('div')
            const selectorAllElementsInsideMain =
                'main h2:not(.conversion h2), main p:not(.conversion p), main img:not(.conversion img)'

            const allElements = document.querySelectorAll(
                selectorAllElementsInsideMain
            )
            for (const element of allElements) {
                const elementToCopy = createNewElement(element)
                if (elementToCopy) {
                    newHTML.append(elementToCopy)
                    console.log('nreHTML', newHTML)
                }
            }

            htmlToCopy = newHTML.innerHTML
            console.log('htmlToCopy', htmlToCopy)

            function listener(event) {
                event.clipboardData.setData('text/html', htmlToCopy)
                event.clipboardData.setData('text/plain', htmlToCopy)
                event.preventDefault()
            }
            document.addEventListener('copy', listener)
            document.execCommand('copy')
            document.removeEventListener('copy', listener)

            alert('Content copied to clipboard')
        },
    })
}

document.querySelector('#myContent').addEventListener('click', getContent)
