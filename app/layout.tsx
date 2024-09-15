import type { Metadata } from "next";
import "./globals.css";

import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils";
import {ClerkProvider} from '@clerk/nextjs'
import {dark} from '@clerk/themes'
import Provider from "./provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})


export const metadata: Metadata = {
  title: "Live docs",
  description: "Your goal to colaborative editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary:'#3371ff',
          fontSize: '16px'
        }
      }}
    >

      <html lang="en">
        <body
            className={cn(
              "min-h-screen font-sans antialiased",
              fontSans.variable
          )}
        >
          <Provider>
            {children}
          </Provider>
        </body>
      </html>

    </ClerkProvider>
  );
}
