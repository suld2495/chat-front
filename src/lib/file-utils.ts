export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.')

  if (lastDotIndex <= 0)
    return ''

  return filename.slice(lastDotIndex + 1).toLowerCase()
}
