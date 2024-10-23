import { createClient } from "@/utils/supabase/server";
import TopNavBar from "@/components/NavBar";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const supabase = createClient();

  const {data: { user }} = await supabase.auth.getUser();
  
  console.log(`${user?.user_metadata.business_id}`)
  const { data, error: companyError } = await supabase.from("businesses")
    .select("name").eq("id", user?.user_metadata.business_id).single();

    if(companyError){
        console.error(`${companyError?.message}`)
    }
    console.log(`${data?.name}`)
  return (
    <html lang="en">
      <body>
        <TopNavBar businessName = {data?.name ?? "Log in"}/>
        {children}
      </body>
    </html>
  );
}
