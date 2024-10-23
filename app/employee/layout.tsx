import TopNavBarEmployee from "@/components/employee/TopNavBarEmployee";

export default async function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  
    return (
      <html lang="en">
        <body>
          <TopNavBarEmployee  />
          {children}
        </body>
      </html>
    );
  }
  