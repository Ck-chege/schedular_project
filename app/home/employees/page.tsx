import React from 'react';
import { getEmployeesWithTasks } from '@/actions/EmployeeActions';
import { getUserBusinessId } from '@/actions/UserActions';
import EmployeeList from './EmployeeList';

async function EmployeeListPage() {

  const business_id = await getUserBusinessId()
  const {data: employees, error} = await getEmployeesWithTasks()
  if (error) {
    console.error('Error fetching employees:', error);
  }

  // // Function to handle adding auth for an employee
  // const handleAddAuth = async (employeeId: string) => {
  //   // This function should be implemented to add Supabase auth for the employee
  //   console.log(`Add auth for employee ${employeeId}`);
  //   // After adding auth, you should update the is_auth_set status in the database
  // }; 

  return (
    <EmployeeList employees={employees || []} business_id={business_id} />
  );
}

export default EmployeeListPage;;