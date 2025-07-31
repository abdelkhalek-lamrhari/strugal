"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp, BarChart3, Activity, Zap, Target } from "lucide-react"
import type { InventoryItem } from "@/lib/inventory"

interface EnhancedDashboardStatsProps {
  items: InventoryItem[]
}

export default function EnhancedDashboardStats({ items }: EnhancedDashboardStatsProps) {
  const aluminumCount = items.filter((item) => item.type === "aluminum").reduce((sum, item) => sum + item.quantity, 0)
  const glassCount = items.filter((item) => item.type === "glass").reduce((sum, item) => sum + item.quantity, 0)
  const totalValue = items.length
  const totalQuantity = aluminumCount + glassCount
  const aluminumPercentage = totalQuantity > 0 ? (aluminumCount / totalQuantity) * 100 : 0
  const glassPercentage = totalQuantity > 0 ? (glassCount / totalQuantity) * 100 : 0

  const stats = [
    {
      title: "Articles Totaux",
      value: totalValue,
      subtitle: "références d'inventaire",
      icon: Package,
      gradient: "from-primary-500 to-primary-600",
      bgGradient: "from-primary-50 to-primary-100 dark:from-primary-950/20 dark:to-primary-900/20",
      iconBg: "bg-primary-500",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Stock Aluminium",
      value: aluminumCount,
      subtitle: "pièces totales",
      icon: BarChart3,
      gradient: "from-primary-500 to-primary-600",
      bgGradient: "from-primary-50 to-primary-100 dark:from-primary-950/20 dark:to-primary-900/20",
      iconBg: "bg-primary-500",
      percentage: aluminumPercentage,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Stock Verre",
      value: glassCount,
      subtitle: "pièces totales",
      icon: Activity,
      gradient: "from-primary-400 to-primary-500",
      bgGradient: "from-primary-50 to-primary-100 dark:from-primary-950/20 dark:to-primary-900/20",
      iconBg: "bg-primary-400",
      percentage: glassPercentage,
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "Efficacité",
      value: "94",
      subtitle: "% de performance",
      icon: Target,
      gradient: "from-primary-600 to-primary-700",
      bgGradient: "from-primary-50 to-primary-100 dark:from-primary-950/20 dark:to-primary-900/20",
      iconBg: "bg-primary-600",
      trend: "+3%",
      trendUp: true,
      isPercentage: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            type: "spring",
            stiffness: 100,
          }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="group"
        >
          <Card
            className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${stat.bgGradient} overflow-hidden relative`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  {stat.title}
                </CardTitle>
                {stat.percentage !== undefined && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 1.5, delay: index * 0.2 }}
                    />
                  </div>
                )}
              </div>
              <motion.div
                className={`h-12 w-12 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </motion.div>
            </CardHeader>

            <CardContent className="relative z-10">
              <div className="flex items-baseline space-x-2">
                <motion.div
                  className="text-3xl font-bold text-gray-900 dark:text-gray-100"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                >
                  {stat.value}
                  {stat.isPercentage ? "%" : ""}
                </motion.div>
                <motion.div
                  className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                    stat.trendUp
                      ? "text-primary-700 bg-primary-100 dark:text-primary-400 dark:bg-primary-900/30"
                      : "text-primary-800 bg-primary-200 dark:text-primary-300 dark:bg-primary-800/30"
                  }`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend}
                </motion.div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
