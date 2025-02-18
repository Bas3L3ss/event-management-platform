"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { toastPrint } from "@/utils/toast action/action";
import { Label } from "../ui/label";

interface ImagesAndVideoInputForEditPageProps {
  existingImages: string[]; // Array of existing image URLs
  existingVideo?: string | null; // URL of existing video
}

const ImagesAndVideoInputForEditPage: React.FC<
  ImagesAndVideoInputForEditPageProps
> = ({ existingImages, existingVideo }) => {
  const [countImagesRemaining, setCountImagesRemaining] = useState<number>(
    existingImages.length
  );
  const [itemSelected, setItemSelected] = useState<string[]>([]);

  useEffect(() => {
    setCountImagesRemaining(existingImages.length);
  }, [existingImages]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isChecked: boolean,
    index: number
  ) => {
    const newCheckedCount = isChecked
      ? countImagesRemaining - 1
      : countImagesRemaining + 1;

    if (newCheckedCount > 0) {
      setCountImagesRemaining(newCheckedCount);
      setItemSelected(
        isChecked
          ? [...itemSelected, `checkBoxImg-${index}`]
          : itemSelected.filter((el) => {
              return el !== `checkBoxImg-${index}`;
            })
      );
    } else {
      e.preventDefault();
      e.target.checked = false;
      return toastPrint(
        "Warning!",
        "You can't leave the image field empty",
        "destructive"
      );
    }
  };

  return (
    <>
      <div className="mb-5">
        <Label className="mb-2">
          Select images to remove them (can&apos;t remove all)
        </Label>
        <Input
          className="mb-2"
          type="file"
          name="image"
          multiple
          accept="image/*"
        />
        <div className="flex gap-4 flex-wrap">
          {existingImages.map((img, index) => (
            <div
              className={`${
                itemSelected.includes(`checkBoxImg-${index}`)
                  ? "border-2 border-red-600"
                  : "border-2 border-transparent "
              } relative  `}
              key={index}
            >
              <Image
                width={250}
                height={250}
                key={index}
                src={img}
                alt={`Existing Image ${index + 1}`}
              />
              <Label
                htmlFor={`checkBoxImg-${index}`}
                className="  absolute top-0 left-0 w-full h-full"
              >
                <Input
                  name={`imagesCheckBox-${index}`}
                  value={img}
                  id={`checkBoxImg-${index}`}
                  type="checkbox"
                  onChange={(e) =>
                    handleCheckboxChange(e, e.target.checked, index)
                  }
                  className="absolute top-2 left-2 sr-only"
                />
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Label className="mb-2">Replace the video</Label>

      <Input name="video" className="mb-2" type="file" accept="video/*" />
      {existingVideo && (
        <video width={250} height={250} src={existingVideo} controls />
      )}
    </>
  );
};

export default ImagesAndVideoInputForEditPage;
