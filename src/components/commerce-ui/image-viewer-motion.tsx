import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageViewerProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string; 
  imageUrl?:string;
  imageTitle?: string;
  classNamePreview?: string;
  classNameFullscreen?: string;
}

const ImageViewer = forwardRef<HTMLImageElement, ImageViewerProps>(
  ({ className, classNamePreview, classNameFullscreen, imageTitle = "download", src, style, alt, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const internalRef = useRef<HTMLImageElement>(null);
    const [originRect, setOriginRect] = useState<DOMRect | null>(null);

    // Merge Refs
    useImperativeHandle(ref, () => internalRef.current as HTMLImageElement);

    const toggleOpen = () => {
      if (isOpen) {
        setIsOpen(false);
      } else {
        if (internalRef.current) {
          const rect = internalRef.current.getBoundingClientRect();
          setOriginRect(rect);
          setIsOpen(true);
        }
      }
    };

    const getStyle = (): React.CSSProperties => {
      const baseStyle = { ...style }; 

      if (isOpen) {
        return {
          ...baseStyle,
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '100vw',
          height: '100vh',
          maxWidth: 'none',
          maxHeight: 'none',
          margin: 0,
          padding: 0,
          transform: `translate(-50%, -50%)`,
          zIndex: 9999, 
          objectFit: 'contain', 
          cursor: 'default',
          backgroundColor: 'rgba(0,0,0,0.95)', 
        };
      }

      return {
        ...baseStyle,
        cursor: 'pointer',
      };
    };

    return (
      <>
        {isOpen && originRect && (
          <div 
            style={{ 
              width: originRect.width, 
              height: originRect.height,
              display: style?.display || 'inline-block',
              verticalAlign: style?.verticalAlign || 'baseline'
            }} 
            aria-hidden="true"
          />
        )}

        <img
          ref={internalRef}
          src={src}
          alt={alt || imageTitle}
          onClick={!isOpen ? toggleOpen : undefined}
          draggable={false}
          className={cn(
            "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform", 
            !isOpen && "hover:opacity-90 active:scale-95",
            isOpen ? classNameFullscreen : classNamePreview,
            className
          )}
          style={getStyle()}
          {...props}
        />

        {isOpen && (
          <div className="fixed inset-0 z-[10000] pointer-events-none flex flex-col justify-between p-4 animate-in fade-in duration-300">
            
            <div className="flex justify-end gap-2">
                <button
                onClick={toggleOpen}
                className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
                title="Close"
                >
                <X className="size-5" />
                </button>
            </div>

            
          </div>
        )}
      </>
    );
  }
);

ImageViewer.displayName = "ImageViewer";

export default ImageViewer;