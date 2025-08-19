"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"

export function ConfirmModal({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  open,
  onOpenChange,
  onYes,
  onNo,
}: {
  title?: string
  description?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onYes: () => void
  onNo: () => void
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-all duration-300" />

        {/* Modal content */}
        <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg sm:w-[95vw] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-800 flex flex-col p-0 animate-scaleIn">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur rounded-t-2xl">
            <Dialog.Title className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-zinc-100 truncate">
              {title}
            </Dialog.Title>
            <Dialog.Close className="ml-4 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 transition">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          {/* Description */}
          <Dialog.Description className="px-6 pt-4 pb-2 text-base text-gray-600 dark:text-zinc-400 border-b">
            {description}
          </Dialog.Description>

          {/* Action buttons */}
          <div className="px-6 py-6 flex justify-end gap-4 bg-white dark:bg-zinc-900 rounded-b-2xl">
            <button
              onClick={() => {
                onNo()
                onOpenChange(false)
              }}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-gray-300 transition font-semibold shadow-sm"
            >
              No
            </button>
            <button
              onClick={() => {
                onYes()
                onOpenChange(false)
              }}
              className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition font-semibold shadow-sm"
            >
              Yes
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
