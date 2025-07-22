import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Mail, Phone, Lock, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { User as UserType, CreateUserInput, Role } from "@/types";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserType | null;
}

interface FormData {
  username: string;
  email: string;
  mobile: string;
  role: Role;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      role: user?.role || "USER",
    },
  });

  const createUserMutation = useMutation({
    mutationFn: usersAPI.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "User created",
        description: "The user has been successfully created.",
      });
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateUserInput>;
    }) => usersAPI.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "User updated",
        description: "The user has been successfully updated.",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const userData: CreateUserInput = {
      username: data.username,
      email: data.email,
      mobile: data.mobile || undefined,
      role: data.role
    };

    if (isEditing && user) {
      updateUserMutation.mutate({ id: user.id, data: userData });
    } else {
      createUserMutation.mutate(userData);
    }
  };

  const handleRoleChange = (value: Role) => {
    setValue("role", value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>{isEditing ? "Edit User" : "Add New User"}</span>
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the user details below."
              : "Fill in the details to create a new user account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <Label htmlFor="username">Username *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="username"
                {...register("username", { required: "Username is required" })}
                placeholder="Enter username"
                className="pl-10"
              />
            </div>
            {errors.username && (
              <p className="text-sm text-destructive mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Enter email address"
                className="pl-10"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="mobile"
                {...register("mobile")}
                placeholder="Enter mobile number"
                className="pl-10"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role">Role *</Label>
            <Select value={watch("role")} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select role" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Administrator</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-gradient"
              disabled={
                createUserMutation.isPending || updateUserMutation.isPending
              }
            >
              {createUserMutation.isPending || updateUserMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isEditing ? "Updating..." : "Creating..."}</span>
                </div>
              ) : isEditing ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
