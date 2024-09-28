import { Label } from "../ui/label";
import { Input } from "../ui/input";

function ImageInput() {
  const name = "image";
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Images
      </Label>
      <Input
        id={name}
        name={name}
        type="file"
        multiple
        accept="image/*"
        max={5}
      />
    </div>
  );
}
export default ImageInput;
