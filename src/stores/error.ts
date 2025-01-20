export const useErrorStore = defineStore('error-store', () => {
  const activeError = ref<null | CustomError | ExtendedPostgresError>(null)
  const isCustomError = ref(false)

  const setError = ({
    error,
    customCode,
  }: {
    error: string | PostgrestError | Error
    customCode?: number
  }) => {
    // Handle string error
    if (typeof error === 'string') {
      isCustomError.value = true
      activeError.value = new Error(error) as CustomError
      activeError.value.customCode = customCode || 500
      return
    }

    // Handle PostgrestError
    if ('code' in error && 'message' in error && 'details' in error) {
      activeError.value = error as ExtendedPostgresError
      ;(activeError.value as ExtendedPostgresError).statusCode = customCode || 500
      return
    }

    // Handle standard Error
    if (error instanceof Error) {
      activeError.value = error as CustomError
      activeError.value.customCode = customCode || 500
      return
    }

    // Fallback
    activeError.value = new Error('Unknown error') as CustomError
    activeError.value.customCode = customCode || 500
  }

  const clearError = () => {
    activeError.value = null
    isCustomError.value = false
  }

  return {
    activeError,
    setError,
    isCustomError,
    clearError,
  }
})

// make sure to pass the right store definition, `useErrorStore` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useErrorStore, import.meta.hot))
}
