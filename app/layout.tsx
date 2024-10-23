import "./globals.css";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        {/* <TopNavBar companyName={data?.email} /> */}
        {children}
      </body>
    </html>
  );
}
