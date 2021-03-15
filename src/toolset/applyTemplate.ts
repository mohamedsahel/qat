type MarksType = string[]

export type applyTemplateType = (template: string, variables?: object, marks?: MarksType) => string


const escapeRegExp = (input: string): string => {
  return (input || '').replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1')
}


const applyTemplate: applyTemplateType = (template, variables, marks?) => {
  let start, end

  if(marks?.length === 1) {
    start = end = '\\' + marks[0].split('').join('\\')
  } else if(marks?.length >= 2) {
    end = '\\' + marks[0].split('').join('\\')
    end = '\\' + marks[1].split('').join('\\')
  }

  return Object.keys(variables).reduce(
    (template: string, key: string): string => {

      // for custom marks
      if(start && end) {
        return template.replace(
          new RegExp(`${start}\\s*${escapeRegExp(key)}\\s*${end}`, 'g'),
          variables[key]
        )
      } else {
        return template.replace(
          new RegExp('\{\{\\s*' + escapeRegExp(key) + '\\s*\}\}', 'g'),
          variables[key]
        ).replace(
          new RegExp('\_\_\\s*' + escapeRegExp(key) + '\\s*\_\_', 'g'),
          variables[key]
        )
      }
    },
    template
  )
}

export default applyTemplate