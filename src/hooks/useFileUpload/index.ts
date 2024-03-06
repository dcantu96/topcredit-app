import { DirectUpload } from "@rails/activestorage"

const useFileUpload = () => {
  const uploadFile = (file: File): Promise<{ signedId: string }> =>
    new Promise((resolve, reject) => {
      const upload = new DirectUpload(
        file,
        `${
          import.meta.env.VITE_APP_API_URL
        }/rails/active_storage/direct_uploads`,
      )
      upload.create((error, blob) => {
        if (error) {
          reject()
        } else {
          resolve({ signedId: blob.signed_id })
        }
      })
    })

  return {
    uploadFile,
  }
}

export default useFileUpload
