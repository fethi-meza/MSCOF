
import React from "react";
import { UseFormReturn, useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Image } from "lucide-react";

interface PhotoFieldProps {
  form?: UseFormReturn<any>;
  disabled?: boolean;
}

export function PhotoField({ form, disabled = false }: PhotoFieldProps) {
  // Use provided form or get it from context
  const formContext = useFormContext();
  const formToUse = form || formContext;
  
  return (
    <FormField
      control={formToUse.control}
      name="photo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Photo URL</FormLabel>
          <FormControl>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter photo URL" 
                {...field} 
                value={field.value || ""} 
                disabled={disabled}
                className="flex-grow"
              />
              {field.value && (
                <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={field.value} 
                    alt="Photo preview" 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519241047957-be31d7379a5d";
                    }}
                  />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
