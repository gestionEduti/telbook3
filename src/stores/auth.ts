import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabaseClient'
import type { Session, User } from '@supabase/supabase-js'
import type { Tables } from '@/types/supabase'

export const useAuthStore = defineStore('auth-store', () => {
  const usuario = ref<User | null>(null)
  const perfil = ref<Tables<'mv_usuario'> | null>(null)
  const escuchandoCambiosAuth = ref(false)

  const escucharCambios = () => {
    if (escuchandoCambiosAuth.value) return
    escuchandoCambiosAuth.value = true
    supabase.auth.onAuthStateChange((event, session) => {
      setTimeout(async () => {
        await setUsuario(session)
      }, 0)
    })
  }

  const setUsuario = async (sesionUsuario: null | Session = null) => {
    if (!sesionUsuario) {
      usuario.value = null
      perfil.value = null
      return
    }
    usuario.value = sesionUsuario.user
    await setPerfil()
  }

  const setPerfil = async () => {
    if (!usuario.value) {
      perfil.value = null
      return
    } else {
      if (!perfil.value || perfil.value.id !== usuario.value.id) {
        const query = supabase.from('mv_usuario').select().eq('id', usuario.value.id).single()
        const { data } = await query
        perfil.value = data || null
      }
    }
  }

  const obtenerSesion = async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session?.user) await setUsuario(data.session)
  }

  const login = async (form: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    if (error) {
      console.log(error)
      return error
    }
  }

  const logout = async () => {
    const { error: e } = await supabase.auth.signOut()
    if (e) {
      console.log(e)
      return { error: e }
    }
  }

  return {
    usuario,
    perfil,
    escucharCambios,
    obtenerSesion,
    logout,
    login,
  }
})
