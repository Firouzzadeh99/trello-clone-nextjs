"use client";

import { forwardRef, InputHTMLAttributes } from "react";

export type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    return <input ref={ref} {...props} />;
  },
);

TextInput.displayName = "TextInput";

