import React from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'

const OnInstalled = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    How to Use Easy Screenshot
                </h1>
                <p className="text-lg text-gray-600">
                    Follow these steps to capture and manage screenshots with ease.
                </p>
            </header>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Step 1: Activate Screenshot Mode
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                    To activate screenshot mode, press{' '}
                    <strong className="font-semibold">Ctrl + Shift + Y</strong>.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Step 2: Select Area to Capture
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                    Click and drag your mouse to select the area of your screen you want to capture.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Step 3: Manage Your Screenshots
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                    All captured screenshots will be displayed in the sidebar. You can click on a
                    screenshot to view it or delete it if necessary.
                </p>
            </section>
        </div>
    )
}

const container = document.getElementById('onInstalled')
const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <OnInstalled />
    </React.StrictMode>
)
