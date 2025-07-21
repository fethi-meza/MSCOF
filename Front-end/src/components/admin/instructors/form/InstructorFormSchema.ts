
import { z } from "zod";

// Schema for instructor creation
export const instructorFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().optional().nullable(),
  specialization: z.string().optional().nullable(),
  isSpecialist: z.boolean().default(false),
  departmentId: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
});

// Schema for instructor editing (no email/password required)
export const instructorEditFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().optional().nullable(),
  specialization: z.string().optional().nullable(),
  isSpecialist: z.boolean().default(false),
  departmentId: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
});

export type InstructorFormValues = z.infer<typeof instructorFormSchema>;
export type InstructorEditFormValues = z.infer<typeof instructorEditFormSchema>;
