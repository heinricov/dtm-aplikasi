import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type FieldInputProps = {
  label: string;
  id: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
  description?: string;
  className?: string;
};

export function FieldInput({
  label,
  id,
  name,
  value,
  defaultValue,
  placeholder,
  type = "text",
  disabled,
  readOnly,
  required,
  onChange,
  description,
  className
}: FieldInputProps) {
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        onChange={onChange ? (e) => onChange(e.currentTarget.value) : undefined}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  );
}
