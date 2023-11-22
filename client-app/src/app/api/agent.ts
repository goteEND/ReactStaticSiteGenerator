import axios, { AxiosResponse } from 'axios'

axios.defaults.baseURL = 'http://localhost:8000/'

const responseBody = <T>(response: AxiosResponse<T>) => response.data

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

const staticSiteContent = {
  post: <T>(body: object) => requests.post<T>('/', body)
}

const agent = {
  staticSiteContent
}

export default agent
