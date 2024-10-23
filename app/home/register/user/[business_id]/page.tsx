import UserAdminForm from "./UserAdminForm";

export default async function UserAdminRegistrationPage({
  params,
}: {
  params: { business_id: string };
}) {


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Register Admin User</h1>
        <UserAdminForm businessId={params.business_id} />
      </div>
    </div>
  );
}