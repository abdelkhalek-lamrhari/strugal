"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Package, Calendar } from "lucide-react"
import { type InventoryItem, deleteInventoryItem } from "@/lib/inventory"
import { format } from "date-fns"
import { fr, es } from "date-fns/locale" // Import both locales
import { useLanguage } from "@/contexts/language-context" // Import useLanguage

interface InventoryTableProps {
  items: InventoryItem[]
  onEdit: (item: InventoryItem) => void
  onRefresh: () => void
}

export default function InventoryTable({ items, onEdit, onRefresh }: InventoryTableProps) {
  const { t, language } = useLanguage() // Use the translation hook and language
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirm.delete"))) return

    setDeletingId(id)
    try {
      await deleteInventoryItem(id)
      onRefresh()
    } catch (error) {
      alert(t("error.failed_to_delete"))
    } finally {
      setDeletingId(null)
    }
  }

  const currentLocale = language === "fr" ? fr : es // Select locale based on current language

  if (items.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mb-6">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t("table.no_items.title")}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{t("table.no_items.description")}</p>
      </motion.div>
    )
  }

  return (
    <div className="border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <TableHead className="font-semibold">{t("table.type")}</TableHead>
            <TableHead className="font-semibold">{t("table.quantity")}</TableHead>
            <TableHead className="font-semibold">{t("table.description")}</TableHead>
            <TableHead className="font-semibold">{t("table.created")}</TableHead>
            <TableHead className="font-semibold">{t("table.updated")}</TableHead>
            <TableHead className="text-right font-semibold">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="group hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
              >
                <TableCell>
                  <Badge
                    variant={item.type === "aluminum" ? "default" : "secondary"}
                    className={`${
                      item.type === "aluminum"
                        ? "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    } font-medium px-3 py-1`}
                  >
                    {item.type === "aluminum" ? t("table.badge.aluminum") : t("table.badge.glass")}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-lg">{item.quantity}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={item.description}>
                    {item.description}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(item.created_at), "MMM dd, yyyy", { locale: currentLocale })}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(item.updated_at), "MMM dd, yyyy", { locale: currentLocale })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(item)}
                      className="h-8 w-8 p-0 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-900/30"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  )
}
