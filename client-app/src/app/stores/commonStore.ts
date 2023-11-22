import { makeAutoObservable } from 'mobx';
import agent from '../api/agent';

export default class CommonStore {
  content: string = 'Hello from Mobx';

  constructor() {
    makeAutoObservable(this);
  }

  setContent = (content: string) => {
    this.content = content;
  };

  postContent = async () => {
    console.log('Content before sending: ', this.content);
    const result = await agent.staticSiteContent.post<string>({
      content: this.content,
    });
    console.log(result);
  };
}
