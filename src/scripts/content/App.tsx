import React, { useEffect, useState, useCallback, useRef } from 'react'
import ScreenshotOverlay from './ScreenshotOverlay'
import ScreenshotList from './ScreenshotList'
import { captureVisiblePage, cropImage } from './utils'
import './ScreenshotList.css' // Adjust as per your CSS file

const App = () => {
    const [screenshots, setScreenshots] = useState([])
    const [isScreenshotMode, setIsScreenshotMode] = useState(false)
    const selectionRef = useRef(null)

    useEffect(() => {
        // Fetch initial screenshots from storage
        chrome.storage.local.get(['screenshots'], result => {
            setScreenshots(result.screenshots || [])
        })

        // Listen for messages to start screenshot mode
        chrome.runtime.onMessage.addListener(request => {
            if (request.action === 'startScreenshotMode') {
                startScreenshotMode()
            }
        })

        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    const startScreenshotMode = () => {
        setIsScreenshotMode(true)
        document.body.style.cursor = 'crosshair'
        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    const exitScreenshotMode = useCallback(() => {
        setIsScreenshotMode(false)
        document.body.style.cursor = 'default'
        document.removeEventListener('mousedown', handleMouseDown)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        selectionRef.current = null
    }, [])

    useEffect(() => {
        const handleKeyDown = event => {
            if (event.key === 'Escape') {
                exitScreenshotMode()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [exitScreenshotMode])

    const handleMouseDown = event => {
        event.preventDefault()
        selectionRef.current = {
            startX: event.pageX,
            startY: event.pageY,
            startClientX: event.clientX,
            startClientY: event.clientY
        }
    }

    const handleMouseMove = event => {
        if (selectionRef.current) {
            const { startX, startY } = selectionRef.current
            const endX = event.pageX
            const endY = event.pageY
            const selectionBox = document.getElementById('selection-box')
            if (!selectionBox) {
                const newSelectionBox = document.createElement('div')
                newSelectionBox.id = 'selection-box'
                newSelectionBox.style.position = 'absolute'
                newSelectionBox.style.border = '1px solid red'
                newSelectionBox.style.pointerEvents = 'none'
                document.body.appendChild(newSelectionBox)
            }
            const width = Math.abs(endX - startX)
            const height = Math.abs(endY - startY)
            const top = Math.min(startY, endY)
            const left = Math.min(startX, endX)
            const selectionBoxElement = document.getElementById('selection-box')
            selectionBoxElement.style.width = `${width}px`
            selectionBoxElement.style.height = `${height}px`
            selectionBoxElement.style.top = `${top}px`
            selectionBoxElement.style.left = `${left}px`
        }
    }

    const handleMouseUp = async event => {
        if (selectionRef.current) {
            const { startX, startY, startClientX, startClientY } = selectionRef.current
            const endX = event.pageX
            const endY = event.pageY
            const endClientX = event.clientX
            const endClientY = event.clientY
            const scrollX = window.scrollX
            const scrollY = window.scrollY

            try {
                const selectedImage = await captureVisiblePage()
                const croppedImage = await cropImage(
                    selectedImage,
                    startClientX,
                    startClientY,
                    endClientX,
                    endClientY,
                    startX,
                    startY,
                    endX,
                    endY
                )

                const newScreenshot = {
                    id: new Date().getTime(),
                    name: `${new Date().toLocaleString()}`,
                    url: croppedImage
                }

                // Update state and storage with new screenshot
                setScreenshots(prevScreenshots => [...prevScreenshots, newScreenshot])

                chrome.storage.local.get(['screenshots'], result => {
                    const screenshots = result.screenshots || []
                    screenshots.push(newScreenshot)
                    chrome.storage.local.set({ screenshots })
                })
            } catch (error) {
                console.error('Error capturing and cropping the selected area:', error)
            } finally {
                exitScreenshotMode()
            }

            const selectionBox = document.getElementById('selection-box')
            if (selectionBox) {
                selectionBox.remove()
            }
        }
    }

    const onUpdateScreenshot = useCallback(
        (id, newName) => {
            const updatedScreenshots = screenshots.map(screenshot => {
                if (screenshot.id === id) {
                    return { ...screenshot, name: newName }
                }
                return screenshot
            })

            setScreenshots(updatedScreenshots)

            chrome.storage.local.set({ screenshots: updatedScreenshots })
        },
        [screenshots]
    )

    const onDeleteScreenshot = useCallback(id => {
        chrome.storage.local.get(['screenshots'], result => {
            let updatedScreenshots = result.screenshots || []
            updatedScreenshots = updatedScreenshots.filter(s => s.id !== id)

            // Update state and storage after deletion
            setScreenshots(updatedScreenshots)

            chrome.storage.local.set({ screenshots: updatedScreenshots })
        })
    }, [])

    const handleScreenshotClick = useCallback(screenshot => {
        // Handle click on a specific screenshot (optional)
    }, [])

    return (
        <div>
            {isScreenshotMode && (
                <div
                    id="screenshot-overlay"
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.2)',
                        pointerEvents: 'none',
                        zIndex: '9999'
                    }}
                />
            )}
            <ScreenshotList
                screenshots={screenshots}
                onScreenshotClick={handleScreenshotClick}
                onDeleteScreenshot={onDeleteScreenshot}
                onUpdateScreenshot={onUpdateScreenshot}
            />
        </div>
    )
}

export default App
