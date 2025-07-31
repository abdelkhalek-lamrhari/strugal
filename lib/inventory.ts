import { supabase } from "./supabase"

export interface InventoryItem {
  id: number
  type: "aluminum" | "glass"
  quantity: number
  description: string
  created_at: string
  updated_at: string
}

export async function getInventory(): Promise<InventoryItem[]> {
  const { data, error } = await supabase.from("inventory").select("*").order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function addInventoryItem(
  item: Omit<InventoryItem, "id" | "created_at" | "updated_at">,
): Promise<InventoryItem> {
  const { data, error } = await supabase.from("inventory").insert([item]).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateInventoryItem(
  id: number,
  updates: Partial<Omit<InventoryItem, "id" | "created_at" | "updated_at">>,
): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from("inventory")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteInventoryItem(id: number): Promise<void> {
  const { error } = await supabase.from("inventory").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}
