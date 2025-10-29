import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DraggableModalWrapper } from './draggable-modal-wrapper';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  draggable?: boolean;
  className?: string;
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
  draggable = false,
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full'
  };

  // If draggable requested, render the DraggableModalWrapper which provides
  // framer-motion based dragging and nice animations. Otherwise keep Dialog.
  const wantsDraggable = (className || '').includes('draggable') || draggable;

  if (wantsDraggable) {
    return (
      <DraggableModalWrapper isOpen={isOpen} onClose={onClose} className={`${sizeClasses[size]} ${className || ''}`}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DraggableModalWrapper>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${sizeClasses[size]} ${className || ''}`}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;

// Note: La fonction draggable n'est plus nécessaire car le Dialog de shadcn/ui
// gère déjà les interactions de base comme la fermeture par clic à l'extérieur
// et la touche Escape
