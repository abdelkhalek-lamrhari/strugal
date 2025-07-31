"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Package, Loader2, Save, X } from "lucide-react"
import { type InventoryItem, addInventoryItem, updateInventoryItem } from "@/lib/inventory"

interface InventoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editItem?: InventoryItem | null
}

export default function InventoryForm({ isOpen, onClose, onSuccess, editItem }: InventoryFormProps) {
  const [type, setType] = useState<"aluminum" | "glass">("aluminum")
  const [quantity, setQuantity] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editItem) {
      setType(editItem.type)
      setQuantity(editItem.quantity.toString())
      setDescription(editItem.description)
    } else {
      setType("aluminum")
      setQuantity("")
      setDescription("")
    }
  }, [editItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const itemData = {
        type,
        quantity: Number.parseInt(quantity),
        description,
      }

      if (editItem) {
        await updateInventoryItem(editItem.id, itemData)
      } else {
        await addInventoryItem(itemData)
      }

      onSuccess()
      onClose()
    } catch (error) {
      alert("Failed to save item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            {editItem ? "Edit Inventory Item" : "Add New Item"}
          </DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Material Type
            </Label>
            <Select value={type} onValueChange={(value: "aluminum" | "glass") => setType(value)}>
              <SelectTrigger className="h-12 border-0 bg-gray-50 dark:bg-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aluminum">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary-400 rounded-full"></div>
                    Aluminum
                  </div>
                </SelectItem>
                <SelectItem value="glass">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    Glass
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-medium">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="0"
              placeholder="Enter quantity"
              className="h-12 border-0 bg-gray-50 dark:bg-gray-700 text-lg font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter item description..."
              rows={4}
              className="border-0 bg-gray-50 dark:bg-gray-700 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 border-gray-200 hover:bg-gray-50 bg-transparent"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg"
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {loading ? "Saving..." : editItem ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
