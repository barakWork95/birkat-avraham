import type { InstitutionInfo } from '../types/models'

/**
 * Built-in values for institution-info fields added after the live `info`
 * document was created, so the site shows them before anyone re-saves the
 * info screen. Anything the gabbai saves — including an empty string, which
 * hides that line — takes precedence (see useInfo).
 */
export const INFO_DEFAULTS: Partial<InstitutionInfo> = {
  amutaName: 'חנוך לנער עפ"י דרכו',
  amutaNumber: '5806435',
  taxNotice: 'למוסד אישור מס הכנסה לפי סעיף 46 לפקודה',
  pushcoinsTitle: 'קופת צדקה דיגיטלית (PushCoins)',
  pushcoinsText:
    'תורמים מטבע לצדקה ביום-יום ישירות מהנייד. מורידים את האפליקציה ובוחרים במוסד: "חנוך לנער ע\'\'פ דרכו".',
  pushcoinsButton: 'להורדת האפליקציה',
  pushcoinsUrl: 'https://pushcoins.org',
}
