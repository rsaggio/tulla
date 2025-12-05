import * as React from "react";
import Chip, { ChipProps } from "@mui/material/Chip";

export interface BadgeProps extends Omit<ChipProps, 'variant'> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = "default", ...props }, ref) => {
    const getColor = (): ChipProps['color'] => {
      if (variant === "destructive") return "error";
      if (variant === "secondary") return "secondary";
      return "primary";
    };

    const getMuiVariant = (): ChipProps['variant'] => {
      if (variant === "outline") return "outlined";
      return "filled";
    };

    return (
      <Chip
        ref={ref}
        color={getColor()}
        variant={getMuiVariant()}
        size="small"
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
