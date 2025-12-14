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
import { useRouter } from "next/navigation"

const API_URL = "https://sweet-management-for-harsh.vercel.app"

interface AddSweetDialogProps {
  children: React.ReactNode
}

export function AddSweetDialog({ children }: AddSweetDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]

      const response = await fetch(`${API_URL}/api/sweets`, {
        method: "POST",
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
        throw new Error(data.message || "Failed to add sweet")
      }

      toast({
        title: "Sweet added!",
        description: `${name} has been added to the catalog`,
      })

      setOpen(false)
      setName("")
      setCategory("")
      setPrice("")
      setQuantity("")
      router.refresh()
      window.location.reload()
    } catch (error) {
      toast({
        title: "Failed to add sweet",
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
          <DialogTitle>Add New Sweet</DialogTitle>
          <DialogDescription>Add a new sweet to your shop's catalog</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Chocolate Bar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="Chocolate"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="2.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-quantity">Initial Quantity</Label>
            <Input
              id="add-quantity"
              type="number"
              placeholder="50"
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
          <Button onClick={handleSubmit} disabled={isLoading || !name || !category || !price || !quantity}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Sweet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
