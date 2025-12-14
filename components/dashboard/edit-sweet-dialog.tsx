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
import { Loader2 } from "lucide-react"

const API_URL = "https://sweet-management-for-harsh.vercel.app"

interface EditSweetDialogProps {
  sweet: { id: string; name: string; category: string; price: number; quantity: number }
  onSuccess: () => void
  children: React.ReactNode
}

export function EditSweetDialog({ sweet, onSuccess, children }: EditSweetDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(sweet.name)
  const [category, setCategory] = useState(sweet.category)
  const [price, setPrice] = useState(sweet.price.toString())
  const [quantity, setQuantity] = useState(sweet.quantity.toString())
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setName(sweet.name)
    setCategory(sweet.category)
    setPrice(sweet.price.toString())
    setQuantity(sweet.quantity.toString())
  }, [sweet, open])

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]

      const response = await fetch(`${API_URL}/api/sweets/${sweet.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          category,
          price: Number.parseFloat(price),
          quantity: Number.parseInt(quantity),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update sweet")
      }

      toast({
        title: "Sweet updated!",
        description: `${name} has been updated`,
      })

      setOpen(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Failed to update sweet",
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
          <DialogTitle>Edit Sweet</DialogTitle>
          <DialogDescription>Update the sweet's information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Input
              id="edit-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-price">Price ($)</Label>
            <Input
              id="edit-price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-quantity">Quantity</Label>
            <Input
              id="edit-quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
