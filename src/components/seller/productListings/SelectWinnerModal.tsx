'use client'

import React, { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Trophy, Loader2 } from 'lucide-react'
import { auctionService } from '@/services/auctionService'
import { toast } from 'react-hot-toast'
import { getCookie } from '@/lib/cookie-utils'

interface Bid {
  id?: number
  buyerId: string
  amount: string | number
  createdAt?: string
}

interface AuctionData {
  id: number
  bids: Bid[]
  product?: { name?: string }
}

interface SelectWinnerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  auctionId: string | number | null
  productName?: string
  onSuccess?: () => void
}

export default function SelectWinnerModal({
  open,
  onOpenChange,
  auctionId,
  productName,
  onSuccess,
}: SelectWinnerModalProps) {
  const [loading, setLoading] = useState(false)
  const [bids, setBids] = useState<Bid[]>([])
  const [selectingId, setSelectingId] = useState<string | null>(null)
  const [confirmWinner, setConfirmWinner] = useState<Bid | null>(null)

  useEffect(() => {
    if (!open || !auctionId) return
    setLoading(true)
    setBids([])
    auctionService
      .getAuctionById<AuctionData>(String(auctionId))
      .then((res) => {
        const bidList = res?.data?.bids ?? []
        setBids(bidList)
      })
      .catch(() => {
        toast.error('Failed to load auction bids')
        onOpenChange(false)
      })
      .finally(() => setLoading(false))
  }, [open, auctionId, onOpenChange])

  const handleSelectWinner = async (bid: Bid) => {
    if (!auctionId) return
    const token = getCookie('token')
    if (!token) {
      toast.error('Please sign in to continue')
      return
    }
    setSelectingId(bid.buyerId)
    try {
      await auctionService.selectWinner(
        String(auctionId),
        bid.buyerId,
        token
      )
      toast.success('Winner selected and notified')
      setConfirmWinner(null)
      onOpenChange(false)
      onSuccess?.()
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Failed to select winner'
      toast.error(msg)
    } finally {
      setSelectingId(null)
    }
  }

  const formatAmount = (amt: string | number) => {
    const n = typeof amt === 'string' ? parseFloat(amt) : amt
    return isNaN(n) ? '—' : `$${n.toLocaleString()}`
  }

  const formatDate = (d?: string) => {
    if (!d) return '—'
    try {
      return new Date(d).toLocaleString()
    } catch {
      return '—'
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg sm:w-[95vw] rounded-2xl shadow-2xl border flex flex-col p-0"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="flex items-center justify-between px-6 py-4 border-b rounded-t-2xl"
            style={{ borderColor: 'var(--border)' }}
          >
            <Dialog.Title
              className="text-xl font-bold flex items-center gap-2"
              style={{ color: 'var(--foreground)' }}
            >
              <Trophy className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              Select Auction Winner
            </Dialog.Title>
            <Dialog.Close
              className="rounded-full p-2 hover:opacity-80 transition"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="px-6 py-4">
            {productName && (
              <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
                Product: {productName}
              </p>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--primary)' }} />
              </div>
            ) : bids.length === 0 ? (
              <p className="py-8 text-center" style={{ color: 'var(--muted-foreground)' }}>
                No bids placed yet. Cannot select a winner.
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {bids.map((bid, idx) => (
                  <div
                    key={bid.id ?? bid.buyerId + idx}
                    className="flex items-center justify-between gap-4 p-4 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold" style={{ color: 'var(--primary)' }}>
                        {formatAmount(bid.amount)}
                      </p>
                      <p className="text-xs mt-1 font-mono break-all" style={{ color: 'var(--muted-foreground)' }}>
                        User ID: {bid.buyerId}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {formatDate(bid.createdAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={!!selectingId}
                      onClick={() => setConfirmWinner(bid)}
                      className="px-3 py-1.5 rounded text-sm font-medium transition disabled:opacity-50"
                      style={{
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                      }}
                    >
                      {selectingId === bid.buyerId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Select Winner'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      {/* Confirmation modal */}
      {confirmWinner && (
        <Dialog.Root open={!!confirmWinner} onOpenChange={() => setConfirmWinner(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50" />
            <Dialog.Content
              className="fixed z-[60] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm w-[90vw] p-6 rounded-xl border shadow-xl"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
              }}
            >
              <p className="text-base mb-2" style={{ color: 'var(--foreground)' }}>
                Select this bidder as the winner?
              </p>
              <p className="text-lg font-semibold mb-1" style={{ color: 'var(--primary)' }}>
                {formatAmount(confirmWinner.amount)}
              </p>
              <p className="text-xs font-mono break-all mb-4" style={{ color: 'var(--muted-foreground)' }}>
                User ID: {confirmWinner.buyerId}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmWinner(null)}
                  className="px-4 py-2 rounded border font-medium"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectWinner(confirmWinner)}
                  disabled={!!selectingId}
                  className="px-4 py-2 rounded font-medium disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                  }}
                >
                  {selectingId ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </Dialog.Root>
  )
}
