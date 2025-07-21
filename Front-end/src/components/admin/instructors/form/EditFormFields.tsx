
import { useFormContext } from "react-hook-form";
import { InstructorEditFormValues } from "./InstructorFormSchema";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { ProfessionalInfoFields } from "./ProfessionalInfoFields";
import { Department } from "@/types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EditFormFieldsProps {
  departments?: Department[];
}

export function EditFormFields({ departments }: EditFormFieldsProps) {
  const form = useFormContext<InstructorEditFormValues>();
  
  return (
    <div className="space-y-4">
      <PersonalInfoFields />
      
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="Phone number" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <ProfessionalInfoFields departments={departments} />
    </div>
  );
}
