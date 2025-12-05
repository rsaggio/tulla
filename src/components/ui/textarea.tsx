import * as React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";

export interface TextareaProps extends Omit<TextFieldProps, 'variant'> {
  variant?: "outlined" | "filled" | "standard";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant = "outlined", ...props }, ref) => {
    return (
      <TextField
        inputRef={ref}
        variant={variant}
        fullWidth
        multiline
        rows={4}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
