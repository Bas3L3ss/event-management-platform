import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  FieldValues,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { useState, useEffect } from "react";

type VideoInputProps = {
  register: UseFormRegister<any>;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<any>;
};

function VideoInput({ register, watch, setValue }: VideoInputProps) {
  const name = "video";
  const [preview, setPreview] = useState<string | null>(null);
  const watchedFile = watch(name);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    if (watchedFile?.[0]) {
      const fileUrl = URL.createObjectURL(watchedFile[0]);
      setPreview(fileUrl);
    }
  }, [watchedFile]);

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Video
      </Label>
      <Input id={name} type="file" accept="video/*" {...register(name)} />
      {preview && (
        <video className="mt-2 max-w-xs" controls>
          <source src={preview} type={watchedFile?.[0]?.type} />
        </video>
      )}
    </div>
  );
}

export default VideoInput;
