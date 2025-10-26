import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Input } from "../components/common/Input";
import { toast } from "sonner";

const schema = z
  .object({
    sdt_id: z.string().optional(),
    parent: z.string().optional(),
    zone_name: z.string().min(2, "Zone name is required"),
    email: z.string().email("Invalid email").optional(),
    mobile1: z.string().optional(),
    mobile2: z.string().optional(),
    contact_name: z.string().optional(),
    contact_number: z.string().optional(),
    login_id: z.string().optional(),
    password: z.string().min(6).optional(),
    retype_password: z.string().optional(),
    address: z.string().optional(),
    address2: z.string().optional(),
    district: z.string().optional(),
    thana: z.string().optional(),
    zip_code: z.string().optional(),
    remarks: z.string().optional(),
    copy_form: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password || data.retype_password) {
      if (data.password !== data.retype_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
          path: ["retype_password"],
        });
      }
    }
  });

type FormSchema = z.infer<typeof schema>;

export const ZoneForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  useEffect(() => {
    reset({ copy_form: false });
  }, [reset]);

  const onSubmit = async (data: FormSchema) => {
    try {
      // TODO: hook into API service to save zone
      console.log("Submitted zone", data);
      toast.success("Zone created (placeholder)");
      navigate("/zones");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create zone");
    }
  };

  return (
    <div className="space-y-6 pt-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Zone</h1>
        <p className="text-gray-600 mt-1">
          Fill the form to create a new zone or SDT entry.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="SDT ID"
              {...register("sdt_id")}
              error={(errors as any).sdt_id?.message}
            />
            <Input
              label="Parent"
              {...register("parent")}
              error={(errors as any).parent?.message}
            />
            <Input
              label="Zone Name"
              {...register("zone_name")}
              error={(errors as any).zone_name?.message}
            />
            <Input
              label="Email"
              type="email"
              {...register("email")}
              error={(errors as any).email?.message}
            />
            <Input
              label="Mobile 1"
              {...register("mobile1")}
              error={(errors as any).mobile1?.message}
            />
            <Input
              label="Mobile 2"
              {...register("mobile2")}
              error={(errors as any).mobile2?.message}
            />
            <Input
              label="Contact Name"
              {...register("contact_name")}
              error={(errors as any).contact_name?.message}
            />
            <Input
              label="Contact Number"
              {...register("contact_number")}
              error={(errors as any).contact_number?.message}
            />
            <Input
              label="Login ID"
              {...register("login_id")}
              error={(errors as any).login_id?.message}
            />
            <Input
              label="Password"
              type="password"
              {...register("password")}
              error={(errors as any).password?.message}
            />
            <Input
              label="Retype Password"
              type="password"
              {...register("retype_password")}
              error={(errors as any).retype_password?.message}
            />
            <Input
              label="Address"
              {...register("address")}
              error={(errors as any).address?.message}
            />
            <Input
              label="Address 2"
              {...register("address2")}
              error={(errors as any).address2?.message}
            />
            <Input
              label="District"
              {...register("district")}
              error={(errors as any).district?.message}
            />
            <Input
              label="Thana"
              {...register("thana")}
              error={(errors as any).thana?.message}
            />
            <Input
              label="Zip Code"
              {...register("zip_code")}
              error={(errors as any).zip_code?.message}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                {...register("remarks")}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {(errors as any).remarks && (
                <p className="text-sm text-red-600 mt-1">
                  {(errors as any).remarks.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  {...register("copy_form")}
                />
                <span className="ml-2 text-sm text-gray-700">Copy form</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/zones")}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Create Zone
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ZoneForm;
