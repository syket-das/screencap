export const captureVisiblePage = () => {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'captureVisibleTab' }, response => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message))
            } else {
                resolve(response.dataUrl)
            }
        })
    })
}

export const cropImage = (
    selectedImage,
    startClientX,
    startClientY,
    endClientX,
    endClientY,
    startX,
    startY,
    endX,
    endY
) => {
    return new Promise((resolve, reject) => {
        console.log('cropping image')
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        const img = new Image()
        img.src = selectedImage

        img.onload = function () {
            // Set canvas dimensions to match the selected area
            const pixelRatio = window.devicePixelRatio || 1
            const sx = Math.min(startClientX, endClientX) * pixelRatio
            const sy = Math.min(startClientY, endClientY) * pixelRatio
            const swidth = Math.abs(endX - startX) * pixelRatio
            const sheight = Math.abs(endY - startY) * pixelRatio
            const dwidth = swidth
            const dheight = sheight
            canvas.width = swidth
            canvas.height = sheight

            console.log(`cropping attrs (sx, sy, width, height): ${[sx, sy, swidth, sheight]}`)
            // Draw the selected area onto the canvas
            context.drawImage(img, sx, sy, swidth, sheight, 0, 0, dwidth, dheight)

            const croppedImageDataUrl = canvas.toDataURL()
            resolve(croppedImageDataUrl)
        }

        img.onerror = function (error) {
            reject(error)
        }
    })
}
