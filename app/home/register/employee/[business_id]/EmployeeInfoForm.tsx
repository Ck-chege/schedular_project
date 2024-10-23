"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerEmployee } from "../../../../../actions/EmployeeActions";
import MultiSelect from "@/components/MultiSelect";
import { Task } from "@/types/shift_cycle_types";

export default function EmployeeForm({ businessId,tasks }: { businessId: string, tasks: Task[] }) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [primaryTaskId, setPrimaryTaskId] = useState<string>("");
  const [secondaryTasks, setSecondaryTasks] = useState<string[]>([]);


  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.append("business_id", businessId);
    formData.append("primaryTask", primaryTaskId);
    formData.append("secondaryTasks", JSON.stringify(secondaryTasks));

    const result = await registerEmployee(formData);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/home");
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Employee Registration</CardTitle>
          <CardDescription>Add a new employee</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primaryTask">Primary Task</Label>
            <Select
              name="primaryTask"
              value={primaryTaskId}
              onValueChange={setPrimaryTaskId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a primary task" />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Secondary Tasks</Label>
            <MultiSelect
              options={tasks.filter(task => task.id !== primaryTaskId).map(task => task.name)}
              value={secondaryTasks.map(taskId => tasks.find(task => task.id === taskId)?.name || "")}
              onChange={(selectedOptions) => {
                setSecondaryTasks(selectedOptions.map(option => tasks.find(task => task.name === option)?.id || ""));
              }}
              placeholder="Select secondary tasks"
              primaryTask={primaryTaskId}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxHours">Maximum Working Hours per Week</Label>
            <Input
              id="maxHours"
              name="maxHours"
              type="number"
              min="0"
              max="168"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Register Employee
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}