import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navigation/Navbar"
import { AuthProvider } from "@/context/AuthContext"
import { ToastContainer } from "react-toastify"
import Footer from "@/components/Navigation/Footer"
import { ThemeProvider } from "@/context/ThemeContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AppName",
  description: "Generated by create next app",
}

export default function RootLayout({ children }) {
  const setThemeScript = `
    (function() {
      const theme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);
    })();
  `
  return (
    <html lang="en" data-theme="green">
      <head>
        <script dangerouslySetInnerHTML={{ __html: setThemeScript }} />
      </head>

      <ThemeProvider>
        <AuthProvider>
          <body className={`${inter.className} min-h-screen h-screen font-semibold`}>
            <ToastContainer />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </body>
        </AuthProvider>
      </ThemeProvider>
    </html>
  )
}
