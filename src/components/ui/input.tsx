import * as React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: "outlined" | "filled" | "standard";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "outlined", ...props }, ref) => {
    return (
      <TextField
        inputRef={ref}
        variant={variant}
        fullWidth
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
