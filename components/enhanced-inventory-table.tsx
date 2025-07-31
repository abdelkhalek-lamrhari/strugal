"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Edit,
  Trash2,
  Package,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  Star,
} from "lucide-react"
import { type InventoryItem, deleteInventoryItem } from "@/lib/inventory"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface EnhancedInventoryTableProps {
  items: InventoryItem[]
  onEdit: (item: InventoryItem) => void
  onRefresh: () => void
}

export default function EnhancedInventoryTable({ items, onEdit, onRefresh }: EnhancedInventoryTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof InventoryItem>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filterType, setFilterType] = useState<"all" | "aluminum" | "glass">("all")

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return

    setDeletingId(id)
    try {
      await deleteInventoryItem(id)
      onRefresh()
    } catch (error) {
      alert("Échec de la suppression de l'article")
    } finally {
      setDeletingId(null)
    }
  }

  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedItems = items
    .filter((item) => {
      const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterType === "all" || item.type === filterType
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      const direction = sortDirection === "asc" ? 1 : -1

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * direction
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * direction
      }
      return 0
    })

  if (items.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
        <motion.div
          className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center mb-8 floating-animation"
          whileHover={{ scale: 1.05 }}
        >
          <Package className="h-16 w-16 text-gray-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Aucun article d'inventaire</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Commencez par ajouter votre premier article d'inventaire pour voir vos données ici
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg">
            <Package className="h-4 w-4 mr-2" />
            Ajouter un article
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher dans l'inventaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 border-0 bg-white dark:bg-gray-800 shadow-sm focus:shadow-md transition-shadow"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-12 px-4 bg-white dark:bg-gray-800 border-0 shadow-sm hover:shadow-md"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType("all")}>Tous les types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("aluminum")}>Aluminium uniquement</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("glass")}>Verre uniquement</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="h-12 px-4 bg-white dark:bg-gray-800 border-0 shadow-sm hover:shadow-md">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </motion.div>

      {/* Enhanced Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 border-b-0">
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("type")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Type
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("quantity")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Quantité
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Description</TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("created_at")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Créé
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Mis à jour</TableHead>
              <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredAndSortedItems.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-950/30 dark:hover:to-primary-900/30 transition-all duration-300 border-b border-gray-100 dark:border-gray-700"
                >
                  <TableCell>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Badge
                        variant={item.type === "aluminum" ? "default" : "secondary"}
                        className={`${
                          item.type === "aluminum"
                            ? "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 dark:from-primary-900/30 dark:to-primary-800/30 dark:text-primary-300 border-primary-300"
                            : "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 dark:from-primary-800/20 dark:to-primary-700/20 dark:text-primary-400 border-primary-200"
                        } font-medium px-3 py-1.5 shadow-sm`}
                      >
                        {item.type === "aluminum" ? "Aluminium" : "Verre"}
                      </Badge>
                    </motion.div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="text-2xl font-bold text-gray-900 dark:text-gray-100"
                        whileHover={{ scale: 1.1 }}
                      >
                        {item.quantity}
                      </motion.div>
                      {item.quantity > 100 && <Star className="h-4 w-4 text-primary-500" />}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate font-medium text-gray-900 dark:text-gray-100" title={item.description}>
                      {item.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">
                        {format(new Date(item.created_at), "dd MMM yyyy", { locale: fr })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">
                        {format(new Date(item.updated_at), "dd MMM yyyy", { locale: fr })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-900/30 rounded-xl"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                          className="h-9 w-9 p-0 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-900/30 rounded-xl"
                        >
                          <Edit className="h-4 w-4 text-blue-300" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="h-9 w-9 p-0 hover:bg-primary-200 hover:text-primary-800 dark:hover:bg-primary-800/30 rounded-xl"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </motion.div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0 hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-700/30 rounded-xl"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                          <DropdownMenuItem>Historique</DropdownMenuItem>
                          <DropdownMenuItem>Exporter</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm text-gray-500 dark:text-gray-400"
      >
        Affichage de {filteredAndSortedItems.length} sur {items.length} articles
      </motion.div>
    </div>
  )
}
