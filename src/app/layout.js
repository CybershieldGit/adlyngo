import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Adlyngo - Premium Digital Creative Agency",
  description: "Adlyngo is a premium digital creative agency helping startups, modern brands, and ecommerce businesses grow through branding, performance ads, and website design.",
  icons: {
    icon: "/images/favicon.png",
    apple: [
      { url: "/images/apple-touch-icon-57x57.png", sizes: "57x57" },
      { url: "/images/apple-touch-icon-72x72.png", sizes: "72x72" },
      { url: "/images/apple-touch-icon-114x114.png", sizes: "114x114" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="no-js">
      <head>
        <link rel="stylesheet" href="/css/vendors.min.css" />
        <link rel="stylesheet" href="/css/icon.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
        <link rel="stylesheet" href="/demos/branding-studio/branding-studio.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body 
        data-mobile-nav-style="full-screen-menu" 
        data-mobile-nav-bg-color="#2d2c2b" 
        className="overflow-x-hidden custom-cursor"
      >
        <div className="cursor-page-inner">
          <div className="circle-cursor circle-cursor-inner"></div>
          <div className="circle-cursor circle-cursor-outer"></div>
        </div>
        {children}
        
        <div className="crafto-progressive-blur crafto-progressive-blur-bottom" data-blur-bottom="yes" style={{ "--progressive-blur-height": "15vh" }}></div>
        
        <a href="https://wa.me/91XXXXXXXXXX" className="wa-float-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
          <i className="bi bi-whatsapp"></i>
        </a>

        <Script src="/js/jquery.js" strategy="beforeInteractive" />
        <Script src="/js/vendors.min.js" strategy="beforeInteractive" />
        <Script src="/js/main.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
