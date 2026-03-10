"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return format(date, "yyyy-MM-dd");
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

type DatePickerInputProps = {
  label: string;
  id: string;
  value?: Date;
  onChange: (value: Date | undefined) => void;
  name?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
};

export function DatePickerInput({
  label,
  id,
  value,
  onChange,
  name,
  placeholder = "YYYY-MM-DD",
  className,
  disabled,
  required
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(value);
  const [inputValue, setInputValue] = React.useState(formatDate(value));

  React.useEffect(() => {
    setInputValue(formatDate(value));
    setMonth(value);
  }, [value]);

  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          name={name}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={(e) => {
            const date = new Date(e.target.value);
            setInputValue(e.target.value);
            if (!e.target.value) {
              onChange(undefined);
              return;
            }
            if (isValidDate(date)) {
              onChange(date);
              setMonth(date);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                id={`${id}-picker`}
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
                disabled={disabled}
              >
                <CalendarIcon />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={value}
                month={month}
                onMonthChange={setMonth}
                onSelect={(date) => {
                  onChange(date);
                  setInputValue(formatDate(date));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
