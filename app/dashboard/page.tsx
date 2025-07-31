"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, LogOut, Sparkles, Package } from "lucide-react"
import { getUser, logout } from "@/lib/auth"
import { getInventory, type InventoryItem } from "@/lib/inventory"
import InventoryForm from "@/components/inventory-form"
import InventoryChart from "@/components/inventory-chart"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import { ThemeToggle } from "@/components/theme-toggle"
import EnhancedChatbot from "@/components/enhanced-chatbot"
import EnhancedDashboardStats from "@/components/enhanced-dashboard-stats"
import EnhancedInventoryTable from "@/components/enhanced-inventory-table"
import Image from "next/image"

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<InventoryItem | null>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const currentUser = getUser()
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)
    loadInventory()
  }, [router])

  const loadInventory = async () => {
    try {
      const data = await getInventory()
      setItems(data)
    } catch (error) {
      console.error("Failed to load inventory:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadInventory()
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleEdit = (item: InventoryItem) => {
    setEditItem(item)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditItem(null)
  }

  const handleFormSuccess = () => {
    loadInventory()
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
            <Sparkles className="h-8 w-8 text-primary-400 animate-pulse" />
          </div>
          <p className="text-primary-100 font-medium">Chargement...</p>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <header className="glass-effect shadow-2xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="h-6 w-6 text-primary-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">STRUGAL</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Système d'Inventaire</p>
                </div>
              </motion.div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardSkeleton />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Enhanced Header */}
      <header className="glass-effect shadow-2xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                <Image
                  src="/images/strugal-logo.png"
                  alt="STRUGAL"
                  width={120}
                  height={30}
                  className="object-contain"
                />
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-primary-400/20 to-primary-600/20 rounded-lg blur-lg"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />
              </motion.div>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
              <div>
                <h1 className="text-xl font-bold gradient-text flex items-center gap-2">
                  Système d'Inventaire
                  <Sparkles className="h-5 w-5 text-primary-500" />
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gestion Professionnelle</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Bienvenue,</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  {user?.username}
                  <Sparkles className="h-4 w-4 text-primary-500" />
                </p>
              </div>
              <ThemeToggle />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 bg-white/80 backdrop-blur-sm border-white/20 shadow-lg"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Enhanced Stats Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <EnhancedDashboardStats items={items} />
        </motion.div>

        {/* Enhanced Charts */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <InventoryChart items={items} />
          </motion.div>
        )}

        {/* Enhanced Inventory Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-0 shadow-2xl glass-effect overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-950/20 dark:to-primary-900/20 border-b border-primary-200/50 dark:border-primary-800/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
                    Articles d'Inventaire
                    <Package className="h-6 w-6 text-primary-500" />
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    Gérez votre inventaire d'aluminium et de verre avec style
                  </CardDescription>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 h-12 px-6 rounded-xl"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Nouvel Article
                  </Button>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <EnhancedInventoryTable items={items} onEdit={handleEdit} onRefresh={loadInventory} />
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <InventoryForm isOpen={showForm} onClose={handleCloseForm} onSuccess={handleFormSuccess} editItem={editItem} />
      <EnhancedChatbot />
    </div>
  )
}
