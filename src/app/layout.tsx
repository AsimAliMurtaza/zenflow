import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zenflow",
  description: "Ai-based code collaboration tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
