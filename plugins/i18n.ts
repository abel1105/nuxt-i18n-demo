import { Context } from '@nuxt/types'
import VueI18n from 'vue-i18n'

export enum i18nModuleType {
  article = 'article'
}

interface IModuleLoaded {
  [index: string]: boolean | undefined
}

let vueI18n: VueI18n | null = null

const moduleLoaded: IModuleLoaded = {}

export default function({ app, route }: Context): Promise<void> {
  vueI18n = app.i18n
  const LANG = (route.query.lang || 'zh_TW') as string
  return app.i18n.setLocale(LANG).then(() => {
    // client side ignore
    if (process.client) return
    // server side load source languages instead of each i18nModuleType lang
    return new Promise((resolve) => {
      import(
        /* webpackChunkName: "i18n-source-[request]" */ `@/i18n/sources/lang_${LANG}.json`
      )
        .then((languageJSON) => {
          vueI18n!.mergeLocaleMessage(LANG, languageJSON)
        })
        .catch(() => {})
        .finally(() => {
          resolve()
        })
    })
  })
}

export const importModuleMessage = (type: i18nModuleType): Promise<void> => {
  const LANG = vueI18n?.locale || 'zh_TW'
  // server side ignore
  if (process.server) {
    return Promise.resolve()
  }
  // client side load each i18nModuleType lang
  return import(
    /* webpackChunkName: "i18n-[request]" */ `@/i18n/modules/${type}/${type}_${LANG}.json`
  )
    .then((languageJSON) => {
      if (!moduleLoaded[type]) {
        vueI18n!.mergeLocaleMessage(LANG, languageJSON)
        moduleLoaded[type] = true
      }
      return Promise.resolve()
    })
    .catch(() => {
      // ignore when can't find this particular language json
      return Promise.resolve()
    })
}
