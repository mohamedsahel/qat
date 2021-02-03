## What is Qat?

Qat is Node Cli Tool for quickly automate coding tasks using command line.
<br/>
<br />
**Q A T** = **Q**uickly **A**utmate **T**asks

<br />
<br />

## How to get started?

1.  run `npm i -g qat`
2.  add **qat.config.js** file to the root directory of the project, and start writing your custom automated tasks
3.  run `qat your-custom-command`
4.  watch the magic automated :clap: :sparkles:

<br />
<br />

## Tasks Examples

- a simple task for adding tow numbers, and printing the the result

```javascript
module.exports = {
  tasks: [
    {
      command: 'sum num1 num2',
      run: (args, helpers) => {
        const { num1, num2 } = agrs
        const { print } = helpers

        print(+num1 + +num2)
      },
    },
  ],
}
```

then run `qat sum 1 3` in the command line, `4` will be printed

<br/>

- a task for committing, and pushing changes

```javascript
tasks: [
  ...{
    command: 'commit message',
    run: async (args, helpers) => {
      const { message } = args
      const { execute, print } = helpers

      await execute(['git add .', `git commit -m "${message}"`, 'git push origin master'])

      print('changes successfully committed', 'green')
    },
  },
]
```

when you run `qat commit 'your commit message'` it will automaticly add the changes, commit it, and push it to the origin remote, then it will print a green color message "changes successfully committed".

<br/>

- a task for automaticly generate a commponent folder and starter files

```javascript
tasks: [
  ...{
    command: 'add-component componentName',
    run: async (args, helpers) => {
      const { componentName } = args
      const { createFolder, createFile, print } = helpers

      const folderPath = `./src/components/${componentName}`
      const compoPath = folderPath + `/${componentName}.jsx`
      const stylesPath = folderPath + `/${componentName}.css`

      await createFolder(folderPath)
      await createFile(compoPath, '')
      await createFile(stylesPath, '')

      print(`${componentName} added successfully`, 'green')
    },
  },
]
```

then run `qat add-component header`
it will automaticly generate the _Header_ component directory, and its styles files with the content provided as the second argument of _createFile_ function, then it will print a green color message "Header added successfully".
<br/>

## Task object

every task object contains the `command` property and `run` method

- `command` property contains tow parts: the _command name_ ( sum ) and the _command arguments_ ( num1, num2 )
  the command arguments will get passed as properties of the first argument of the _run_ method

- `run` method is the function will be execute when the command get run, the method accept tow params:

#### args:

object of command arguments

- example:

```javascript
 {
   command: "commit message",
   run: ({ message }, helpers) => { /* some logic */ }
 }
```

 <br />

### helpers:

a set of utilities:

- **_print:_** it is a replacement of console.log with the color of the printed message, and the color of its background \* _colors_: black - red - green - yellow - blue - magenta - cyan - white - crimson \* _example_:

```javascript
print('hello world!', 'yellow', 'blue')
// "hello world!" will be printed with yellow color and blue background
```

<br/>

- **_createFolder_**: create a folder/directory with the given path
  - _exapmle_:

```javascript
await createFolder('./src')
```

<br />

- **_deleteFolder_**: delete a folder/directory by the given path
  - _exapmle_:

```javascript
await deleteFolder('./src')
```

<br />

- **_createFile_**: create a file with the given path and content
  - _exapmle_:

```javascript
await createFile('./message.txt', 'Hi there')
```

<br />

- **_readFile_**: get file content by its path
  - _exapmle_:

```javascript
const message = await readFile('./message.txt')
print(message) // "hi there" will be printed
```

<br />

- **_editFile_**: edit file content
  - _exapmle_:

```javascript
await readFile('./message.txt', (oldContent) => {
  // some logic ...
  return newContent
})
```

<br />

- **_deleteFile_**: remove file content by its path
  - _exapmle_:

```javascript
await deleteFile('path/to/file.js')
```

<br />

- **_openFiles_**: open files in new tabs ( VS Code )
  - _exapmle_:

```javascript
await openFiles('path/to/file.js')
// or
await openFiles(['path/to/file1.js', 'path/to/file2.js'])
```

<br />

- **_openURL_**: open the given URL in th edefault browser
  - _exapmle_:

```javascript
openURL('http://localhost:3000')
```

<br />

- **_execute_**: excute cli commands, accept one argument, it can be a string ( command ) or an array of strings ( commands )
  - _exapmle_:

```javascript
execute("echo 'hello world'")
execute(['cd src', 'touch newFile.js'])
```

<br />

- **_executeFile_**: excute shell scripts file
  - _exapmle_:

```javascript
executeFile('./script.sh')
```

<br />

- **_applyTemplate_**: generate Text based on template
  - _exapmle_:

```javascript
const template = `
  import React from 'react'

  const {{ functionName }} = () => {
    return (
      <div>
        Hi {{ personName }}
      </div>
    )
  }

  export default {{ functionName }}
`
const text = applyTemplate(template, {
  functionName: 'Hello',
  personName: 'Mohamed',
})
print(text)
/*
import React from 'react'

const Hello = () => {
  return (
    <div>
      Hi Mohamed
    </div>
  )
}

export default Hello
*/
```

<hr />

Happy coding :smiley:
