import React from 'react';
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  hero?: React.ReactNode;
  className?: string;
}

const PageLayout = ({ children, hero, className }: PageLayoutProps) => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-lg">
      <div className="w-full p-6 bg-white">
        {/* Hero Section */}
        {hero && <div className="w-full mb-6">{hero}</div>}

        {/* Main Content */}
        <div className={cn("space-y-8", className)}>
          {children}
        </div>
      </div>
    </div>
  );
};

interface PageHeroProps {
  imageUrl: string;
  imageAlt: string;
  children: React.ReactNode;
  overlay?: boolean;
}

const PageHero = ({ imageUrl, imageAlt, children, overlay = true }: PageHeroProps) => {
  return (
    <div className="relative h-72 rounded-2xl overflow-hidden shadow-2xl">
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={imageAlt}
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Optional Overlay */}
      {overlay && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundSize: '15px 15px' }} />
        </>
      )}

      {/* Hero Content */}
      <div className="relative h-full flex items-center px-8">
        {children}
      </div>
    </div>
  );
};

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

const PageContent = ({ children, className }: PageContentProps) => {
  return (
    <div className={cn("grid gap-6", className)}>
      {children}
    </div>
  );
};

export { PageLayout, PageHero, PageContent };