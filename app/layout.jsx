import '../src/index.css'
import { Providers } from './providers'
import { WhatsAppWidget } from '../src/components/desktop/WhatsAppWidget'

export const metadata = {
  title: 'Jenideals - Multi-Seller Marketplace',
  description: 'The multi-seller marketplace where independent stores and millions of shoppers meet.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <WhatsAppWidget />
        </Providers>
      </body>
    </html>
  )
}
