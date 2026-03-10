import { Field, FieldLabel } from "./field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./select";
import { type ReactNode } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type FieldSelectInputProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  className?: string;
  required?: boolean;
  actionButton?: ReactNode;
};

export default function FieldSelectInput({
  label,
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  name,
  className,
  required,
  actionButton
}: FieldSelectInputProps) {
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex w-full items-center gap-2">
        <div className="flex-1">
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger disabled={disabled} id={id} className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectGroup>
                {options.length > 0 ? (
                  options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="__empty__" disabled>
                    No options
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {name ? (
          <input type="hidden" name={name} value={value} required={required} />
        ) : null}
        {actionButton ?? null}
      </div>
    </Field>
  );
}
