"use client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PurchaseDialog } from "./purchase-dialog"
import { RestockDialog } from "./restock-dialog"
import { EditSweetDialog } from "./edit-sweet-dialog"
import { DeleteSweetDialog } from "./delete-sweet-dialog"

const API_URL = "https://sweet-management-for-harsh.vercel.app"

interface Sweet {
  id: string
  name: string
  category: string
  price: number
  quantity: number
}

interface SweetCardProps {
  sweet: Sweet
  isAdmin: boolean
  onUpdate: () => void
}

export function SweetCard({ sweet, isAdmin, onUpdate }: SweetCardProps) {
  const { toast } = useToast()
  const inStock = sweet.quantity > 0

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gradient-to-br from-accent/20 via-primary/10 to-secondary/20 flex items-center justify-center">
        <div className="text-6xl">🍬</div>
      </div>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight text-balance">{sweet.name}</h3>
            <Badge variant="secondary" className="mt-1">
              {sweet.category}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-2xl font-bold text-primary">${sweet.price.toFixed(2)}</span>
          <div className="text-sm text-muted-foreground">
            Stock:{" "}
            <span className={inStock ? "text-foreground font-medium" : "text-destructive font-medium"}>
              {sweet.quantity}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2 flex-col">
        <PurchaseDialog sweet={sweet} onSuccess={onUpdate}>
          <Button className="w-full" disabled={!inStock}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            {inStock ? "Purchase" : "Out of Stock"}
          </Button>
        </PurchaseDialog>

        {isAdmin && (
          <div className="flex gap-2 w-full">
            <RestockDialog sweet={sweet} onSuccess={onUpdate}>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Package className="w-4 h-4 mr-2" />
                Restock
              </Button>
            </RestockDialog>
            <EditSweetDialog sweet={sweet} onSuccess={onUpdate}>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </EditSweetDialog>
            <DeleteSweetDialog sweet={sweet} onSuccess={onUpdate}>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </DeleteSweetDialog>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
