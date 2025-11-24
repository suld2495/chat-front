export function buildQuery<T extends object>(
  params: T,
): string {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }
    search.append(key, String(value))
  })

  const query = search.toString()
  return query ? `?${query}` : ''
}
