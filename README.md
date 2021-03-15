## What is Qat?

Qat is Node Cli Tool for quickly automate workflow tasks using command line.
<br/>

**Q A T** = **Q**uickly **A**utmate **T**asks

<br  />

## How to get started?

1. run `npm i -g qat` or  `yarn add global qat`

2. add **qat.config.js** file to the root directory of the project, and start writing your custom commands

3. run `qat your-custom-command`

4. watch the magic automated :clap: :sparkles:



<br  />



## Examples



- a simple command for adding tow numbers, and printing the the result



```javascript

module.exports = {
	add: ({ agrs, log }) => {
		const [num1, num2] = args
		log(+num1 + +num2)
	}
}

```



then run `qat sum 1 3` in the command line, `4` will be printed



<br/>



- an command for committing, and pushing changes



```javascript
module.exports = {
	...
	commit: async ({ args, exec, log }) => {
		const [message] = agrs

		await  exec.command(['git add .', `git commit -m "${message}"`, 'git push origin main'])
		log.info('changes successfully committed')
	}
}
```



when you run `qat commit 'your commit message'` it will automatically add the changes, commit it, and push it to the origin remote, then it will print a green color message "changes successfully committed".



<br/>



- an command for automatically generate a component folder and starter files



```javascript
module.exports = {
	...
	component: async ({ args, fs, log }) => {
		const [componentName] = agrs

		await fs.create(`components/${componentName}.jsx`)
	}
}
```



then run `qat component Header`, it will automatically create the _Header_ component file.

<br/>



## Command Structure

```javascript
	[command_topic]: async (toolset: { agrs, log, fs, applyTemplate, openUrl, exec }) => { ... }
```

<br  />


- `args` ( array of strings ) the arguments passed when running the command



- `log` function, which is an advanced replacement of console.log

```javascript
log('hello world') // default
log.error('Error occured') // red
log.info('Sucess') // green
log.warn('warning') // yellow
```

<br/>

- `exec` un object that contains tow methods: command and file

  -  `.command(string | array of strings)`  for executing cli commands
  -  `.file(path)` for executing shell files
```javascript
await  exec.command('npm install axios')
await  exec.command(['git add .', 'git commit', 'git push'])

await  exec.file('./deploy.sh')
```
<br  />

- `openUrl(string)` for opening URL in default browser
```javascript
await  openUrl('http://localhost:3000')
```

<br  />

- `applyTemplate(template, variables, marks?)` for replacing template variables in a string
	- `template` (string)
	- `varibales` (object)
	- `marks` ( [opening_mark, closing_mark] | [same_mark] )
```javascript
const stringTemplate = 'Hello {{ name }}'
log(applyTemplate(stringTemplate, { name: 'Mohamed' }))
// Hello Mohamed

const stringTemplate = 'Hello __name__'
log(applyTemplate(stringTemplate, { name: 'Ibrahim' }, ['__']))
// Hello Ibrahim
```
<br />

- `fs`
	- `.isExists(path)` return boolean value.
	-  `.create(path | object | array[path | objects], parentPath?)` for creating files and folders
		- `path` ( string ) if the path basename has an extension, it create a file, if not, it create a folder, for special cases, use an object as argument.
		- `object`
			- `.path` ( string )
			- `.type?` ( "file" | "folder" )
			- `.content?` ( string ) if the type is a file.
			- `.children?` if the type is a folder, and it will be passed as an argument of `.create` method with parent path of its parent object.
	- `.readFile(path)`  return file content.
	- `.readDir(path)`  return folder structure.
	- `.readTemplate(path, variables, marks?)`  same as `applyTemplate` but with the template path in place of the template string.
	-  `.edit(path, editFunction)`  for editing files content, the `editFunction` take old content as an argument and should return the new content.
	- `.delete(path | array of paths)`  for deleting files and folders.
    - `.open(path | array of paths)`  for opening file or multiple files in new VS Code tabs.
	- `.copy(srcDir, destDir, files?)`  for copy files from a directory to another.
		- `srcDir` ( string ) path of the source directory.
		- `destDir` ( string ) path of the destination directory.
		- `files` ( array of string ) names of specific files you want to copy. by default it copy all the files and folders .
	- `.watch('file, dir, glob, or array')`

```javascript
/**** fs.create examples ****/

await fs.create('styles.css')
// will create file named style.css

await fs.create('wrapper')
// will create a folder named wrapper

await fs.create(['index.js'. 'components', 'style.css'])
// will create tow files: index.js and style.css, and one folder named components

await fs.create(
{
	path: 'Header',
	children: [
		{
			 path: 'index.jsx',
			 content: 'import React from react'
		 },
		 'style.css'
	]
}, 'components')
/*
	will create the next structure
	- components
		- Header
			- index.jsx ( filled with initial content "import React from react" )
			- style.css
*/
```
```javascript
/**** fs.create example ****/

// Initialize watcher.
const watcher = fs.watch('file, dir, glob, or array')

// Add event listeners.
watcher
  .on('add', path => log(`File ${path} has been added`))
  .on('change', path => log(`File ${path} has been changed`))
  .on('unlink', path => log(`File ${path} has been removed`))

// More possible events.
watcher
  .on('addDir', path => log(`Directory ${path} has been added`))
  .on('unlinkDir', path => log(`Directory ${path} has been removed`))
  .on('error', error => log(`Watcher error: ${error}`))
  .on('ready', () => log('Initial scan complete. Ready for changes'))
  .on('raw', (event, path, details) => { // internal
    log('Raw event info:', event, path, details)
  })

// Stop watching.
// The method is async!
watcher.close().then(() => console.log('closed'))
```
<hr  />

Happy coding :smiley:



