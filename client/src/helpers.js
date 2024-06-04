export default {
  methods: {
    myFormatDate(dateStr) {
      if (!dateStr) return ''

      try {
        const date = new Date(dateStr)

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')

        return `${year}-${month}-${day} ${hours}:${minutes}`
      } catch (error) {
        console.error('Invalid date', error)
        return ''
      }
    }
  }
}
