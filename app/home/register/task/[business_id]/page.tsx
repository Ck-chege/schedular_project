import TaskInfoForm from "./TaskInfoForm";

export default function BusinessRegistrationPage({
    params,
  }: {
    params: { business_id: string };
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-2xl p-6">
        <TaskInfoForm businessId={params.business_id}/>
      </div>
    </div>
  )
}