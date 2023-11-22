const fs = require('fs')
const path = require('path')
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

interface IPage {
  pageName: string
  content: string
  previousPage?: string
  nextPage?: string
}

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/', (request, response) => {
  response.status(200).json({ message: request.body })
  processFile(request.body.pages)
})

const port = 8000
app.listen(port, () => {
  console.log('We are live on ' + port)
})

const templatize = (template: string, page: IPage) =>
  template
    .replace(/<!-- CONTENT -->/g, page.content)
    .replace(/<!-- NEXT_PAGE -->/g, page.nextPage ? buildNavigation(page.nextPage) : 'No next page')
    .replace(
      /<!-- PREVIOUS_PAGE -->/g,
      page.previousPage ? buildNavigation(page.previousPage) : 'No previous page'
    )

const buildNavigation = (pageName: string) => {
  return `<a href="${pageName}.html" class="break-normal text-base md:text-sm text-teal-500 font-bold no-underline hover:underline">${pageName}</a>`
}

const saveFile = (filename: string, contents: string) => {
  fs.writeFileSync(filename, contents)
}

const getOutputFilename = (filename: string, outPath: string) => {
  const basename = path.basename(filename)
  const newfilename = basename + '.html'
  const outfile = path.join(outPath, newfilename)
  return outfile
}

const processFile = (content: IPage[]) => {
  handleDistDirectory()

  const srcPath = path.resolve('./')
  const outPath = path.resolve('dist')
  const template = fs.readFileSync(path.join(srcPath, 'template.html'), 'utf8')

  content.forEach((page, index) => {
    //check if index-1 exists
    if (index > 0) {
      page.previousPage = content[index - 1].pageName
    }
    //check if index+1 exists
    if (index < content.length - 1) {
      page.nextPage = content[index + 1].pageName
    }

    const outfilename = getOutputFilename(page.pageName, outPath)
    const templatized = templatize(template, page)
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
