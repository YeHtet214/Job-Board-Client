import React, { ReactNode } from 'react'

interface AuthLayoutProps {
    children: ReactNode
    title: string
    subtitle: string
    imageSrc?: string
    imagePosition?: 'left' | 'right'
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    subtitle,
    imageSrc = '../assets/auth-background-alt.svg', // Default image
    imagePosition = 'left',
}) => {
    return (
        <div className="min-h-screen bg-jb-bg relative overflow-x-hidden">
            {/* Background pattern */}
            <div
                className="absolute top-0 bottom-0 inset-0 opacity-5"
                style={{
                    backgroundImage: `url(${imageSrc})`,
                    backgroundSize: 'auto',
                    backgroundPosition: 'center',
                }}
                aria-hidden="true"
            />

            {/* Mobile layout */}
            <div className="lg:hidden relative min-h-screen">
                <div
                    className="absolute inset-0 bg-gradient-to-b from-jb-bg/40 via-jb-bg/60 to-jb-bg/80 opacity-5"
                    style={{
                        backgroundImage: `url(${imageSrc})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                    aria-hidden="true"
                />
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
                    <div className="w-full max-w-md text-center mb-6">
                        <h1 className="text-3xl font-bold tracking-tight text-jb-text mb-2">
                            {title}
                        </h1>
                        <p className="text-jb-text-muted">{subtitle}</p>
                    </div>
                    <div className="w-full max-w-md backdrop-blur-md bg-jb-surface/80 rounded-xl p-2 shadow-lg border border-jb-primary/10">
                        {children}
                    </div>
                </div>
            </div>

            {/* Desktop layout */}
            <div className="hidden lg:flex w-full relative">
                {/* Content wrapper */}
                <div className="grid grid-cols-2 w-full relative z-10">
                    {/* Info section */}
                    <div
                        className={`cols-6 flex items-center justify-center p-12 ${
                            imagePosition === 'right'
                                ? 'order-first'
                                : 'order-last'
                        }`}
                    >
                        <div
                            className={`p-8 rounded-2xl backdrop-blur-sm
                                ${
                                    imagePosition === 'left'
                                        ? 'bg-gradient-to-l from-transparent to-jb-primary/5'
                                        : 'bg-gradient-to-r from-transparent to-jb-primary/5'
                                }
                            `}
                        >
                            <h1 className="text-4xl font-bold tracking-tight text-jb-text mb-4">
                                {title}
                            </h1>
                            <p className="text-xl text-jb-text-muted">
                                {subtitle}
                            </p>
                            <div className="mt-8 h-1 w-24 bg-gradient-to-r from-jb-primary to-jb-primary/30 rounded-full"></div>
                        </div>
                    </div>

                    {/* Form section */}
                    <div
                        className={`cols-6 p-12 flex items-center justify-center ${
                            imagePosition === 'left'
                                ? 'order-first'
                                : 'order-last'
                        }`}
                    >
                        <div className="bg-jb-surface/95 backdrop-blur-md rounded-xl shadow-xl p-6 border border-jb-primary/10">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
