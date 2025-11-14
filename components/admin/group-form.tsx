'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { createGroup, updateGroup, type GroupFormData } from '@/lib/actions/groups';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  leaderId: z.string().optional(),
  leaderName: z.string().optional(),
  ministryId: z.string().optional(),
  meetingDay: z.string().optional(),
  meetingTime: z.string().optional(),
  meetingLocation: z.string().optional(),
  maxMembers: z.coerce.number().optional(),
  isActive: z.boolean().default(true),
});

interface GroupFormProps {
  initialData?: any;
  groupId?: string;
  ministries: Array<{ id: string; name: string }>;
}

export function GroupForm({ initialData, groupId, ministries }: GroupFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      leaderId: '',
      leaderName: '',
      ministryId: '',
      meetingDay: '',
      meetingTime: '',
      meetingLocation: '',
      maxMembers: undefined,
      isActive: true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const data: any = {
      ...values,
      description: values.description || null,
      leaderId: values.leaderId || null,
      leaderName: values.leaderName || null,
      ministryId: values.ministryId || null,
      meetingDay: values.meetingDay || null,
      meetingTime: values.meetingTime || null,
      meetingLocation: values.meetingLocation || null,
      maxMembers: values.maxMembers || null,
    };

    const result = groupId
      ? await updateGroup(groupId, data)
      : await createGroup(data);

    if (result.success) {
      toast.success(groupId ? 'Group updated successfully' : 'Group created successfully');
      router.push('/admin/groups');
      router.refresh();
    } else {
      toast.error(result.error || 'Something went wrong');
    }

    setIsSubmitting(false);
  }

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Group Information</CardTitle>
            <CardDescription>Basic details about the group</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Tuesday Night Bible Study" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the group's purpose and activities..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="leaderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Leader Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ministryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Associated Ministry</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                      defaultValue={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a ministry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {ministries.map((ministry) => (
                          <SelectItem key={ministry.id} value={ministry.id}>
                            {ministry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Optional: Link this group to a ministry
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Meeting Details */}
        <Card>
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
            <CardDescription>When and where the group meets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="meetingDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Day</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                      defaultValue={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meetingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Time</FormLabel>
                    <FormControl>
                      <Input placeholder="7:00 PM" {...field} />
                    </FormControl>
                    <FormDescription>
                      E.g., 7:00 PM or 19:00
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="meetingLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Church Hall or member's home address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="maxMembers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Members (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="12"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty for no limit. Useful for small groups with limited capacity.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Only active groups will be visible to members
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {groupId ? 'Update Group' : 'Create Group'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
