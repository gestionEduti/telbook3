export function formatearFecha(fecha: string): string {
  if (!fecha) return ''
  const [year, month, day] = fecha.split('-')
  return `${day}-${month}-${year}`
}

export function fechaConTimezone() {
  const fecha = new Date()
  const pad = (num: number) => String(num).padStart(2, '0') // Helper function to pad numbers
  const offset = -fecha.getTimezoneOffset() // Get the timezone offset in minutes
  const offsetHours = pad(Math.floor(Math.abs(offset) / 60))
  const offsetMinutes = pad(Math.abs(offset) % 60)
  const sign = offset >= 0 ? '+' : '-'
  const formattedOffset = `${sign}${offsetHours}:${offsetMinutes}` // Format the offset
  const formattedDate = `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}T${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())}${formattedOffset}`
  return formattedDate
}

export function formatearRut(rut: string | null) {
  if (!rut) return ''
  return rut.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

export function formatearFechaNacimiento(fecha: string | null) {
  if (!fecha) return ''
  const year = String(fecha).substring(0, 4)
  const month = String(fecha).substring(4, 6)
  const day = String(fecha).substring(6, 8)

  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  return date.toLocaleString('es-CL', {
    weekday: 'long',
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  })
}

export function formatearFechaPlanificacionLargoPlazo(fecha: number | null) {
  if (!fecha) return ''
  const year = String(fecha).substring(0, 4)
  const month = String(fecha).substring(4, 6)
  const day = String(fecha).substring(6, 8)

  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  return date.toLocaleString('es-CL', {
    weekday: 'long',
    day: 'numeric',
  })
}

export function formatearNacionalidad(nacionalidad: string | null) {
  if (!nacionalidad) return ''
  switch (nacionalidad) {
    case 'antiguana y barbudana':
      return 'Antiguana y Barbudana 🇦🇬'
    case 'argentina':
      return 'Argentina 🇦🇷'
    case 'bahameña':
      return 'Bahameña 🇧🇸'
    case 'barbadense':
      return 'Barbadense 🇧🇧'
    case 'beliceña':
      return 'Beliceña 🇧🇿'
    case 'boliviana':
      return 'Boliviana 🇧🇴'
    case 'brasileña':
      return 'Brasileña 🇧🇷'
    case 'chilena':
      return 'Chilena 🇨🇱'
    case 'colombiana':
      return 'Colombiana 🇨🇴'
    case 'costarricense':
      return 'Costarricense 🇨🇷'
    case 'cubana':
      return 'Cubana 🇨🇺'
    case 'dominicana':
      return 'Dominicana 🇩🇴'
    case 'dominiquesa':
      return 'Dominiquesa 🇩🇲'
    case 'ecuatoriana':
      return 'Ecuatoriana 🇪🇨'
    case 'española':
      return 'Española 🇪🇸'
    case 'estadounidense':
      return 'Estadounidense 🇺🇸'
    case 'granadina':
      return 'Granadina 🇬🇩'
    case 'guatemalteca':
      return 'Guatemalteca 🇬🇹'
    case 'haitiana':
      return 'Haitiana 🇭🇹'
    case 'hondureña':
      return 'Hondureña 🇭🇳'
    case 'jamaiquina':
      return 'Jamaiquina 🇯🇲'
    case 'mexicana':
      return 'Mexicana 🇲🇽'
    case 'nicaragüense':
      return 'Nicaragüense 🇳🇮'
    case 'panameña':
      return 'Panameña 🇵🇦'
    case 'paraguaya':
      return 'Paraguaya 🇵🇾'
    case 'peruana':
      return 'Peruana 🇵🇪'
    case 'salvadoreña':
      return 'Salvadoreña 🇸🇻'
    case 'sancristobaleña y nevisiana':
      return 'Sancristobaleña y Nevisiana 🇰🇳'
    case 'santalucense':
      return 'Santalucense 🇱🇨'
    case 'sanvicentina y granadina':
      return 'Sanvicentina y granadina 🇻🇨'
    case 'trinitense y tobagüense':
      return 'trinitense y tobagüense 🇹🇹'
    case 'uruguaya':
      return 'Uruguaya 🇺🇾'
    case 'venezolana':
      return 'Venezolana 🇻🇪'
  }
}
