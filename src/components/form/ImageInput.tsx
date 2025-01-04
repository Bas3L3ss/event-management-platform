import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  FieldValues,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { useState, useEffect } from "react";

type ImageInputProps = {
  register?: UseFormRegister<any>;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<any>;
  isZod?: boolean;
};

function ImageInput({
  watch,
  register,
  setValue,
  isZod = false,
}: ImageInputProps) {
  const name = "image";
  const [previews, setPreviews] = useState<string[]>([]);
  const watchedFiles = watch(name);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  useEffect(() => {
    if (watchedFiles?.length) {
      const urls = Array.from(watchedFiles).map((file) =>
        URL.createObjectURL(file as Blob)
      );
      setPreviews(urls);
    }
  }, [watchedFiles]);

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Images
      </Label>
      <Input
        id={name}
        type="file"
        multiple
        accept="image/*"
        max={3}
        {...(isZod && register ? register(name) : {})}
      />
      {previews.length > 0 && (
        <div className="mt-2 flex gap-2 flex-wrap">
          {previews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-24 h-24 object-cover rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageInput;
