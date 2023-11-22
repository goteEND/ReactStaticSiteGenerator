import { makeAutoObservable } from 'mobx'
import agent from '../api/agent'

interface IPage {
  pageName: string
  content: string
}

export default class CommonStore {
  pages: IPage[] = []

  constructor() {
    makeAutoObservable(this)
  }

  createPage = (pageName: string, content: string = '') => {
    const pageIndex = this.pages.findIndex((page) => page.pageName === pageName)

    if (pageIndex !== -1) {
      console.log('Page with pageName already exists')
    } else {
      // Page with pageName doesn't exist, create a new page
      this.pages.push({ pageName, content })
    }
  }

  updatePageContent = (pageName: string, newContent: string) => {
    this.pages = this.pages.map((page) => {
      if (page.pageName === pageName) {
        return { ...page, content: newContent }
      }
      return page
    })
  }

  postContent = async () => {
    console.log('Content before sending: ', this.pages)
    const result = await agent.staticSiteContent.post<string>({
      pages: this.pages
    })
    console.log(result)
  }
}
