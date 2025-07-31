import { supabase } from "./supabase"

export interface User {
  id: number
  username: string
}

export async function login(username: string, password: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, username")
    .eq("username", username)
    .eq("password", password)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export function setUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user))
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

export function logout() {
  localStorage.removeItem("user")
}
