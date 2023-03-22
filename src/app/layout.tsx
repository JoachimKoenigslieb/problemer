import './globals.css'

export const metadata = {
  title: 'Har du problemer?',
  description: 'Hvad er dit problem',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
