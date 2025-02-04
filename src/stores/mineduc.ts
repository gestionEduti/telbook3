import { fechaConTimezone } from '@/lib/formato'
const errorStore = useErrorStore()
const authStore = useAuthStore()

export const useMineducStore = defineStore('mineduc-store', () => {
  async function validarOTP(otp: string) {
    // TODO extraer funcion a utils porque se usa en al menos 2 partes
    const rut = authStore.perfil?.rut_usuario
    const fecha = fechaConTimezone()
    const url = `/mineduc/otp/verify-otp?rut=${rut}&otp=${otp}&DateWithTimeZone=${fecha}`
    const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    try {
      const response = await fetch(url, options)
      const json = await response.json()
      return json
    } catch (error) {
      errorStore.setError({ error: `Error en la respuesta del OTP: ${error}` })
    }
  }

  return {
    validarOTP,
  }
})
