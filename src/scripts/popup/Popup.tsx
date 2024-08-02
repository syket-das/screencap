import React, { useCallback, useEffect, useState, useRef } from 'react'
import 'html2canvas'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MdCancel, MdPrint } from 'react-icons/md'
import { FaMinimize, FaMaximize } from 'react-icons/fa6'
import { Switch } from '@/components/ui/switch'
import { useReactToPrint } from 'react-to-print'

const Popup = () => {
    const [screenshots, setScreenshots] = useState([])
    const componentRef = useRef(null)

    useEffect(() => {
        // Fetch initial screenshots from storage

        chrome.storage.local.get(['screenshots'], result => {
            setScreenshots(result.screenshots || [])
        })
    }, [chrome.storage.local.get(['screenshots'])])

    const onUpdateScreenshot = useCallback(
        (id, data) => {
            const updatedScreenshots = screenshots.map(screenshot => {
                if (screenshot.id === id) {
                    return {
                        ...screenshot,
                        name: data.name || screenshot.name,
                        float: data.float ? true : false,
                        minimize: data.minimize ? true : false
                    }
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

    const groupScreenshotsByTabUrl = screenshots => {
        return screenshots.reduce((groups, screenshot) => {
            if (!groups[screenshot.tabUrl]) {
                groups[screenshot.tabUrl] = []
            }
            groups[screenshot.tabUrl].push(screenshot)
            return groups
        }, {})
    }

    const groupedScreenshots = groupScreenshotsByTabUrl(screenshots)

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'screenshot',
        onAfterPrint: () => console.log('Print success!')
    })

    return (
        <div className="h-full mx-auto p-6 bg-gray-100 w-[450px] rounded">
            <div className="">
                <h1 className="text-xl font-bold text-center">Screenshots</h1>

                <div className="my-4 flex flex-col gap-4">
                    {Object.keys(groupedScreenshots).map(tabUrl => (
                        <div key={tabUrl}>
                            <h2 className="text-xs font-semibold mb-4">{tabUrl}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {groupedScreenshots[tabUrl].map(screenshot => (
                                    <Card key={screenshot.id} className="">
                                        <CardContent className="p-1">
                                            <div className="flex gap-2 mb-2 items-center">
                                                <Input
                                                    className="flex-1 border-none  focus:outline-none  rounded text-black"
                                                    value={screenshot.name}
                                                    onVolumeChange={val =>
                                                        onUpdateScreenshot(screenshot.id, {
                                                            ...screenshot,
                                                            name: val
                                                        })
                                                    }
                                                />
                                                <Button
                                                    onClick={() =>
                                                        onDeleteScreenshot(screenshot.id)
                                                    }
                                                    size="icon"
                                                    variant="destructive"
                                                    className="rounded-full w-5 h-5"
                                                >
                                                    <MdCancel className="w-4 h-4 text-white" />
                                                </Button>
                                            </div>
                                            <ImageComponent
                                                screenshot={screenshot}
                                                componentRef={componentRef}
                                            />
                                            <div className="flex   gap-2 mt-2 items-center justify-end">
                                                <Switch
                                                    checked={screenshot.float}
                                                    onCheckedChange={e =>
                                                        onUpdateScreenshot(screenshot.id, {
                                                            ...screenshot,
                                                            float: e ? true : false
                                                        })
                                                    }
                                                />
                                                {/* <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="rounded-full w-6 h-6 "
                                                    onClick={handlePrint}
                                                >
                                                    <MdPrint className="w-5 h-5 text-blue-600" />
                                                </Button> */}
                                                <Button
                                                    onClick={() =>
                                                        onUpdateScreenshot(screenshot.id, {
                                                            ...screenshot,
                                                            minimize: !screenshot.minimize
                                                        })
                                                    }
                                                    size="icon"
                                                    variant="ghost"
                                                    className="rounded-full w-6 h-6 "
                                                >
                                                    {screenshot.minimize ? (
                                                        <FaMaximize className="w-5 h-5 text-red-600 animate-pulse" />
                                                    ) : (
                                                        <FaMinimize className="w-5 h-5 text-green-600 " />
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Popup

const ImageComponent = ({ screenshot, componentRef }) => {
    return (
        <img
            ref={componentRef}
            src={screenshot.url}
            alt={screenshot.name}
            className="rounded w-full h-32 object-cover"
        />
    )
}
