const min = ({ min = '', max = ''}, value) => {
  value = parseFloat(value)
  min = min.toString()
  max = max.toString()

  const maxCond = max ? value <= parseFloat(max) : true
  const minCond = min ? value >= parseFloat(min) : true

  return minCond && maxCond
}

const required = (rule, value) => value !== undefined && value !== ''

const minlength = ({ minlength = '', maxlength = '' }, value) => {
  value = value.toString().length
  minlength = minlength.toString()
  maxlength = maxlength.toString()

  const maxCond = maxlength ? value <= parseFloat(maxlength) : true
  const minCond = minlength ? value >= parseFloat(minlength) : true

  return minCond && maxCond
}


const type = (rule, value) => {
  let regex = /(.*?)/
  
  switch (rule.type) {
    case 'email':
      regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      break;
    default:
      break;
  }
  return regex.test(value)
}

export default {
  min,
  max: min,
  required,
  minlength,
  maxlength: minlength,
  type
}
