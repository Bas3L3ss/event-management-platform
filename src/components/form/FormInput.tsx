import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { UseFormRegister } from "react-hook-form";

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  register?: UseFormRegister<any>;
  validation?: object;
  isZod?: boolean;
  disabled?: boolean;
};

function FormInput({
  label,
  name,
  type,
  defaultValue,
  placeholder,
  register,
  validation,
  isZod = false,
  disabled = false,
}: FormInputProps) {
  return (
    <div className="mb-2">
      <Label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-primary"
      >
        {label || name}
      </Label>
      <Input
        id={name}
        name={name}
        disabled={disabled}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        {...(isZod && register ? register(name, validation) : {})}
      />
    </div>
  );
}

export default FormInput;
