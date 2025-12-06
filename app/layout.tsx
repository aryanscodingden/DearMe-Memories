import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import '@fontsource/inter'
import '@fontsource/plus-jakarta-sans'

export const metadata = {
  title: "DearMe - Write to your future self",
  description: "A way to remember the old times",
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white font-sans antialiased tracking-tight">
        <ThemeProvider
          attribute="class"
          defaultTheme="class"
          enableSystem
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  )
}