"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";
import { userService } from "@/services/user.service";
import { profileFormSchema, ProfileFormValues } from "@/schemas/profile.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileForm() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsLoading(true);
      const updatedUser = await userService.updateProfile(values);
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your contact details and account email address</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <Input
            id="prof-name"
            label="Full Name"
            placeholder="Your name"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            id="prof-email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            id="prof-phone"
            type="tel"
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </CardContent>

        <CardFooter className="flex justify-end pt-2">
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
