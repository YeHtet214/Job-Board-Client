import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    size = 'md', 
    className = '', 
    fullScreen = false 
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    const spinnerSize = sizeClasses[size];

    return (
        <div className={`flex items-center justify-center ${fullScreen ? 'fixed inset-0 bg-jb-surface/50 z-50' : ''} ${className}`}>
            <div className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-b-2 border-jb-primary`}></div>
        </div>
    );
};

export default LoadingSpinner;