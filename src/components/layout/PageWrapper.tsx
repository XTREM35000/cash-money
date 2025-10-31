import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  maxWidth?: 'default' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const maxWidthClasses = {
  default: 'max-w-6xl',
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full'
};

export const PageWrapper = ({ children, maxWidth = 'default' }: PageWrapperProps) => {
  return (
    <div className="w-full min-w-[320px] flex-1 flex flex-col">
      <div
        className={`w-full min-w-[320px] ${maxWidthClasses[maxWidth]} mx-auto py-6`}
        style={{ width: '100%' }}
      >
        <div className="w-full bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-lg">
          <div className="w-full h-full p-6 bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};