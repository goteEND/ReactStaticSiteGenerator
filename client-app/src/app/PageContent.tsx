import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from './stores/store';

export const PageContent = observer(() => {
  const {
    commonStore: { pages, createPage, updatePageContent, postContent },
  } = useStore();

  const [pageName, setPageName] = useState('');

  return (
    <>
      <input
        type="text"
        value={pageName}
        onChange={(e) => setPageName(e.target.value)}
      />
      <button onClick={() => createPage(pageName)}>Add Page</button>
      {pages.length > 0 &&
        pages.map((page) => (
          <div key={page.pageName}>
            <h3>{page.pageName}</h3>
            <textarea
              value={page.content}
              onChange={(e) => updatePageContent(page.pageName, e.target.value)}
            />
          </div>
        ))}
      <button onClick={() => postContent()}>Generate</button>
    </>
  );
});
