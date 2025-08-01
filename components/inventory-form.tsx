"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Package, Loader2, Save, X, PlusCircle } from "lucide-react"
import { type InventoryItem, addInventoryItem, updateInventoryItem } from "@/lib/inventory"
import { useLanguage } from "@/contexts/language-context" // Import useLanguage

// Define a type for material options
interface MaterialOption {
  value: string
  label: string
  color: string
}

interface InventoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editItem?: InventoryItem | null
}

export default function InventoryForm({ isOpen, onClose, onSuccess, editItem }: InventoryFormProps) {
  const { t } = useLanguage() // Use the translation hook
  const [type, setType] = useState<string>("aluminum")
  const [quantity, setQuantity] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [showAddTypeDialog, setShowAddTypeDialog] = useState(false)
  const [newTypeName, setNewTypeName] = useState("")
  const [materialTypes, setMaterialTypes] = useState<MaterialOption[]>([
    { value: "aluminum", label: t("table.badge.aluminum"), color: "bg-primary-400" },
    { value: "glass", label: t("table.badge.glass"), color: "bg-gray-400" },
  ])

  useEffect(() => {
    // Update labels when language changes
    setMaterialTypes([
      { value: "aluminum", label: t("table.badge.aluminum"), color: "bg-primary-400" },
      { value: "glass", label: t("table.badge.glass"), color: "bg-gray-400" },
      // Re-add dynamically added types, if any, ensuring their labels are updated if they were translated
      ...materialTypes.filter((mt) => mt.value !== "aluminum" && mt.value !== "glass"),
    ])
  }, [t]) // Re-run when translation function changes (i.e., language changes)

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
        type: type as InventoryItem["type"], // Cast type for backend compatibility. Remember to update backend schema if adding new types.
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
      alert(t("error.failed_to_save"))
    } finally {
      setLoading(false)
    }
  }

  const handleAddNewType = () => {
    if (newTypeName.trim() && !materialTypes.some((mt) => mt.value === newTypeName.toLowerCase())) {
      setMaterialTypes((prev) => [
        ...prev,
        {
          value: newTypeName.toLowerCase(),
          label: newTypeName,
          color: "bg-blue-400", // Default color for new types, can be customized
        },
      ])
      setType(newTypeName.toLowerCase()) // Select the newly added type
      setNewTypeName("")
      setShowAddTypeDialog(false)
    } else {
      alert(t("form.type_exists_error"))
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl">
          <DialogHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              {editItem ? t("form.edit_item.title") : t("form.add_item.title")}
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
                {t("form.material_type")}
              </Label>
              <Select
                value={type}
                onValueChange={(value) => {
                  if (value === "add-new-type") {
                    setShowAddTypeDialog(true)
                  } else {
                    setType(value)
                  }
                }}
              >
                <SelectTrigger className="h-12 border-0 bg-gray-50 dark:bg-gray-700">
                  <SelectValue placeholder={t("form.material_type")} />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((material) => (
                    <SelectItem key={material.value} value={material.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${material.color} rounded-full`}></div>
                        {material.label}
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="add-new-type">
                    <div className="flex items-center gap-2 text-primary-600">
                      <PlusCircle className="w-4 h-4" />
                      {t("form.add_type.option")}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                {t("form.quantity")}
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="0"
                placeholder={t("form.quantity.placeholder")}
                className="h-12 border-0 bg-gray-50 dark:bg-gray-700 text-lg font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                {t("form.description")}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("form.description.placeholder")}
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
                {t("cancel.button")}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg"
              >
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {loading
                  ? t("save.button") + "..."
                  : editItem
                    ? t("update.button") + " " + t("add.button")
                    : t("add.button") + " " + t("add.button")}
              </Button>
            </div>
          </motion.form>
        </DialogContent>
      </Dialog>

      {/* Dialog for adding new material type */}
      <Dialog open={showAddTypeDialog} onOpenChange={setShowAddTypeDialog}>
        <DialogContent className="sm:max-w-sm border-0 shadow-2xl">
          <DialogHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mb-4">
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-xl font-semibold">{t("form.add_new_type_dialog.title")}</DialogTitle>
            <DialogDescription>{t("form.add_new_type_dialog.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder={t("form.new_type_name.placeholder")}
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              className="h-12 border-0 bg-gray-50 dark:bg-gray-700 text-lg font-medium"
            />
            <Button
              onClick={handleAddNewType}
              className="w-full h-12 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg"
            >
              {t("form.add_type.button")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
