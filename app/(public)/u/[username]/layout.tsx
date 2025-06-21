import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link in Bio",
  description: "Link in Bio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
