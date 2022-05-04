import React from 'react';
import { useEffect } from 'react';

type MediaItem = {
  type: MediaType;
  url: string;
};

type PreloadMediaProps = {
  media: MediaItem[];
  onFinished: () => void;
  children?: React.ReactNode;
};

export enum MediaType {
  Image,
  Audio,
}

const loadImage = (url: string, res: () => void) => {
  const img = new Image();
  img.onload = () => res();
  img.onerror = () => res();
  img.src = url;
};

const loadAudio = (url: string, res: () => void) => {
  const audio = new Audio();
  audio.src = url;
  audio.onload = () => res();
  audio.onerror = () => res();
};

export const PreloadMedia = ({
  media,
  onFinished,
  children,
}: PreloadMediaProps) => {
  const [isLoaded, loaded] = React.useReducer(() => true, false);

  useEffect(() => {
    const preload = async (items: MediaItem[]) => {
      const promises = items.map(({ type, url }) => {
        return new Promise<void>(async (res, _rej) => {
          switch (type) {
            case MediaType.Image:
              loadImage(url, res);
              break;
            case MediaType.Audio:
              loadAudio(url, res);
              break;
          }
        });
      });

      await Promise.all(promises);

      loaded();
      onFinished();
    };
    preload(media);
  }, [media, onFinished]);

  if (isLoaded) return <></>;

  return <>{children}</>;
};
