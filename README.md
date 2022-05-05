# React Preload Media
This is a React Component that I built to preload the images and audio files before the page is rendered. You can use this component to wrap your Preload screen HTML or React Component, pass an array of MediaItem in the props and have it preload, also pass a callback function that will be executed when all the media has been loaded. 
The callback function that you pass can for example dispatch a redux action or set some state in your component so it knows that now it can show the application.

I hope this component can be useful to you :) 

## Example
```ts
import { PreloadMedia, MediaType } from 'react-preload-media';

const media = [
  { type: MediaType.Image, url: 'https://via.placeholder.com/150' },
  { type: MediaType.Image, url: 'https://via.placeholder.com/300' },
  { type: MediaType.Audio, url: 'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3' },
];

export const App = () => {
  const [isLoaded, loaded] = useReducer(() => true, false);

  return (
    <div class="container">
      <PreloadMedia media={media} onFinished={() => loaded()}>
        <div className="preloading-container">
          <h1>Preloading</h1>      
        </div>
      </PreloadMedia>
      { isLoaded ? <LoadedApp /> : <></> }
    </div>
  )
}

const LoadedApp = () => {
  return (
    <div className="image-grid">
      <img src="https://via.placeholder.com/300" alt="Example 1" />
      <img src="https://via.placeholder.com/150" alt="Example 1" />
    </div>
    <div className="audio-player">
      <audio controls>
        <source src="https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
      </audio>
    </div>
  );
}
```
---
## API Documentation
The PreloadMedia Component takes two arguments:
- A list of MediaItem
- An onFinished function that will be used as callback and called after all the media has been loaded

PreloadMedia Component Props:
| Name       | Value       | 
| ---------- | ----------- |
| media      | MediaItem[] | 
| onFinished | () => void  |

### MediaItem 
| Name | Value            | 
| ---- | ---------------- |
| type | MediaType (enum) | 
| url  | string           |

```ts
type MediaItem = {
  type: MediaType;
  url: string;
};

enum MediaType {
  Image,
  Audio,
}
```

