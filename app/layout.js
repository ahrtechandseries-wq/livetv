import './globals.css';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import Splash from '@/components/Splash';

export const metadata = {
  title: 'NexLive — Live TV & Sports',
  description:
    'NexLive by AHR — premium live TV, Bangladesh & India channels, sports, news and more, streamed straight from public sources. No fake channels, no fake scores.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'NexLive — Live TV & Sports',
    description: 'Premium live TV and sports streaming, original NexLive experience by AHR.',
    type: 'website'
  },
  icons: {
    icon: '/icon.svg'
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0C'
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className="min-h-screen bg-nex-bg font-sans text-nex-text antialiased">
        <Splash />
        <TopBar />
        {/*
          pb-20: the fixed BottomNav overlaps content unless the
          page has enough bottom padding to clear it - 20 (5rem)
          comfortably clears the ~56px bar plus safe-area on most
          phones.
        */}
        <main className="mx-auto max-w-7xl pb-20 pt-6">{children}</main>
        <BottomNav />
      </body>
    </html>
  );

}
