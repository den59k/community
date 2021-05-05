import React from 'react';

import AppPages from './pages'
import { AuthProvider } from './providers/auth'
import { RouterProvider } from './providers/router';
import { WsProvider } from './providers/ws'

export default function Basic() {

  return (
    <AuthProvider>
      <RouterProvider>
        <WsProvider>
          <AppPages/>
        </WsProvider>
      </RouterProvider>
    </AuthProvider>
  );
}
