import * as React from "react";
import MuiCard, { CardProps as MuiCardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Card = React.forwardRef<HTMLDivElement, MuiCardProps>(
  (props, ref) => <MuiCard ref={ref} {...props} />
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sx?: any }
>(({ children, sx, ...props }, ref) => (
  <Box
    ref={ref}
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
      p: 3,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Box>
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { sx?: any }
>(({ children, sx, ...props }, ref) => (
  <Typography
    ref={ref as any}
    variant="h5"
    component="h3"
    sx={{ fontWeight: 600, ...sx }}
    {...props}
  >
    {children}
  </Typography>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { sx?: any }
>(({ children, sx, ...props }, ref) => (
  <Typography
    ref={ref as any}
    variant="body2"
    color="text.secondary"
    sx={sx}
    {...props}
  >
    {children}
  </Typography>
));
CardDescription.displayName = "CardDescription";

const MuiCardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CardContent>
>((props, ref) => <CardContent ref={ref} {...props} />);
MuiCardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sx?: any }
>(({ children, sx, ...props }, ref) => (
  <Box
    ref={ref}
    sx={{
      display: "flex",
      alignItems: "center",
      p: 3,
      pt: 0,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Box>
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, MuiCardContent as CardContent };
