import React, { useEffect, useRef, useCallback, CSSProperties } from 'react'

const ScreenshotOverlay = ({ onComplete, onCancel }) => {
    const isSelecting = useRef(false)
    const startCoords = useRef({ x: 0, y: 0 })
    const endCoords = useRef({ x: 0, y: 0 })
    const selectionRef = useRef(null)

    const drawSelectionRectangle = useCallback((start, end) => {
        if (selectionRef.current) {
            selectionRef.current.remove()
        }

        const rectangle = document.createElement('div')
        rectangle.id = 'rectangle-selector'
        rectangle.style.position = 'absolute'
        rectangle.style.border = '1px solid green'
        rectangle.style.pointerEvents = 'none'
        rectangle.style.zIndex = '100'

        const width = Math.abs(end.x - start.x)
        const height = Math.abs(end.y - start.y)
        const top = Math.min(start.y, end.y)
        const left = Math.min(start.x, end.x)

        rectangle.style.width = `${width}px`
        rectangle.style.height = `${height}px`
        rectangle.style.top = `${top}px`
        rectangle.style.left = `${left}px`

        document.body.appendChild(rectangle)
        selectionRef.current = rectangle
    }, [])

    const handleMouseDown = useCallback(event => {
        event.preventDefault()
        isSelecting.current = true
        startCoords.current = { x: event.pageX, y: event.pageY }
    }, [])

    const handleMouseMove = useCallback(
        event => {
            if (isSelecting.current) {
                endCoords.current = { x: event.pageX, y: event.pageY }
                drawSelectionRectangle(startCoords.current, endCoords.current)
            }
        },
        [drawSelectionRectangle]
    )

    const handleMouseUp = useCallback(() => {
        if (isSelecting.current) {
            isSelecting.current = false
            const selectionBox = selectionRef.current
            if (selectionBox) {
                const { top, left, width, height } = selectionBox.getBoundingClientRect()
                onComplete({ top, left, width, height })
                selectionBox.remove()
                onCancel()
            }
        }
    }, [onComplete])

    useEffect(() => {
        const handleKeyDown = event => {
            if (event.key === 'Escape') {
                onCancel()
            }
        }

        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleMouseDown, handleMouseMove, handleMouseUp, onCancel])

    return <div id="screenshot-overlay" style={overlayStyles}></div>
}

const overlayStyles: CSSProperties = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.1)',
    pointerEvents: 'none',
    zIndex: '9999',
    cursor: 'crosshair'
}

export default ScreenshotOverlay
