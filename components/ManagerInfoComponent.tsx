// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { createClient } from "@/utils/supabase/server";
// import { UserCircle, Mail, Phone, Building } from "lucide-react";
// import Image from "next/image";

// export default async function ManagerInfoComponent() {
//   const supabase = createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return <p>No user information available.</p>;
//   }

//   const { full_name, email, phone, profile_image_url, business_id } =
//     user.user_metadata;

//   return (
//     <Card className="col-span-1">
//       <CardHeader>
//         <CardTitle className="flex items-center">
//           <UserCircle className="mr-2" />
//           Manager Info
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <div className="flex justify-center">
//             {profile_image_url ? (
//               <Image
//                 src={profile_image_url}
//                 alt={full_name || "Manager"}
//                 width={100}
//                 height={100}
//                 className="rounded-full"
//               />
//             ) : (
//               <UserCircle size={100} />
//             )}
//           </div>
//           <div className="space-y-2">
//             <p className="flex items-center">
//               <UserCircle className="mr-2" size={18} />
//               {full_name || "N/A"}
//             </p>
//             <p className="flex items-center">
//               <Mail className="mr-2" size={18} />
//               {email || "N/A"}
//             </p>
//             {phone && (
//               <p className="flex items-center">
//                 <Phone className="mr-2" size={18} />
//                 {phone}
//               </p>
//             )}
//             <p className="flex items-center">
//               <Building className="mr-2" size={18} />
//               Business ID: {business_id || "N/A"}
//             </p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

const ManagerAccountInfo = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <p>No user information available.</p>;
  }

  const { full_name, email, phone, business_id } = user.user_metadata;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="https://picsum.photos/200/300?grayscale" alt={full_name} />
            <AvatarFallback>{full_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-bold">{full_name}</CardTitle>
            <p className="text-sm text-muted-foreground">Manager Account</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 py-4">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">Email</h3>
          <p className="text-sm">{email}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">Phone</h3>
          <p className="text-sm">{phone}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">Business ID</h3>
          <p className="text-sm">{business_id}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">Role</h3>
          <p className="text-sm">Manager</p>
        </div>
      </CardContent>
      <CardFooter>
        <Link 
          href="/update-account" 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center justify-center"
        >
          Update Information
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ManagerAccountInfo;