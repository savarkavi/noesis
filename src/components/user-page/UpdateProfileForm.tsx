"use client";

import { updateUserProfileSchema, UserProfileValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useUpdateUserMutation } from "@/lib/mutations/userMutations";
import { Loader2 } from "lucide-react";
import UserAvatarInput from "./UserAvatarInput";
import { useState } from "react";

const UpdateProfileForm = ({ user }: { user: User }) => {
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

  const mutation = useUpdateUserMutation();

  const form = useForm<UserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      fullname: user.fullname || "",
      username: user.username,
      bio: user.bio || "",
    },
  });

  const onSubmit = async (values: UserProfileValues) => {
    const newAvatar = croppedImage
      ? new File([croppedImage], `avatar/${user.id}.webp`)
      : undefined;

    mutation.mutate(
      { data: values, avatar: newAvatar },
      { onSuccess: () => setCroppedImage(null) },
    );
  };

  return (
    <div>
      <UserAvatarInput
        src={croppedImage ? URL.createObjectURL(croppedImage) : user.avatarUrl}
        onImageCropped={setCroppedImage}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-lg text-blue-600">
                  Fullname
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="fullname"
                    {...field}
                    className="py-6 text-white placeholder:text-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-blue-600">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="username"
                    {...field}
                    className="py-6 text-white placeholder:text-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-blue-600">Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="write something about yourself"
                    {...field}
                    className="resize-none py-4 text-white placeholder:text-gray-400"
                    rows={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-32 text-white"
          >
            {mutation.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UpdateProfileForm;
