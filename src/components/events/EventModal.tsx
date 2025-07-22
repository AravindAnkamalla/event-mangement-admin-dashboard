import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, User } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types";
import { UpsertEventInput } from "@/types/apiTypes";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null;
}

interface FormData {
  name: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  address: string;
  eventType: string;
  organizerName: string;
  organizerContact: string;
  imageUrl: string;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!event;

  useEffect(() => {
    if (isOpen) {
      if (event) {
        reset({
          name: event.name || "",
          description: event.description || "",
          eventDate: format(new Date(event.eventDate), "yyyy-MM-dd"),
          startTime: format(new Date(event.startTime), "HH:mm"),
          endTime: format(new Date(event.endTime), "HH:mm"),
          address: event.address || "",
          eventType: event.eventType || "",
          organizerName: event.organizerName || "",
          organizerContact: event.organizerContact || "",
          imageUrl: event.imageUrl || "",
        });
      } else {
        reset({
          name: "",
          description: "",
          eventDate: "",
          startTime: "",
          endTime: "",
          address: "",
          eventType: "",
          organizerName: "",
          organizerContact: "",
          imageUrl: "",
        });
      }
    }
  }, [isOpen, event]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: event?.name || "",
      description: event?.description || "",
      eventDate: event ? format(new Date(event.eventDate), "yyyy-MM-dd") : "",
      startTime: event ? format(new Date(event.startTime), "HH:mm") : "",
      endTime: event ? format(new Date(event.endTime), "HH:mm") : "",
      address: event?.address || "",
      eventType: event?.eventType || "",
      organizerName: event?.organizerName || "",
      organizerContact: event?.organizerContact || "",
      imageUrl: event?.imageUrl || "",
    },
  });

  const upsertEventMutation = useMutation({
    mutationFn: (data: UpsertEventInput) => eventsAPI.upsertEvent(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: response.message.includes("updated")
          ? "Event updated"
          : "Event created",
        description: response.message,
      });
      onClose();
      reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit event",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    const eventData: UpsertEventInput = {
      ...(event?.id ? { id: event.id } : {}),
      name: data.name,
      description: data.description,
      eventDate: new Date(data.eventDate).toISOString(),
      startTime: new Date(`${data.eventDate}T${data.startTime}`).toISOString(),
      endTime: new Date(`${data.eventDate}T${data.endTime}`).toISOString(),
      address: data.address,
      eventType: data.eventType,
      organizerName: data.organizerName,
      organizerContact: data.organizerContact,
      imageUrl: data.imageUrl,
    };

    upsertEventMutation.mutate(eventData);
  };

  const eventTypes = [
    "Conference",
    "Workshop",
    "Webinar",
    "Networking",
    "Training",
    "Seminar",
    "Meeting",
    "Other",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>{isEditing ? "Edit Event" : "Create New Event"}</span>
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the event details below."
              : "Fill in the details to create a new event."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                {...register("name", { required: "Event name is required" })}
                placeholder="Enter event name"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe your event..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="eventType">Event Type *</Label>
              <Select
                value={watch("eventType")}
                onValueChange={(value) => setValue("eventType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.eventType && (
                <p className="text-sm text-destructive mt-1">
                  {errors.eventType.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Date & Time
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  {...register("eventDate", {
                    required: "Event date is required",
                  })}
                />
                {errors.eventDate && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.eventDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...register("startTime", {
                    required: "Start time is required",
                  })}
                />
                {errors.startTime && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  {...register("endTime", { required: "End time is required" })}
                />
                {errors.endTime && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Location *
            </Label>
            <Input
              id="address"
              {...register("address", { required: "Address is required" })}
              placeholder="Enter event location"
            />
            {errors.address && (
              <p className="text-sm text-destructive mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <User className="w-5 h-5 mr-2" />
              Organizer Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizerName">Organizer Name *</Label>
                <Input
                  id="organizerName"
                  {...register("organizerName", {
                    required: "Organizer name is required",
                  })}
                  placeholder="Enter organizer name"
                />
                {errors.organizerName && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.organizerName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="organizerContact">Contact *</Label>
                <Input
                  id="organizerContact"
                  {...register("organizerContact", {
                    required: "Contact is required",
                  })}
                  placeholder="Email or phone number"
                />
                {errors.organizerContact && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.organizerContact.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">Event Image URL</Label>
            <Input
              id="imageUrl"
              {...register("imageUrl")}
              placeholder="https://example.com/event-image.jpg"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-gradient"
              disabled={upsertEventMutation.isPending}
            >
              {upsertEventMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isEditing ? "Updating..." : "Creating..."}</span>
                </div>
              ) : isEditing ? (
                "Update Event"
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
