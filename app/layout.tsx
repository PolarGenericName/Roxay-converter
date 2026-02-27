import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Roxay Converter - YouTube Video Downloader",
  description:
    "Convert YouTube videos to MP3 and MP4 with the best quality. Fast, free, and unlimited. Download your favorite videos and music easily.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0f0a1a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
