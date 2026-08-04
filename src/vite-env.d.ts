/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATA_PROVIDER?: 'local' | 'firebase'
  readonly VITE_ADMIN_PASSCODE?: string
  readonly VITE_NEDARIM_API_VALID?: string
  readonly VITE_FB_API_KEY: string
  readonly VITE_FB_AUTH_DOMAIN: string
  readonly VITE_FB_PROJECT_ID: string
  readonly VITE_FB_STORAGE_BUCKET: string
  readonly VITE_FB_SENDER_ID: string
  readonly VITE_FB_APP_ID: string
  readonly VITE_FB_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
