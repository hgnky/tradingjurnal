export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      materials: {
        Row: {
          id: string
          title: string
          content: string
          level: 'basic' | 'premium'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          level: 'basic' | 'premium'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          level?: 'basic' | 'premium'
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {
      material_level: 'basic' | 'premium'
    }
  }
}
