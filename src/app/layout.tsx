
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { TranslationProvider } from '@/context/TranslationContext';
import './globals.css';
import AppLoader from '@/components/AppLoader';

const APP_NAME = "EduReport Hub";
const APP_DESCRIPTION = "A modern Teacher Report System for educational oversight, offering seamless reporting, data analytics, and secure user management for school inspectors.";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    url: 'https://edureport.hub',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    type: 'website',
    siteName: APP_NAME,
    images: [{
      url: '/og-image.png', // It's good practice to have an opengraph image
      width: 1200,
      height: 630,
      alt: 'EduReport Hub Logo and Dashboard Preview'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
     images: [{
      url: '/og-image.png',
      alt: 'EduReport Hub Logo and Dashboard Preview'
    }]
  },
  keywords: ['education', 'reporting', 'inspection', 'school administration', 'teacher performance'],
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "EduReport Hub",
  "description": "A modern Teacher Report System for educational oversight, offering seamless reporting, data analytics, and secure user management for school inspectors.",
  "url": "https://edureport.hub",
   "applicationCategory": "EducationalApplication",
  "operatingSystem": "All",
   "offers": {
    "@type": "Offer",
    "price": "0" 
  },
  "publisher": {
    "@type": "Organization",
    "name": "EduReport Hub Inc."
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 
{  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TranslationProvider>
            <AuthProvider>
              <AppLoader>{children}</AppLoader>

              <Toaster />
            </AuthProvider>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
