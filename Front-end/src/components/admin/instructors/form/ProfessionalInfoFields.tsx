
import React from "react";
import { UseFormReturn, useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhotoField } from "./PhotoField";

interface ProfessionalInfoFieldsProps {
  form?: UseFormReturn<any>;
  disabled?: boolean;
  departments?: any[];
}

export function ProfessionalInfoFields({ form, disabled = false, departments = [] }: ProfessionalInfoFieldsProps) {
  // Use provided form or get it from context
  const formContext = useFormContext();
  const formToUse = form || formContext;
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-md">Professional Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={formToUse.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Mathematics, Physics" {...field} value={field.value || ""} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={formToUse.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""} 
                disabled={disabled || !departments?.length}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {departments?.map((dept: any) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={formToUse.control}
        name="isSpecialist"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Specialist Instructor
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
      
      <PhotoField form={formToUse} disabled={disabled} />
    </div>
  );
}
