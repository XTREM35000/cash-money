import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("w-full min-w-[320px] max-w-6xl mx-auto py-6", className)}>
      <div className="w-full bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-lg">
        <div className="w-full min-h-[200px] p-6 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageContainer;