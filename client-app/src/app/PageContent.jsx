import { observer } from 'mobx-react-lite';
import { useStore } from './stores/store';

export const PageContent = observer(() => {
  const {
    commonStore: { content, setContent, postContent },
  } = useStore();

  const handleMessageChange = (event) => {
    setContent(event.target.value);
  };

  return (
    <>
      <textarea value={content} onChange={handleMessageChange} />
      <button onClick={() => postContent()}>Generate</button>
    </>
  );
});
