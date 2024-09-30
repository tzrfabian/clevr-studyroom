'use client'
import { AppWrapper } from '../lib/AppContext';
import AppLayout from '../components/AppLayout';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppWrapper>
          <AppLayout>{children}</AppLayout>
        </AppWrapper>
      </body>
    </html>
  );
}