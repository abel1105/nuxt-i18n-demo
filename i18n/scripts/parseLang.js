const fs = require('fs')
const path = require('path')

const SOURCE_ROOT = path.join(__dirname, '../sources')
const TARGET_ROOT = path.join(__dirname, '../modules')
const SHARED_ROOT = path.join(__dirname, '../shared')

const SOURCES = [
  {
    lang: 'en',
    file: 'lang_en.json'
  },
  {
    lang: 'zh_TW',
    file: 'lang_zh_TW.json'
  }
]

const TARGETS = [
  {
    folderName: 'article',
    regexKeyword: [/article\./],
    whitelistKey: [],
    blacklistKey: ['article.btn']
  }
]

const writeFile = (folder, filename, content) => {
  fs.mkdirSync(folder, { recursive: true })

  fs.writeFileSync(folder + '/' + filename, content)
}

const run = () => {
  SOURCES.forEach((source) => {
    const { file, lang } = source
    const result = fs.readFileSync(SOURCE_ROOT + '/' + file)
    const origin = JSON.parse(result)
    console.log(`-----[${lang}] starting-----`)

    TARGETS.forEach((target) => {
      const targetLang = {}
      const { folderName, regexKeyword, whitelistKey, blacklistKey } = target
      regexKeyword.forEach((regex) => {
        const originKeys = Object.keys(origin)
        originKeys.forEach((key) => {
          const isWhitelist = whitelistKey.includes(key)
          const isBlacklist = blacklistKey.includes(key)
          const isMatchRegex = regex.test(key)
          if (isWhitelist || (!isBlacklist && isMatchRegex)) {
            targetLang[key] = origin[key]
            delete origin[key]
          }
          if (isWhitelist) {
            console.log(
              `[${folderName}][WHITELIST] key "${key}" is inside whitelist`
            )
          }
          if (isBlacklist && isMatchRegex) {
            console.log(
              `[${folderName}][BLACKLIST] key "${key}" is inside blacklist`
            )
          }
        })
      })

      const targetLength = Object.keys(targetLang).length

      if (targetLength > 0) {
        if (targetLength < 10) {
          console.log(`[${folderName}][WARN] is less then 10 key`)
        }

        writeFile(
          TARGET_ROOT + '/' + folderName,
          folderName + '_' + lang + '.json',
          JSON.stringify(targetLang, null, 2) + '\n'
        )
      }
    })

    writeFile(
      SHARED_ROOT,
      'lang_' + lang + '.js',
      `/* eslint-disable */\nexport default JSON.parse(${JSON.stringify(
        JSON.stringify(origin)
      )})\n`
    )
  })
}

run()
