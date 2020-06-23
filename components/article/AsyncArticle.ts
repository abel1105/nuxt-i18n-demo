import { i18nModuleType, importModuleMessage } from '~/plugins/i18n'

const AsyncArticle: Function = () => ({
  component: Promise.all([
    import(
      /* webpackChunkName: "article" */ '~/components/article/Article.vue'
    ),
    importModuleMessage(i18nModuleType.article)
  ]).then(([component]) => component),
  delay: 0,
  timeout: 3000
})

export default AsyncArticle
