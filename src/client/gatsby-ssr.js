import React from 'react';
import App from './src/app';

export function wrapRootElement({ element }) {
  return <App>{element}</App>;
}
