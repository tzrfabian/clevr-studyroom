'use client'
import { AppWrapper } from '../lib/AppContext';
import AppLayout from '../components/AppLayout';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head></head>
        <title>Clevr</title>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
        <link rel="icon" href="/favicon.ico"/>
      <body>
        <AppWrapper>
        <ToastContainer/>
          <AppLayout>{children}</AppLayout>
        </AppWrapper>
      </body>
    </html>
  );
}