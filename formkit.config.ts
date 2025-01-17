import { es } from '@formkit/i18n'
import { defaultConfig } from '@formkit/vue'
import { rootClasses } from './formkit.theme'

export default defaultConfig({
  locales: { es },
  locale: 'es',
  config: {
    rootClasses,
  },
  messages: {
    es: {
      validation: {
        date_after_or_equal: 'La fecha debe ser mayor o igual a la fecha actual.',
        required: 'Este campo es obligatorio.',
      },
    },
  },
})
