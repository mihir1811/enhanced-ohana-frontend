import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  showClose?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  className = "",
  showClose = true,
}) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn" />

        {/* Dialog content */}
        <DialogPrimitive.Content
          className={`fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      bg-white rounded-3xl shadow-2xl max-w-xl w-full sm:w-[90vw] 
                      p-0 flex flex-col border border-gray-200 ${className} animate-scaleIn`}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm rounded-t-3xl">
            {title && <h2 className="text-2xl font-semibold text-gray-900 truncate">{title}</h2>}

            {showClose && (
              <DialogPrimitive.Close asChild>
                <button
                  className="ml-4 flex items-center justify-center rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition duration-200"
                  aria-label="Close"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>
              </DialogPrimitive.Close>
            )}
          </div>

          {/* Description */}
          {description && (
            <div className="px-6 pt-3 pb-2 text-gray-600 border-b border-gray-100">
              {description}
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto px-6 py-6 max-h-[75vh] space-y-4">
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default Dialog;
