import React from 'react';
import AppLayout from './src/app-layout';

export function wrapRootElement({ element }) {
  return <AppLayout>{element}</AppLayout>;
}
