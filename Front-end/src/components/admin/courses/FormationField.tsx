
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { formationsService } from "@/services/formations.service";

interface FormationFieldProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export function FormationField({ form, disabled = false }: FormationFieldProps) {
  const { data: formations = [], isLoading } = useQuery({
    queryKey: ["formations"],
    queryFn: formationsService.getAllFormations,
  });

  return (
    <FormField
      control={form.control}
      name="formationId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Formation (Optional)</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || ""} 
            disabled={disabled || isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a formation" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {formations.map((formation: any) => (
                <SelectItem key={formation.id} value={formation.id.toString()}>
                  {formation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
