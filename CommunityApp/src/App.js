import React from 'react';

import AppPages from './pages'
import { AuthProvider } from './providers/auth'
import { ModalWindowProvider } from './providers/modal';
import { RouterProvider } from './providers/router';
import { WsProvider } from './providers/ws'

export default function Basic() {

  return (
    <AuthProvider>
      <ModalWindowProvider>
        <RouterProvider>
          <WsProvider>
            <AppPages/>
          </WsProvider>
        </RouterProvider>
      </ModalWindowProvider>
    </AuthProvider>
  );
}
