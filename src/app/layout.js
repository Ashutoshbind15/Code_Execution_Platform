import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Layout/Navbar";
import Root from "@/components/Wrappers/Root";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Root session={session}>
          <nav>
            <Navbar />
          </nav>
          <main>{children}</main>
        </Root>
      </body>
    </html>
  );
}
