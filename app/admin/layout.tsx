import TopNavBar from "@/components/NavBar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body>
        <TopNavBar businessName = {"Admin Account"}/>
        {children}
      </body>
    </html>
  );
}
