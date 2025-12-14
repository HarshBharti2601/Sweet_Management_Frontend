"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertCircle } from "lucide-react"

const API_URL = "https://sweet-management-for-harsh.vercel.app"

interface PurchaseDialogProps {
  sweet: { id: string; name: string; price: number; quantity: number }
  onSuccess: () => void
  children: React.ReactNode
}

export function PurchaseDialog({ sweet, onSuccess, children }: PurchaseDialogProps) {
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const isQuantityExceeded = quantity > sweet.quantity
  const isInvalidQuantity = quantity < 1

  useEffect(() => {
    if (open) {
      setQuantity(1)
    }
  }, [open])

  const handlePurchase = async () => {
    if (isInvalidQuantity) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a quantity of at least 1",
        variant: "destructive",
      })
      return
    }

    if (isQuantityExceeded) {
      toast({
        title: "Insufficient stock",
        description: `Only ${sweet.quantity} items available. Please reduce your quantity.`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]

      const response = await fetch(`${API_URL}/api/sweets/${sweet.id}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Purchase failed")
      }

      toast({
        title: "Purchase successful!",
        description: `You bought ${quantity} ${sweet.name}(s) for $${(sweet.price * quantity).toFixed(2)}`,
      })

      setOpen(false)
      setQuantity(1)
      onSuccess()
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase {sweet.name}</DialogTitle>
          <DialogDescription>How many would you like to purchase? (Available: {sweet.quantity})</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={sweet.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={isLoading}
              className={isQuantityExceeded ? "border-destructive" : ""}
            />
            {isQuantityExceeded && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>Not enough stock available</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <span className="font-medium">Total:</span>
            <span className="text-2xl font-bold text-primary">${(sweet.price * quantity).toFixed(2)}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={isLoading || isQuantityExceeded || isInvalidQuantity}
            variant={isQuantityExceeded ? "destructive" : "default"}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isQuantityExceeded ? "Insufficient Stock" : "Confirm Purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
