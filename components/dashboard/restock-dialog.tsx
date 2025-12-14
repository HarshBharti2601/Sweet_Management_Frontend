"use client"

import type React from "react"

import { useState } from "react"
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
import { Loader2 } from "lucide-react"

const API_URL = "https://sweet-management-for-harsh.vercel.app"

interface RestockDialogProps {
  sweet: { id: string; name: string; quantity: number }
  onSuccess: () => void
  children: React.ReactNode
}

export function RestockDialog({ sweet, onSuccess, children }: RestockDialogProps) {
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleRestock = async () => {
    setIsLoading(true)

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]

      const response = await fetch(`${API_URL}/api/sweets/${sweet.id}/restock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Restock failed")
      }

      toast({
        title: "Restocked successfully!",
        description: `Added ${quantity} units to ${sweet.name}`,
      })

      setOpen(false)
      setQuantity(10)
      onSuccess()
    } catch (error) {
      toast({
        title: "Restock failed",
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
          <DialogTitle>Restock {sweet.name}</DialogTitle>
          <DialogDescription>Current stock: {sweet.quantity} units</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="restock-quantity">Quantity to Add</Label>
            <Input
              id="restock-quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={isLoading}
            />
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between text-sm mb-1">
              <span>Current stock:</span>
              <span className="font-medium">{sweet.quantity}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Adding:</span>
              <span className="font-medium">+{quantity}</span>
            </div>
            <div className="border-t border-border mt-2 pt-2 flex justify-between font-semibold">
              <span>New stock:</span>
              <span className="text-primary">{sweet.quantity + quantity}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleRestock} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Restock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
