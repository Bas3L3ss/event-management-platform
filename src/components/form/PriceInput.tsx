import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { UseFormRegister } from "react-hook-form";

const name = "price";
type FormInputNumberProps = {
  defaultValue?: number;
  register?: UseFormRegister<any>;
  validation?: object;
  isZod?: boolean;
};

function PriceInput({
  defaultValue,
  register,
  validation,
  isZod = false,
}: FormInputNumberProps) {
  return (
    <div className="mb-2">
      <Label
        htmlFor="price"
        className="mb-2 block text-sm font-medium text-primary"
      >
        Price ($)
      </Label>
      <Input
        id={name}
        type="number"
        name={name}
        min={0}
        defaultValue={defaultValue || 100}
        required
        {...(isZod && register ? register(name, validation) : {})}
      />
    </div>
  );
}
export default PriceInput;
