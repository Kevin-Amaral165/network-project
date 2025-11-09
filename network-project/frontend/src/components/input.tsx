"use client";

import { Input as AntInput } from "antd";
import type { InputProps as AntInputProps } from "antd";
import clsx from "clsx";

export interface InputProps extends AntInputProps {
  label?: string;
  placeholder?: string;
  className?: string;
  size?: "small" | "middle" | "large";
  readOnly?: boolean;
  disabled?: boolean;
}

export function Input({
  label,
  placeholder,
  className,
  size = "middle",
  readOnly = false,
  disabled = false,
  id,
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
