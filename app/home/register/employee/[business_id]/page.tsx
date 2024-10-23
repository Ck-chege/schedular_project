import { getTasks } from "@/actions/taskActions";
import EmployeeForm from "./EmployeeInfoForm";

export default async function BusinessRegistrationPage({
    params,
  }: {
    params: { business_id: string };
}) {

  const {data: tasks, error} = await getTasks();
  if (error) {
    console.error('Failed to fetch tasks:', error);
    return <div>Failed to fetch tasks</div>;
  }


  return (
    <div className="flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl p-6">
        <EmployeeForm businessId={params.business_id} tasks={tasks || []} />
      </div>
    </div>
  )
}