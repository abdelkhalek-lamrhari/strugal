"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { InventoryItem } from "@/lib/inventory"
import { useLanguage } from "@/contexts/language-context" // Import useLanguage

interface InventoryChartProps {
  items: InventoryItem[]
}

const COLORS = {
  aluminum: "#cfb072",
  glass: "#64748b",
}

export default function InventoryChart({ items }: InventoryChartProps) {
  const { t } = useLanguage() // Use the translation hook

  const pieData = [
    {
      name: t("table.badge.aluminum"),
      value: items.filter((item) => item.type === "aluminum").reduce((sum, item) => sum + item.quantity, 0),
      color: COLORS.aluminum,
    },
    {
      name: t("table.badge.glass"),
      value: items.filter((item) => item.type === "glass").reduce((sum, item) => sum + item.quantity, 0),
      color: COLORS.glass,
    },
  ]

  const barData = items.slice(0, 10).map((item) => ({
    name: item.description.slice(0, 20) + (item.description.length > 20 ? "..." : ""),
    quantity: item.quantity,
    type: item.type,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/20 dark:to-primary-900/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t("chart.stock_distribution.title")}</CardTitle>
          <CardDescription>{t("chart.stock_distribution.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [value, t("chart.quantity")]}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t("chart.top_items.title")}</CardTitle>
          <CardDescription>{t("chart.top_items.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="quantity" fill="#cfb072" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
