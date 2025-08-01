"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type Language = "es" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  es: {
    // General
    "app.title": "Sistema de Inventario STRUGAL",
    "app.description":
      "Sistema profesional de gestión de inventario para la producción de aluminio y vidrio de STRUGAL.",
    "loading.text": "Cargando...",
    "welcome.text": "Bienvenido,",
    "logout.button": "Cerrar sesión",
    "cancel.button": "Cancelar",
    "save.button": "Guardar",
    "update.button": "Actualizar",
    "add.button": "Añadir",
    "error.failed_to_save": "Error al guardar el artículo",
    "error.failed_to_delete": "Error al eliminar el artículo",
    "confirm.delete": "¿Estás seguro de que quieres eliminar este artículo?",

    // Login Form
    "login.title": "Sistema de Inventario",
    "login.description": "Inicia sesión para gestionar tu inventario de producción",
    "login.username": "Nombre de usuario",
    "login.password": "Contraseña",
    "login.signin": "Iniciar sesión",
    "login.signing_in": "Iniciando sesión...",
    "login.invalid_credentials": "Nombre de usuario o contraseña inválidos",
    "login.failed": "Error al iniciar sesión. Por favor, inténtalo de nuevo.",
    "login.demo_credentials": "Credenciales de demostración:",

    // Dashboard
    "dashboard.title": "Sistema de Inventario",
    "dashboard.subtitle": "Gestión Profesional",
    "dashboard.inventory_items.title": "Artículos de Inventario",
    "dashboard.inventory_items.description": "Gestiona tu inventario de aluminio y vidrio con estilo",
    "dashboard.new_item.button": "Nuevo Artículo",

    // Dashboard Stats
    "stats.total_items.title": "Artículos Totales",
    "stats.total_items.subtitle": "referencias de inventario",
    "stats.aluminum_stock.title": "Stock Aluminio",
    "stats.aluminum_stock.subtitle": "piezas totales",
    "stats.glass_stock.title": "Stock Vidrio",
    "stats.glass_stock.subtitle": "piezas totales",
    "stats.efficiency.title": "Eficiencia",
    "stats.efficiency.subtitle": "% de rendimiento",

    // Inventory Chart
    "chart.stock_distribution.title": "Distribución de Stock",
    "chart.stock_distribution.description": "Desglose de inventario de aluminio vs vidrio",
    "chart.top_items.title": "Artículos Principales",
    "chart.top_items.description": "Artículos con mayor cantidad en inventario",
    "chart.quantity": "Cantidad",

    // Inventory Table
    "table.type": "Tipo",
    "table.quantity": "Cantidad",
    "table.description": "Descripción",
    "table.created": "Creado",
    "table.updated": "Actualizado",
    "table.actions": "Acciones",
    "table.no_items.title": "Ningún artículo de inventario",
    "table.no_items.description": "Empieza añadiendo tu primer artículo de inventario para ver tus datos aquí",
    "table.search.placeholder": "Buscar en el inventario...",
    "table.filter.button": "Filtrar",
    "table.filter.all": "Todos los tipos",
    "table.filter.aluminum": "Solo Aluminio",
    "table.filter.glass": "Solo Vidrio",
    "table.export.button": "Exportar",
    "table.displaying_items": "Mostrando {{filteredCount}} de {{totalCount}} artículos",
    "table.badge.aluminum": "Aluminio",
    "table.badge.glass": "Vidrio",
    "table.dropdown.duplicate": "Duplicar",
    "table.dropdown.history": "Historial",
    "table.dropdown.export": "Exportar",

    // Inventory Form
    "form.add_item.title": "Añadir Nuevo Artículo",
    "form.edit_item.title": "Editar Artículo de Inventario",
    "form.material_type": "Tipo de Material",
    "form.quantity": "Cantidad",
    "form.description": "Descripción",
    "form.quantity.placeholder": "Introduce la cantidad",
    "form.description.placeholder": "Introduce la descripción del artículo...",
    "form.add_type.option": "Añadir nuevo tipo...",
    "form.add_new_type_dialog.title": "Añadir nuevo tipo de material",
    "form.add_new_type_dialog.description": "Introduce el nombre del nuevo tipo de material a añadir a la lista.",
    "form.new_type_name.placeholder": "Nombre del nuevo tipo (ej: Acero)",
    "form.add_type.button": "Añadir tipo",
    "form.type_exists_error": "El tipo de material está vacío o ya existe.",

    // Chatbot
    "chatbot.title": "Asistente STRUGAL",
    "chatbot.status.error": "Error",
    "chatbot.status.typing": "Escribiendo...",
    "chatbot.status.thinking": "Pensando...",
    "chatbot.status.online": "En línea",
    "chatbot.input.placeholder": "Hazme una pregunta...",
    "chatbot.send_error": "Error al enviar el mensaje. Por favor, inténtalo de nuevo.",
    "chatbot.initial_message":
      "¡Hola! Soy tu Asistente STRUGAL ✨ ¿Cómo puedo ayudarte con la gestión de tu inventario hoy?",
    "chatbot.quick_actions": "Acciones rápidas:",
    "chatbot.quick_action.add_item": "¿Cómo añadir un nuevo artículo?",
    "chatbot.quick_action.view_stats": "Ver estadísticas de inventario",
    "chatbot.quick_action.aluminum_help": "Ayuda sobre el aluminio",
    "chatbot.quick_action.tech_support": "Soporte técnico",
  },
  fr: {
    // General
    "app.title": "Système d'Inventaire STRUGAL",
    "app.description":
      "Système professionnel de gestion d'inventaire pour la production d'aluminium et de verre de STRUGAL.",
    "loading.text": "Chargement...",
    "welcome.text": "Bienvenue,",
    "logout.button": "Déconnexion",
    "cancel.button": "Annuler",
    "save.button": "Sauvegarder",
    "update.button": "Mettre à jour",
    "add.button": "Ajouter",
    "error.failed_to_save": "Échec de la sauvegarde de l'article",
    "error.failed_to_delete": "Échec de la suppression de l'article",
    "confirm.delete": "Êtes-vous sûr de vouloir supprimer cet article ?",

    // Login Form
    "login.title": "Système d'Inventaire",
    "login.description": "Connectez-vous pour gérer votre inventaire de production",
    "login.username": "Nom d'utilisateur",
    "login.password": "Mot de passe",
    "login.signin": "Se connecter",
    "login.signing_in": "Connexion en cours...",
    "login.invalid_credentials": "Nom d'utilisateur ou mot de passe invalide",
    "login.failed": "Échec de la connexion. Veuillez réessayer.",
    "login.demo_credentials": "Identifiants de démonstration :",

    // Dashboard
    "dashboard.title": "Système d'Inventaire",
    "dashboard.subtitle": "Gestion Professionnelle",
    "dashboard.inventory_items.title": "Articles d'Inventaire",
    "dashboard.inventory_items.description": "Gérez votre inventaire d'aluminium et de verre avec style",
    "dashboard.new_item.button": "Nouvel Article",

    // Dashboard Stats
    "stats.total_items.title": "Articles Totaux",
    "stats.total_items.subtitle": "références d'inventaire",
    "stats.aluminum_stock.title": "Stock Aluminium",
    "stats.aluminum_stock.subtitle": "pièces totales",
    "stats.glass_stock.title": "Stock Verre",
    "stats.glass_stock.subtitle": "pièces totales",
    "stats.efficiency.title": "Efficacité",
    "stats.efficiency.subtitle": "% de performance",

    // Inventory Chart
    "chart.stock_distribution.title": "Distribution du Stock",
    "chart.stock_distribution.description": "Répartition de l'inventaire aluminium vs verre",
    "chart.top_items.title": "Articles Principaux",
    "chart.top_items.description": "Articles en plus grande quantité dans l'inventaire",
    "chart.quantity": "Quantité",

    // Inventory Table
    "table.type": "Type",
    "table.quantity": "Quantité",
    "table.description": "Description",
    "table.created": "Créé",
    "table.updated": "Mis à jour",
    "table.actions": "Actions",
    "table.no_items.title": "Aucun article d'inventaire",
    "table.no_items.description": "Commencez par ajouter votre premier article d'inventaire pour voir vos données ici",
    "table.search.placeholder": "Rechercher dans l'inventaire...",
    "table.filter.button": "Filtrer",
    "table.filter.all": "Tous les types",
    "table.filter.aluminum": "Aluminium uniquement",
    "table.filter.glass": "Verre uniquement",
    "table.export.button": "Exporter",
    "table.displaying_items": "Affichage de {{filteredCount}} sur {{totalCount}} articles",
    "table.badge.aluminum": "Aluminium",
    "table.badge.glass": "Verre",
    "table.dropdown.duplicate": "Dupliquer",
    "table.dropdown.history": "Historique",
    "table.dropdown.export": "Exporter",

    // Inventory Form
    "form.add_item.title": "Ajouter un nouvel article",
    "form.edit_item.title": "Modifier l'article d'inventaire",
    "form.material_type": "Type de matériau",
    "form.quantity": "Quantité",
    "form.description": "Description",
    "form.quantity.placeholder": "Entrez la quantité",
    "form.description.placeholder": "Entrez la description de l'article...",
    "form.add_type.option": "Ajouter un nouveau type...",
    "form.add_new_type_dialog.title": "Ajouter un nouveau type de matériau",
    "form.add_new_type_dialog.description": "Entrez le nom du nouveau type de matériau à ajouter à la liste.",
    "form.new_type_name.placeholder": "Nom du nouveau type (ex: Acier)",
    "form.add_type.button": "Ajouter le type",
    "form.type_exists_error": "Le type de matériau est vide ou existe déjà.",

    // Chatbot
    "chatbot.title": "Assistant STRUGAL",
    "chatbot.status.error": "Erreur",
    "chatbot.status.typing": "Écrit...",
    "chatbot.status.thinking": "Réflexion...",
    "chatbot.status.online": "En ligne",
    "chatbot.input.placeholder": "Posez-moi une question...",
    "chatbot.send_error": "Échec de l'envoi du message. Veuillez réessayer.",
    "chatbot.initial_message":
      "Bonjour ! Je suis votre Assistant STRUGAL ✨ Comment puis-je vous aider avec la gestion de votre inventaire aujourd'hui ?",
    "chatbot.quick_actions": "Actions rapides :",
    "chatbot.quick_action.add_item": "Comment ajouter un nouvel article ?",
    "chatbot.quick_action.view_stats": "Voir les statistiques d'inventaire",
    "chatbot.quick_action.aluminum_help": "Aide sur l'aluminium",
    "chatbot.quick_action.tech_support": "Support technique",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es") // Default to Spanish

  const t = (key: string, replacements?: Record<string, string | number>) => {
    let translatedText = translations[language][key] || key // Fallback to key if not found

    if (replacements) {
      for (const placeholder in replacements) {
        translatedText = translatedText.replace(`{{${placeholder}}}`, String(replacements[placeholder]))
      }
    }
    return translatedText
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
