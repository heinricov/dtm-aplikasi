import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type FieldInputTextareaProps = {
  label: string;
  id: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
  description?: string;
  className?: string;
};

export function FieldInputTextarea({
  label,
  id,
  name,
  value,
  defaultValue,
  placeholder,
  rows,
  disabled,
  readOnly,
  required,
  onChange,
  description,
  className
}: FieldInputTextareaProps) {
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        onChange={onChange ? (e) => onChange(e.currentTarget.value) : undefined}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  );
}
