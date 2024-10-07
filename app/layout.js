'use client'
import { AppWrapper } from '../lib/AppContext';
import AppLayout from '../components/AppLayout';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppWrapper>
        <ToastContainer/>
          <AppLayout>{children}</AppLayout>
        </AppWrapper>
      </body>
    </html>
  );
}