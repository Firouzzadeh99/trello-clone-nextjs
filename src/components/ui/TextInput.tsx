"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  Ref,
} from "react";

type BaseInputProps = {
  textarea?: boolean;
  className?: string;
  "aria-label"?: string;
};

type InputProps = BaseInputProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseInputProps> & {
    textarea?: false;
  };

type TextareaProps = BaseInputProps &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    keyof BaseInputProps
  > & {
    textarea: true;
  };

export type TextInputProps = InputProps | TextareaProps;

export const TextInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextInputProps
>(function TextInput(props, ref) {
  if (props.textarea) {
    const { textarea, style, ...rest } = props;
    return (
      <textarea
        ref={ref as Ref<HTMLTextAreaElement>}
        rows={3}
        style={{
          height: "4rem",
          resize: "none",
          ...style,
        }}
        {...rest}
      />
    );
  }

  const { textarea, ...rest } = props;
  return <input ref={ref as Ref<HTMLInputElement>} {...rest} />;
});

TextInput.displayName = "TextInput";
