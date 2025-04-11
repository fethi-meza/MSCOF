
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Formation } from './FormationList';

const formationSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  availableSpots: z.coerce.number().int().positive({
    message: 'Available spots must be a positive number.',
  }),
  durationInHours: z.coerce.number().int().positive({
    message: 'Duration must be a positive number.',
  }),
  startDate: z.string().min(1, {
    message: 'Start date is required.',
  }),
  endDate: z.string().min(1, {
    message: 'End date is required.',
  }),
  instructorId: z.string().optional(),
});

type FormationFormValues = z.infer<typeof formationSchema>;

interface FormationFormProps {
  formation?: Formation;
  onSubmit: (data: FormationFormValues) => void;
  onCancel: () => void;
}

const FormationForm: React.FC<FormationFormProps> = ({ formation, onSubmit, onCancel }) => {
  // Mock instructors data - in a real app, this would come from an API
  const instructors = [
    { id: '1', name: 'Sarah Johnson' },
    { id: '2', name: 'David Wilson' },
    { id: '3', name: 'Michael Brown' },
    { id: '4', name: 'Amanda Garcia' },
    { id: '5', name: 'James Martinez' }
  ];

  const form = useForm<FormationFormValues>({
    resolver: zodResolver(formationSchema),
    defaultValues: formation ? {
      name: formation.name,
      description: formation.description,
      availableSpots: formation.availableSpots,
      durationInHours: formation.durationInHours,
      startDate: formation.startDate,
      endDate: formation.endDate,
      instructorId: instructors.find(i => i.name === formation.instructorName)?.id,
    } : {
      name: '',
      description: '',
      availableSpots: 20,
      durationInHours: 40,
      startDate: '',
      endDate: '',
      instructorId: '',
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formation Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Introduction to Programming" {...field} />
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
                  placeholder="Provide a brief description of the formation" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="availableSpots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Spots</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="durationInHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (hours)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="instructorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an instructor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {instructors.map(instructor => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{formation ? 'Update Formation' : 'Add Formation'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default FormationForm;
