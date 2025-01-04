import { useFormContext } from "react-hook-form";
import ImageInput from "@/components/form/ImageInput";
import VideoInput from "@/components/form/VideoInput";
import CheckboxInput from "@/components/form/CheckBoxInput";
import { useEffect, useState } from "react";

export function MediaUploadStep() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();
  const [isChecked, setIsChecked] = useState(watch("isVideoFirstDisplay"));
  useEffect(() => {
    setValue("isVideoFirstDisplay", isChecked == "true" || isChecked == true);
  }, [isChecked]);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upload Media</h2>

      <div>
        <ImageInput
          watch={watch}
          isZod
          register={register}
          setValue={setValue}
        />
        {errors.image && (
          <p className="text-destructive text-sm mt-1">
            {errors.image.message as string}
          </p>
        )}
      </div>

      <div>
        <VideoInput watch={watch} register={register} setValue={setValue} />
        {errors.video && (
          <p className="text-destructive text-sm mt-1">
            {errors.video.message as string}
          </p>
        )}
      </div>

      <div>
        <CheckboxInput
          name="isVideoFirstDisplay"
          label="Display Video First"
          isZod
          setIsChecked={setIsChecked}
          defaultChecked={isChecked}
        />
      </div>
    </div>
  );
}
