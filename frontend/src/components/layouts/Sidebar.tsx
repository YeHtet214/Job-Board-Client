import React, { useState } from 'react'

interface SidebarProps {
    title?: string
    children: React.ReactNode
    className?: string
    collapsible?: boolean
}

const Sidebar: React.FC<SidebarProps> = ({
    title = 'Filters',
    children,
    className = '',
    collapsible = true,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <aside className={`bg-card rounded-lg shadow-md p-5 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-jobboard-darkblue">
                    {title}
                </h3>
                {collapsible && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-expanded={!isCollapsed}
                        aria-label={
                            isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                        }
                    >
                        {isCollapsed ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </button>
                )}
            </div>

            <div
                className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'h-0 opacity-0 overflow-hidden' : 'opacity-100'}`}
            >
                {children}
            </div>
        </aside>
    )
}

export default Sidebar
