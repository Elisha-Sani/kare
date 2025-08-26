import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Events By Kare",
  description:
    "Events with runway elegance - sophisticated experiences with style, precision, and unforgettable details.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body>
        {children}
        <Toaster position="top-right" expand={true} richColors closeButton />
      </body>
    </html>
  );
}
