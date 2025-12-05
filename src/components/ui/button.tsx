import * as React from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", children, ...props }, ref) => {
    // Map variant to MUI variant
    const getMuiVariant = (): MuiButtonProps['variant'] => {
      if (variant === "outline") return "outlined";
      if (variant === "ghost" || variant === "link") return "text";
      return "contained";
    };

    // Map variant to color
    const getMuiColor = (): MuiButtonProps['color'] => {
      if (variant === "destructive") return "error";
      if (variant === "secondary") return "secondary";
      return "primary";
    };

    // Map size to MUI size
    const getMuiSize = (): MuiButtonProps['size'] => {
      if (size === "sm") return "small";
      if (size === "lg") return "large";
      if (size === "icon") return "small";
      return "medium";
    };

    // If it's an icon button
    if (size === "icon") {
      return (
        <IconButton
          ref={ref as any}
          color={getMuiColor()}
          size={getMuiSize()}
          {...props as any}
        >
          {children}
        </IconButton>
      );
    }

    return (
      <MuiButton
        ref={ref}
        variant={getMuiVariant()}
        color={getMuiColor()}
        size={getMuiSize()}
        sx={{
          textDecoration: variant === "link" ? "underline" : "none",
          ...props.sx,
        }}
        {...props}
      >
        {children}
      </MuiButton>
    );
  }
);

Button.displayName = "Button";

export { Button };
