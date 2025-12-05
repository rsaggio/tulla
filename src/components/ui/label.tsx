import * as React from "react";
import FormLabel, { FormLabelProps } from "@mui/material/FormLabel";

const Label = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  (props, ref) => {
    return <FormLabel ref={ref as any} {...props} />;
  }
);

Label.displayName = "Label";

export { Label };
