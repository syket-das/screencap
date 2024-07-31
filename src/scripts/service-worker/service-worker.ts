console.log('Background Service Worker Loaded')

chrome.runtime.onInstalled.addListener(async () => {
    console.log('Extension installed')
})

chrome.action.setBadgeText({ text: 'ON' })

chrome.action.onClicked.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const activeTab = tabs[0]
        chrome.tabs.sendMessage(activeTab.id!, { message: 'clicked_browser_action' })
    })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { command } = message
    switch (command) {
        case 'hello-world':
            console.log('Hello World, from the Background Service Worker')
            sendResponse({ success: true, message: 'Hello World' })
            break
        default:
            break
    }
})

chrome.commands.onCommand.addListener(command => {
    console.log(`Command: ${command}`)

    if (command === 'refresh_extension') {
        chrome.runtime.reload()
    }
})

// returns visible tab as imageURL format
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'captureVisibleTab') {
        chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 100 }, dataUrl => {
            sendResponse({ dataUrl: dataUrl })
        })
        return true // To indicate that the response will be sent asynchronously
    }
})

// sends action startScreenshotMode when pressing keybind defined in manifest.hson
chrome.commands.onCommand.addListener(function (command) {
    if (command === 'startScreenshotModeShortcut') {
        // Send a message to the content script to start the screenshot mode
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'startScreenshotMode' })
        })
    }
})

export {}
