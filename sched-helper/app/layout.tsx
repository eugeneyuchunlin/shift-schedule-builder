import './globals.css'
import { Inter } from 'next/font/google'
import NavBar from './components/navbar'
import styles from './layout.module.css'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Schedule Builder',
  description: 'Generate a schedule for your workers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <NavBar /> */}
        <div className={styles.body_container}>
          {children}
        </div>
      </body>
    </html>
  )
}
