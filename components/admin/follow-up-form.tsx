'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { FollowUpReason, ContactMethod, FollowUpStatus, Priority } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { createFollowUp, updateFollowUp, type FollowUpFormData } from '@/lib/actions/follow-ups';

const formSchema = z.object({
  memberId: z.string().min(1, 'Member is required'),
  assignedToId: z.string().min(1, 'Assigned to is required'),
  assignedToName: z.string().min(1, 'Assigned to name is required'),
  reason: z.nativeEnum(FollowUpReason),
  reasonOther: z.string().optional(),
  priority: z.nativeEnum(Priority),
  method: z.nativeEnum(ContactMethod).optional(),
  status: z.nativeEnum(FollowUpStatus),
  dueDate: z.date(),
  completedAt: z.date().optional(),
  initialNotes: z.string().optional(),
  followUpNotes: z.string().optional(),
  outcome: z.string().optional(),
  requiresFollowUp: z.boolean(),
  nextFollowUpDate: z.date().optional(),
});

interface FollowUpFormProps {
  initialData?: any;
  followUpId?: string;
  members: Array<{ id: string; firstName: string; lastName: string; email: string | null }>;
  users: Array<{ id: string; name: string; email: string }>;
}

export function FollowUpForm({ initialData, followUpId, members, users }: FollowUpFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      memberId: '',
      assignedToId: '',
      assignedToName: '',
      reason: 'NEW_VISITOR',
      reasonOther: '',
      priority: 'NORMAL',
      method: undefined,
      status: 'PENDING',
      dueDate: new Date(),
      completedAt: undefined,
      initialNotes: '',
      followUpNotes: '',
      outcome: '',
      requiresFollowUp: false,
      nextFollowUpDate: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const data: any = {
      ...values,
      reasonOther: values.reasonOther || null,
      method: values.method || null,
      completedAt: values.completedAt || null,
      initialNotes: values.initialNotes || null,
      followUpNotes: values.followUpNotes || null,
      outcome: values.outcome || null,
      nextFollowUpDate: values.nextFollowUpDate || null,
    };

    const result = followUpId
      ? await updateFollowUp(followUpId, data)
      : await createFollowUp(data);

    if (result.success) {
      toast.success(followUpId ? 'Follow-up updated successfully' : 'Follow-up created successfully');
      router.push('/admin/follow-ups');
      router.refresh();
    } else {
      toast.error(result.error || 'Something went wrong');
    }

    setIsSubmitting(false);
  }

  // Update assignedToName when assignedToId changes
  const handleAssignedToChange = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      form.setValue('assignedToName', user.name);
    }
  };

  const showOtherReason = form.watch('reason') === 'OTHER';
  const showNextFollowUp = form.watch('requiresFollowUp');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Follow-up Information</CardTitle>
            <CardDescription>Who needs to be followed up and why</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.firstName} {member.lastName}
                          {member.email && ` (${member.email})`}
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
              name="assignedToId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To *</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleAssignedToChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Who will be responsible for this follow-up
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NEW_VISITOR">New Visitor</SelectItem>
                        <SelectItem value="NEW_CONVERT">New Convert</SelectItem>
                        <SelectItem value="ABSENT">Absent</SelectItem>
                        <SelectItem value="SICK">Sick</SelectItem>
                        <SelectItem value="PRAYER_REQUEST">Prayer Request</SelectItem>
                        <SelectItem value="COUNSELING">Counseling</SelectItem>
                        <SelectItem value="MEMBERSHIP">Membership</SelectItem>
                        <SelectItem value="BAPTISM">Baptism</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="NORMAL">Normal</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {showOtherReason && (
              <FormField
                control={form.control}
                name="reasonOther"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specify Other Reason</FormLabel>
                    <FormControl>
                      <Input placeholder="Please specify..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="initialNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Initial notes about this follow-up..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Follow-up Details */}
        <Card>
          <CardHeader>
            <CardTitle>Follow-up Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        <SelectItem value="NO_RESPONSE">No Response</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Method</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                      defaultValue={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="PHONE_CALL">Phone Call</SelectItem>
                        <SelectItem value="TEXT_MESSAGE">Text Message</SelectItem>
                        <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                        <SelectItem value="EMAIL">Email</SelectItem>
                        <SelectItem value="HOME_VISIT">Home Visit</SelectItem>
                        <SelectItem value="CHURCH_VISIT">Church Visit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When this follow-up should be completed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="followUpNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Follow-up Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes from the follow-up conversation..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add notes after completing the follow-up
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="outcome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outcome</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Result or outcome of the follow-up..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Next Follow-up */}
        <Card>
          <CardHeader>
            <CardTitle>Next Follow-up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="requiresFollowUp"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Requires Another Follow-up</FormLabel>
                    <FormDescription>
                      Check if this member needs another follow-up
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {showNextFollowUp && (
              <FormField
                control={form.control}
                name="nextFollowUpDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Next Follow-up Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
            {followUpId ? 'Update Follow-up' : 'Create Follow-up'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
