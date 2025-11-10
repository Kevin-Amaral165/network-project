"use client";

// Libraries
import { Input as AntInput } from "antd";
import type { InputProps as AntInputProps } from "antd";
import clsx from "clsx";

export interface InputProps extends AntInputProps {
  className?: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  readOnly?: boolean;
  size?: "small" | "middle" | "large";
}

export function Input({
  className,
  disabled = false,
  id,
  label,
  placeholder,
  readOnly = false,
  size = "middle",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col w-full mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-gray-700 font-semibold mb-2"
        >
          {label}
        </label>
      )}

      <AntInput
        id={id}
        size={size}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        className={clsx(
          "rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500",
          className
        )}
        {...props}
      />
    </div>
  );
}
