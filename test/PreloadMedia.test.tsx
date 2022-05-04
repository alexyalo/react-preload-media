import * as React from 'react';
import { MediaType, PreloadMedia } from '../src';
import {
  act,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import ReactDOM from 'react-dom/client';

const LOAD_FAILURE_SRC = 'LOAD_FAILURE_SRC';
const LOAD_SUCCESS_SRC = 'LOAD_SUCCESS_SRC';

const media = [{ type: MediaType.Image, url: LOAD_SUCCESS_SRC }];

const multipleMedia = [
  { type: MediaType.Image, url: LOAD_SUCCESS_SRC },
  { type: MediaType.Image, url: LOAD_SUCCESS_SRC },
  { type: MediaType.Image, url: LOAD_SUCCESS_SRC },
  { type: MediaType.Audio, url: LOAD_SUCCESS_SRC },
];

const failedMedia = [
  { type: MediaType.Image, url: LOAD_SUCCESS_SRC },
  { type: MediaType.Image, url: LOAD_FAILURE_SRC },
  { type: MediaType.Image, url: LOAD_SUCCESS_SRC },
  { type: MediaType.Audio, url: LOAD_FAILURE_SRC },
];

let container: HTMLDivElement;

beforeAll(() => {
  Object.defineProperty(global.Image.prototype, 'src', {
    set(src) {
      if (src === LOAD_FAILURE_SRC) {
        setTimeout(() => this.onerror(), 2000);
      } else if (src === LOAD_SUCCESS_SRC) {
        setTimeout(() => this.onload(), 2000);
      }
    },
  });

  Object.defineProperty(global.Audio.prototype, 'src', {
    set(src) {
      if (src === LOAD_FAILURE_SRC) {
        setTimeout(() => this.onerror(), 2000);
      } else if (src === LOAD_SUCCESS_SRC) {
        setTimeout(() => this.onload(), 2000);
      }
    },
  });
});

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

it('Loads one image and removes the PreloadMedia children', async () => {
  const onFinished = jest.fn();

  act(() => {
    ReactDOM.createRoot(container).render(
      <PreloadMedia media={media} onFinished={onFinished}>
        <h1 className="preloading-title">Preloading</h1>
      </PreloadMedia>
    );
  });

  expect(await screen.findByText(/Preloading/i)).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.queryByText(/Preloading/i), {
    timeout: 2000,
  });
  await waitFor(() => expect(onFinished).toHaveBeenCalledTimes(1));
});

it('Loads multiple images and removes the PreloadMedia children', async () => {
  const onFinished = jest.fn();

  act(() => {
    ReactDOM.createRoot(container).render(
      <PreloadMedia media={multipleMedia} onFinished={onFinished}>
        <h1 className="preloading-title">Preloading</h1>
      </PreloadMedia>
    );
  });

  expect(await screen.findByText(/Preloading/i)).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.queryByText(/Preloading/i), {
    timeout: 2000,
  });
  await waitFor(() => expect(onFinished).toHaveBeenCalledTimes(1));
});

it('Does not fail when error', async () => {
  const onFinished = jest.fn();

  act(() => {
    ReactDOM.createRoot(container).render(
      <PreloadMedia media={failedMedia} onFinished={onFinished}>
        <h1 className="preloading-title">Preloading</h1>
      </PreloadMedia>
    );
  });

  expect(await screen.findByText(/Preloading/i)).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.queryByText(/Preloading/i), {
    timeout: 2000,
  });
  await waitFor(() => expect(onFinished).toHaveBeenCalledTimes(1));
});
