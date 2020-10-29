#!/usr/bin/env node

'use strict'

const [,, ...args] = process.argv

if (!args[0]) throw Error('You must provide a destination for the generated sprite!')

const fs = require('fs')
const path = require('path')
const SVGSpriter = require('svg-sprite')
const publicPath = path.resolve(process.env.INIT_CWD, args[0])
const ignoreFiles = [
  'icons/generate.js',
  'icons/copySprite.js'
]

const cleanPath = (filepath) => {
  return filepath.split('.')[0]
}
const spriter = new SVGSpriter({
  dest: 'dist',
  mode: {
    symbol: true
  },
  shape: {
    id: {
      generator (path, name) {
        var path = cleanPath(path)
        return 'app-icon-' + path.split('.')[0]
      }
    }
  }
})

const getAllFiles = () =>
  fs.readdirSync(path.resolve(__dirname)).reduce((files, file) => 
    [...files, ...(ignoreFiles.includes(file) ? [] : [file])],
  [])

const files = getAllFiles()

files.forEach(file => {
  const iconPath = path.resolve(__dirname, file)
  spriter.add(
    iconPath,
    file,
    fs.readFileSync(iconPath, { encoding: 'utf-8' })
  )
})

spriter.compile((error, result, data) => {
  fs.writeFileSync(
    path.resolve(publicPath, 'icons.svg'),
    result.symbol.sprite.contents
  )
})
