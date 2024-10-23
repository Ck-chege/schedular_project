import { getUser } from "@/actions/UserActions";
import { redirect } from 'next/navigation'

export default async function Home() {

  const user = await getUser()
  const role = user?.user_metadata?.role

  if (role=== 'admin') {
    redirect('/admin')
  }
  if (role=== 'manager') {
    redirect('/home')
  }
  if (role=== 'employee') {
    redirect('/employee')
  }

  return (
    <p>Welcome</p>
  );
}
