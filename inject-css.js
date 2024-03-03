async function injectCssStyles() {
  const [tab] = await chrome.tabs.query({ active: true })
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      function injectStyles() {
        const css = `
          .responsive-banner {
            margin: 10px auto;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            text-transform: uppercase;
            color: #000;
            width: 60%;
            height: 300px;
            border: 3px solid;
            padding: 0.25em 0.5em;
            box-shadow: 1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px, 5px 5px 0px 0px;
          }
          .info-container{
            display: flex;
            width: 100%;
            justify-content: space-between;
          }

          .button-74 {
            background-color: #fbeee0;
            border: 2px solid #422800;
            border-radius: 30px;
            box-shadow: #422800 4px 4px 0 0;
            color: #422800;
            cursor: pointer;
            display: inline-block;
            font-weight: 600;
            font-size: 18px;
            padding: 0 18px;
            line-height: 50px;
            text-align: center;
            text-decoration: none;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
          }
          
          .button-74:hover {
            background-color: #fff;
          }
          
          .button-74:active {
            box-shadow: #422800 2px 2px 0 0;
            transform: translate(2px, 2px);
          }
          
          @media (min-width: 768px) {
            .button-74 {
              min-width: 120px;
              padding: 0 25px;
            }
          }
          .copied , .copied:hover {
            background-color: rgb(3, 172, 115);
            border-color: rgb(0, 112, 75);
          }
        `

        const style = document.createElement('style')

        if (style.styleSheet) {
          style.styleSheet.cssText = css
        } else {
          style.append(document.createTextNode(css))
        }

        document.querySelectorAll('head')[0].append(style)
      }
      injectStyles()
    }
  })
}

injectCssStyles()
