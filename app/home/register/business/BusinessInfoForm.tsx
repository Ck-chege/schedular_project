"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { registerBusiness } from "@/actions/registerBusinessAction";
import { useRouter } from "next/navigation";

export default function BusinessInfoForm() {
  const router = useRouter();

  ("use server");
  async function onSubmit(formData: FormData) {
    const result = await registerBusiness(formData);
    if (result.success && result.businessId) {
        console.log("Successfully registered business:", result.businessId);
      router.push(`/register/user/${result.businessId}`);
      console.log("Redirecting to user registration page...");
      
    } else if (result.error) {
      // Handle the error, e.g., display it to the user
      console.error(result.error);
      // You might want to set an error state and display it in the UI
    }
  }

  return (
    <form action={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Please provide your business details
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name</Label>
            <Input id="name" name="name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trading_name">Trading Name (if different)</Label>
            <Input id="trading_name" name="trading_name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_type">Business Type</Label>
            <Select name="business_type">
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soleProprietorship">
                  Sole Proprietorship
                </SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="corporation">Corporation</SelectItem>
                <SelectItem value="llc">LLC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" name="industry" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Business Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Business Phone</Label>
            <Input id="phone" name="phone" type="tel" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website (optional)</Label>
            <Input id="website" name="website" type="url" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Textarea id="description" name="description" rows={4} />
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" type="submit">
            Next: Register Root User
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
