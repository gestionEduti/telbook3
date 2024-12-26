import { defineStore } from 'pinia'
import { ref } from 'vue'

import { supabase } from '@/services/supabaseClient'
import type { Session, User } from '@supabase/supabase-js'
import type { Tables } from '@/types/supabase'

import { useErrorStore } from './error'

import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

export const useAuthStore = defineStore('auth-store', () => {
  const usuario = ref<User | null>(null)
  const perfil = ref<Tables<'mv_usuario'> | null>(null)
  const establecimiento = ref<Tables<'tp_establecimientos'> | null>(null)
  const escuchandoCambiosAuth = ref(false)

  /**
   * Escucha los cambios de autenticación.
   * Si el usuario se autentica o desautentica, inmediatamente se llama a la funcion setUsuario.
   * @returns void
   */
  const escucharCambios = () => {
    if (escuchandoCambiosAuth.value) return
    escuchandoCambiosAuth.value = true
    supabase.auth.onAuthStateChange((event, session) => {
      setTimeout(async () => {
        await setUsuario(session)
      }, 0)
    })
  }

  /**
   * Esta funcion es llamada cuando el authStateChange se dispara.
   * Se encarga de setear el state usuario, perfil y establecimiento.
   * Si no se pasa un usuario (logout), se limpian los states.
   * De lo contrario, se setea el usuario recibido (login) y se llama a setPerfil y setEstablecimiento.
   * @param sesionUsuario
   * @returns
   */
  const setUsuario = async (sesionUsuario: null | Session = null) => {
    if (!sesionUsuario) {
      usuario.value = null
      perfil.value = null
      establecimiento.value = null
      return
    }
    usuario.value = sesionUsuario.user
    if (usuario.value) await setPerfil(usuario.value)
    if (perfil.value) await setEstablecimiento(perfil.value)
  }

  /**
   * Setea el state perfil que contiene informacion adicional del usuario.
   * Si no se pasa un usuario, se limpia el state perfil.
   * De lo contrario, si el perfil no existe o el id es diferente al usuario, se busca el perfil en la base de datos.
   * Si no se encuentra en la DB, se limpia el perfil.
   * De lo contrario, se setea el perfil.
   * @returns
   */
  const setPerfil = async (usuario: User) => {
    if (!perfil.value || perfil.value.id !== usuario.id) {
      const { data, error } = await supabase
        .from('mv_usuario')
        .select()
        .eq('id', usuario.id)
        .single()
      if (error) {
        // TODO validar y mejorar este flujo para cuando no exista el perfil de un usuario
        await limipiarSesion()
        toast({
          title: 'Error',
          description: 'Tu usuario no esta creado correctamente. Contacta a soporte.',
          variant: 'destructive',
        })
        return
      }
      perfil.value = data || null
    }
  }

  /**
   * Setea el state establecimiento que contiene la informacion del establecimiento asociado al usuario.
   * @returns
   */
  const setEstablecimiento = async (perfil: Tables<'mv_usuario'>) => {
    const { data, error, status } = await supabase
      .from('tp_establecimientos')
      .select()
      .eq('rbd', perfil.rbd_usuario)
      .single()
    if (error) useErrorStore().setError({ error, customCode: status })
    establecimiento.value = data || null
  }

  /**
   * Obtiene la sesion actual del usuario.
   * Se utiliza cuando se esta autenticado y se ingresa por otra pagina que no sea el login.
   * Se llama en el beforeEach del router para poder poblar el store con la sesion actual.
   * @returns
   */
  const obtenerSesion = async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) useErrorStore().setError({ error })
    if (data.session?.user) await setUsuario(data.session)
  }

  /**
   * Limpia la sesion actual del usuario.
   */
  const limipiarSesion = async () => {
    await supabase.auth.signOut()
    usuario.value = null
    perfil.value = null
    establecimiento.value = null
  }

  return {
    usuario,
    perfil,
    establecimiento,
    escucharCambios,
    obtenerSesion,
  }
})
