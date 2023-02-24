import React from 'react';
import { createRoot }from 'react-dom/client';
import Root from './src/Root';

const root = document.getElementById('root');
createRoot(root as HTMLElement).render(<Root />);
