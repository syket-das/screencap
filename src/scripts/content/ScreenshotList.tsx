import React from 'react'
import { Rnd } from 'react-rnd'
import './ScreenshotList.css'

const ScreenshotList = ({
    screenshots,
    onScreenshotClick,
    onDeleteScreenshot,
    onUpdateScreenshot
}) => {
    const handleNameChange = (id, newName) => {
        onUpdateScreenshot(id, newName)
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
                <Rnd
                    key={screenshot.id}
                    default={{
                        x: 0,
                        y: 0,
                        width: 200,
                        height: 200
                    }}
                    bounds="window"
                    className="border border-gray-300 rounded-md shadow-md bg-white"
                    resizeHandleStyles={{
                        bottomRight: {
                            width: 10,
                            height: 10,
                            background: 'blue',
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            cursor: 'se-resize'
                        }
                    }}
                >
                    <div>
                        <div className="flex items-center justify-between bg-slate-100 p-2 w-full h-[20%]">
                            <input
                                type="text"
                                value={screenshot.name}
                                onChange={e => handleNameChange(screenshot.id, e.target.value)}
                                className="text-sm font-bold bg-slate-200 border-none focus:outline-none w-1/3 p-1 rounded text-black"
                            />
                            <button
                                className="text-sm font-bold bg-red-600 rounded-full text-white p-1"
                                onClick={() => onDeleteScreenshot(screenshot.id)}
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                >
                                    <path
                                        d="M256 73.82A182.18 182.18 0 1 0 438.18 256 182.18 182.18 0 0 0 256 73.82zm90.615 272.724a24.554 24.554 0 0 1-34.712 0l-54.664-54.667-57.142 57.146a24.544 24.544 0 0 1-34.704-34.717l57.138-57.128-53.2-53.209a24.547 24.547 0 0 1 34.712-34.717l53.196 53.208 50.717-50.72a24.547 24.547 0 0 1 34.713 34.716l-50.713 50.722 54.659 54.65a24.56 24.56 0 0 1 0 34.717z"
                                        data-name="Close"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <img
                        src={screenshot.url}
                        alt={screenshot.id}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'fill',
                            objectPosition: 'center',
                            border: '1px solid #ccc',
                            zIndex: '9999'
                        }}
                        onClick={() => onScreenshotClick(screenshot)}
                    />
                </Rnd>
            ))}
        </div>
    )
}

export default ScreenshotList
