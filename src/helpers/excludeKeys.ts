export function excludeKeys<T, K extends keyof T>(obj: T, keysToHide: K[]) {
  const res = { ...obj }
  keysToHide.forEach((key) => {
    delete res[key]
  })
  return res as Omit<T, K>
}
