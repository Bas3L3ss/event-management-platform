import { useFormContext } from "react-hook-form";
import DateTimePicker from "@/components/form/DateTimePicker";

export function DateSelectionStep() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Select Event Dates</h2>

      <DateTimePicker
        isZod
        register={register}
        setValue={setValue}
        watch={watch}
      />

      {errors.dateStart && (
        <p className="text-destructive text-sm">
          {errors.dateStart.message as string}
        </p>
      )}
      {errors.dateEnd && (
        <p className="text-destructive text-sm">
          {errors.dateEnd.message as string}
        </p>
      )}
    </div>
  );
}
