import CryptoJS from 'crypto-js'

export const encrypt = (data: unknown) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), import.meta.env.VITE_SECRET_KEY).toString()
}

export const decrypt = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(data, import.meta.env.VITE_SECRET_KEY)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

export const encryptedStorage = {
  getItem: (name: string) => {
    const data = localStorage.getItem(name)
    if (!data) return null
    return decrypt(data)
  },
  setItem: (name: string, value: unknown) => {
    const encryptedData = encrypt(value)
    localStorage.setItem(name, encryptedData)
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name)
  },
}
