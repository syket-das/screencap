import React, { useEffect, useState } from 'react'
import './ScreenshotList.css'

import Screenshot from '@/components/Screenshot'

const ScreenshotList = ({
    screenshots,
    onScreenshotClick,
    onDeleteScreenshot,
    onUpdateScreenshot
}) => {
    const [activeTab, setActiveTab] = useState(null)

    useEffect(() => {
        chrome.runtime.sendMessage({ command: 'getActiveTab' }, response => {
            if (response && response.tab) {
                setActiveTab(response.tab)
            }
        })
    }, [])

    if (!activeTab?.id) {
        return null
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: '0',
                left: '0',
                maxWidth: '100%',
                height: 'auto',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '5px',
                zIndex: '9999'
            }}
        >
            {screenshots.map(screenshot => (
                <Screenshot
                    key={screenshot.id}
                    screenshot={screenshot}
                    activeTab={activeTab}
                    onDeleteScreenshot={onDeleteScreenshot}
                    onUpdateScreenshot={onUpdateScreenshot}
                />
            ))}
        </div>
    )
}

export default ScreenshotList
