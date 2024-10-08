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
import { registerTask } from "@/actions/taskActions";

export default function TaskInfoForm({ businessId }: { businessId: string }) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.append("business_id", businessId);

    const result = await registerTask(formData);

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
          <CardTitle>New Task Registration</CardTitle>
          <CardDescription>
            Create a new task. Tasks are responsiblities to which employees are
            assigned to during thier shifts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" required />
          </div>
          
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Add Task
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
