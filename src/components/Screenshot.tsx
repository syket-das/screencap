import React, { useRef } from 'react'
import { Rnd } from 'react-rnd'
import { Button } from './ui/button'
import { IoMdResize } from 'react-icons/io'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Switch } from './ui/switch'
import { MdCancel, MdPrint } from 'react-icons/md'
import { BiSolidMinusCircle } from 'react-icons/bi'
import { useReactToPrint } from 'react-to-print'

const Screenshot = ({
    screenshot,
    activeTab,
    onDeleteScreenshot,
    onUpdateScreenshot
}: {
    screenshot: any
    activeTab: any
    onDeleteScreenshot: any
    onUpdateScreenshot: any
}) => {
    const componentRef = useRef(null)

    const handleNameChange = (id, newName) => {
        onUpdateScreenshot(id, {
            ...screenshot,
            name: newName
        })
    }

    const handleFloatChange = (id, e) => {
        onUpdateScreenshot(id, {
            ...screenshot,
            float: e ? true : false
        })
    }

    const handleMinimizeChange = (id, minimize) => {
        onUpdateScreenshot(id, {
            ...screenshot,
            minimize: minimize ? true : false
        })
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: screenshot.name,
        onAfterPrint: () => console.log('Print success!')
    })

    const displayCondition = () => {
        if (!screenshot.minimize) {
            if (!screenshot.float) {
                if (screenshot.tabUrl === activeTab.url) {
                    return 'block'
                } else if (screenshot.tabUrl !== activeTab.url) {
                    return 'none'
                }
            } else {
                return 'block'
            }
        }
        return 'none'
    }

    return (
        <Rnd
            minWidth={250}
            minHeight={200}
            resizeHandleComponent={{
                bottomRight: (
                    <Button
                        size="icon"
                        variant="default"
                        className="rounded-full w-6 h-6 bg-gray-200 hover:bg-gray-300 cursor-crosshair"
                    >
                        <IoMdResize className="w-4 h-4 text-gray-700" />
                    </Button>
                )
            }}
            style={{
                display: displayCondition()
            }}
            key={screenshot.id}
            default={{
                x: 0,
                y: 0,
                width: 250,
                height: 200
            }}
            bounds="window"
            className="border border-gray-300 rounded-md shadow-md bg-white h-full w-full"
        >
            <div className="relative h-full">
                <div className="flex items-center justify-between bg-slate-100 p-2 w-full h-[50px]">
                    <input
                        type="text"
                        value={screenshot.name}
                        onChange={e => handleNameChange(screenshot.id, e.target.value)}
                        className="text-sm font-bold bg-slate-200 border-none focus:outline-none w-1/3 p-1 rounded text-black"
                    />

                    <TooltipProvider>
                        <div className="flex gap-2 items-center">
                            <Tooltip>
                                <TooltipTrigger>
                                    <Switch
                                        checked={screenshot.float}
                                        onCheckedChange={e => handleFloatChange(screenshot.id, e)}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Float in different window</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        size="icon"
                                        variant="default"
                                        className="rounded-full w-6 h-6 bg-green-600 hover:bg-green-700"
                                        onClick={handlePrint}
                                    >
                                        <MdPrint className="w-4 h-4 text-white" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Print</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        onClick={() =>
                                            handleMinimizeChange(
                                                screenshot.id,
                                                !screenshot.minimize
                                            )
                                        }
                                        size="icon"
                                        variant="default"
                                        className="rounded-full w-6 h-6 bg-blue-600 hover:bg-blue-700 "
                                    >
                                        <BiSolidMinusCircle className="w-4 h-4 text-white" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Minimize the window</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        onClick={() => onDeleteScreenshot(screenshot.id)}
                                        size="icon"
                                        variant="destructive"
                                        className="rounded-full w-6 h-6"
                                    >
                                        <MdCancel className="w-4 h-4 text-white" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </TooltipProvider>
                </div>
                <img
                    ref={componentRef}
                    src={screenshot.url}
                    alt={screenshot.id}
                    style={{
                        width: '100%',
                        height: 'calc(100% - 50px)',
                        objectFit: 'fill',
                        objectPosition: 'center',
                        border: '1px solid #ccc',
                        zIndex: '9999'
                    }}
                />
            </div>
        </Rnd>
    )
}

export default Screenshot
