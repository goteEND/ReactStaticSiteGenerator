const fs = require('fs')
const path = require('path')
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/', (request, response) => {
  response.status(200).json({ message: request.body })
  processFile(request.body.pages)
  console.log(request.body.pages)
})

const port = 8000
app.listen(port, () => {
  console.log('We are live on ' + port)
})

const templatize = (template, content) => template.replace(/<!-- CONTENT -->/g, content)

const saveFile = (filename, contents) => {
  fs.writeFileSync(filename, contents)
}

const getOutputFilename = (filename, outPath) => {
  const basename = path.basename(filename)
  const newfilename = basename + '.html'
  const outfile = path.join(outPath, newfilename)
  return outfile
}

const processFile = (content) => {
  handleDistDirectory()

  const srcPath = path.resolve('./')
  const outPath = path.resolve('dist')
  const template = fs.readFileSync(path.join(srcPath, 'template.html'), 'utf8')

  content.forEach((page) => {
    const outfilename = getOutputFilename(page.pageName, outPath)
    const templatized = templatize(template, page.content)
    saveFile(outfilename, templatized)
    console.log(`📝 ${outfilename}`)
  })
}

const handleDistDirectory = () => {
  //check if dist exists
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist')
  } else {
    //delete dist directory
    fs.rmSync('./dist', { recursive: true })
    //create dist directory
    fs.mkdirSync('./dist')
  }
}
