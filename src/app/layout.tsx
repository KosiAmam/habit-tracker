import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Consistency beats motivation',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* PWA icons */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/icon-192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icons/icon-512.png"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />

        <meta name="theme-color" content="#F5821A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Habit Tracker" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className="bg-surface-bg">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `,
          }}
        />
      </body>
    </html>
  );
}