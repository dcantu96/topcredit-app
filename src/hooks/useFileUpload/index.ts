import { DirectUpload } from "@rails/activestorage"

const useFileUpload = () => {
  const uploadFile = (file: File): Promise<{ signedId: string }> =>
    new Promise((resolve, reject) => {
      const uploadUrl = import.meta.env.PROD
        ? `${import.meta.env.VITE_APP_API_URL}/rails/active_storage/direct_uploads`
        : "/rails/active_storage/direct_uploads"

      const upload = new DirectUpload(file, uploadUrl)

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
