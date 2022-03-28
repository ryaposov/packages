// Here you change the colors, but this file is not used to import them in places
const PREFIX = 'app'

const colors = {
  text: {
    1: '#000000',
    2: '#616161',
    3: '#9D9D9D',
    4: '#C9C9C9',
    brand: '#0078FF',
    opposite: '#FFFFFF',
  },
  dtext: {
    1: '#FFFFFF',
    2: '#C7C7C7',
    3: '#808080',
    4: '#4D4D4D',
    brand: '#1E88FF',
    opposite: '#000000',
  },
  bg: {
    1: '#FFFFFF',
    2: '#F4F4F4',
    25: '#E7E7E7',
    3: '#C9C9C9',
    brand: '#0078FF',
    opposite: '#000000',
  },
  dbg: {
    1: '#151515',
    2: '#242424',
    25: '#3A3A3A',
    3: '#515151',
    brand: '#1E88FF',
    opposite: '#FFFFFF',
  },
  border: {
    1: '#F0F0F0',
    2: '#CDCDCD',
    3: '#B5B5B5',
    4: '#8D8D8D',
    brand: '#0078FF',
    opposite: '#000000',
  },
  dborder: {
    1: '#202020',
    2: '#3F3F3F',
    3: '#4B4B4B',
    4: '#373737',
    brand: '#1E88FF',
    opposite: '#FFFFFF',
  }
}

const makeReducer = (keyPrefix = '', valuePrefix = '') => (acc, colorGroup) => {
  return {
    ...acc,
    ...Object.keys(colors[colorGroup]).reduce((groupAcc, color) => {
      groupAcc[`--${PREFIX}-${keyPrefix}${colorGroup}-${color}`] = `var(--${PREFIX}-${valuePrefix}${colorGroup}-${color})`

      return groupAcc
    }, {})
  }
}

module.exports = {
  cssColorVariables: Object.keys(colors).reduce((acc, colorGroup) => {
    return {
      ...acc,
      ...Object.keys(colors[colorGroup]).reduce((groupAcc, color) => {
        groupAcc[`--${PREFIX}-${colorGroup}-${color}`] = colors[colorGroup][color]

        return groupAcc
      }, {})
    }
  }, {}),
  tailwindColorConfig: Object.keys(colors).reduce((acc, colorGroup) => {
    if (!acc[colorGroup]) acc[colorGroup] = {}

    for (const color in colors[colorGroup]) {
      acc[colorGroup][color] = `var(--${PREFIX}-${colorGroup}-${color})`
    }

    return acc
  }, {}),
  cssAutoLightColorVariables: ['text', 'bg', 'border'].reduce(makeReducer('a', ''), {}),
  cssAutoDarkColorVariables: ['text', 'bg', 'border'].reduce(makeReducer('a', 'd'), {})
}
