import { z } from "zod";

export const createSubscriptionSchema = z.object({
  service_name: z.string().min(1, "Service name is required"),
  cost: z.coerce.number().nonnegative().nullable().optional(),
  billing_cycle: z.enum(["monthly", "annual", "6-month"]).nullable().optional(),
  email_account: z.string().email().nullable().optional(),
  signup_date: z.string().nullable().optional(),
  last_charge_date: z.string().nullable().optional(),
  next_renewal_date: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  tax_deductible: z.string().nullable().optional(),
  plan_name: z.string().nullable().optional(),
  plan_details: z.string().nullable().optional(),
  cancel_url: z.string().url().nullable().optional(),
  cancel_notes: z.string().nullable().optional(),
  keep_cancel_review: z.enum(["keep", "cancel", "review"]).optional().default("review"),
  status: z.enum(["active", "canceled", "lenny-pass"]).optional().default("active"),
  parent_subscription_id: z.coerce.number().int().positive().nullable().optional(),
  auto_renew: z.boolean().optional().default(true),
});

export const updateSubscriptionSchema = z
  .object({
    keep_cancel_review: z.enum(["keep", "cancel", "review"]).optional(),
    payment_source: z
      .enum(["personal", "work", "credit-card", "lenny-pass"])
      .nullable()
      .optional(),
    covered_by: z.string().nullable().optional(),
    cost: z.coerce.number().nonnegative().nullable().optional(),
    status: z.enum(["active", "canceled", "lenny-pass"]).nullable().optional(),
    next_renewal_date: z.string().nullable().optional(),
    plan_details: z.string().nullable().optional(),
    cancel_notes: z.string().nullable().optional(),
    tax_category: z
      .enum([
        "business-tools",
        "professional-dev",
        "software",
        "web-hosting",
        "hardware",
        "marketing",
        "insurance",
        "healthcare",
        "none",
      ])
      .nullable()
      .optional(),
    expense_type: z
      .enum(["personal", "business-sole-prop", "business-w2-unreimbursed", "mixed"])
      .nullable()
      .optional(),
    tax_deductible: z.string().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const createNoteSchema = z.object({
  note: z.string().min(1, "Note content is required"),
  note_type: z.string().optional(),
});

export const idParamSchema = z.string().regex(/^\d+$/, "Invalid ID");

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.input<typeof updateSubscriptionSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
