import React from 'react'
import 'html2canvas'
const Popup = () => {
    document.addEventListener('DOMContentLoaded', function () {
        var button = document.getElementById('screenshotButton')

        button.addEventListener('click', function () {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'startScreenshotMode' })
            })
        })
    })

    return <div className="max-w-7xl mx-auto p-6 bg-gray-100"></div>
}

export default Popup
