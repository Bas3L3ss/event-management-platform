"use client";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldValues, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import SkeletonLoading from "../SkeletonLoading";
import dynamic from "next/dynamic";

const FormDescriptionRIchText = dynamic(
  () => import("@/components/form/FormDescriptionRIchText"),
  {
    loading: () => <SkeletonLoading />,
  }
);
type TextAreaInputProps = {
  name: string;
  labelText?: string;
  watch?: UseFormWatch<FieldValues>;
  setValue?: UseFormSetValue<FieldValues>;
  isZod?: boolean;
  contentData?: string;
};

function TextAreaInput({
  name,
  labelText,
  contentData,
  setValue,
  watch,
  isZod = false,
}: TextAreaInputProps) {
  const [content, setContent] = useState<string>(
    contentData ? contentData : watch ? watch(name) : ""
  );
  useEffect(() => {
    if (isZod && setValue) {
      setValue(name, content);
    }
  }, [content]);

  return (
    <div className="mb-2">
      <Label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-primary"
      >
        {labelText || name}
      </Label>
      <Textarea
        id={name}
        name={name}
        value={content}
        rows={5}
        className="leading-loose opacity-0 absolute top-0 left-0"
      />

      <FormDescriptionRIchText content={content} setContent={setContent} />
    </div>
  );
}

export default TextAreaInput;
