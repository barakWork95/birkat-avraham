/**
 * Domain models — the shape of the content that flows through the data provider
 * and into the UI. Collections are lists of these; `info` is a singleton.
 */

/** Fields every stored collection item carries. */
export interface Entity {
  id: string
  /** Sort position (Firestore); absent in local mode. */
  order?: number
}

/** A generic content item — a known Entity plus arbitrary schema-driven fields. */
export type Item = Entity & Record<string, unknown>

/** A one-off document (e.g. institution info). */
export type Singleton = Record<string, unknown>

export type MediaType = 'photo' | 'video'

/** One item inside a gallery album (a photo uploaded to Storage, or a video URL). */
export interface MediaEntry {
  id: string
  type: MediaType
  image?: string
  videoUrl?: string
  caption?: string
}

export interface Contact extends Entity {
  name: string
  title: string
  desc?: string
  featured?: boolean
  img?: string | null
}

export interface EventItem extends Entity {
  title: string
  date?: string
  hebrewDate?: string
  desc?: string
}

export interface GalleryItem extends Entity {
  title: string
  category: string
  /** 'photo'/'video' = a single item; 'album' = a set of `media` entries. */
  type: MediaType | 'album'
  /** Single photo, or the album cover (falls back to the first media entry). */
  image?: string
  videoUrl?: string
  gradient?: string
  /** Present when type === 'album'. */
  media?: MediaEntry[]
}

export interface DonationTier extends Entity {
  amount: number
  label?: string
  note?: string
  popular?: boolean
}

export interface ImpactSlide extends Entity {
  title: string
  caption?: string
  stat?: string
  statLabel?: string
  image?: string
  gradient?: string
}

export interface ScheduleItem extends Entity {
  name: string
  time?: string
  sub?: string
  location?: string
}

export interface InfoContact {
  id: string
  label: string
  phone: string
}

export interface BankTransfer {
  accountName?: string
  bank?: string
  branch?: string
  account?: string
}

export interface InstitutionInfo {
  nameHe?: string
  tagline?: string
  ravName?: string
  ravTitle?: string
  mission?: string
  address?: string
  city?: string
  mapQuery?: string
  phone?: string
  contacts?: InfoContact[]
  whatsappGroup?: string
  kollelEmail?: string
  bankTransfer?: BankTransfer
  nedarimMosadId?: string
}

export interface Zmanim {
  hebrewDate: string
  gregorianDate: string
  parasha: string
  city: string
  candleLighting: string
  havdalah: string
  dafYomi: string
}
