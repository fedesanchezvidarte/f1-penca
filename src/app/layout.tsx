import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { AuthModalProvider } from "@/components/auth/auth-modal-context";
import { AuthModal } from "@/components/auth/auth-modal";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroUIProviderWrapper } from "@/components/layout/hero-ui-provider";

export const metadata: Metadata = {
  title: "F1 Penca - Prediction App",
  description: "F1 race prediction app for friends",
  icons: {
    icon: "/brand/f1-penca-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="antialiased dark text-foreground bg-background"
      >
        <HeroUIProviderWrapper>
          <AuthProvider>
            <AuthModalProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
              <AuthModal />
            </AuthModalProvider>
          </AuthProvider>
        </HeroUIProviderWrapper>
      </body>
    </html>
  );
}
