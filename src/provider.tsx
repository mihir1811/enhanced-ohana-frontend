'use client'

import { store, persistor } from './store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { PersistLoading } from './components/ui/PersistLoading'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<PersistLoading />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
