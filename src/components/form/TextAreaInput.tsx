import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister } from "react-hook-form";

type TextAreaInputProps = {
  name: string;
  labelText?: string;
  defaultValue?: string;
  register?: UseFormRegister<any>;
  validation?: object;
  isZod?: boolean;
};

function TextAreaInput({
  name,
  labelText,
  defaultValue,
  register,
  validation,
  isZod = false,
}: TextAreaInputProps) {
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
        defaultValue={defaultValue}
        rows={5}
        className="leading-loose"
        {...(isZod && register ? register(name, validation) : {})}
      />
    </div>
  );
}

export default TextAreaInput;
