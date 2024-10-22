import { ReactNode } from "react";
import { SpaceProps, TypographyProps } from "styled-system";

export const variants = {
  PRIMARY: "primary",
  TRANS: "transparent", 
  NOHOMO: "nohomo", 
  RED: "red", 
  GOLD: "gold", 
  GREEN: "green", 
  SECONDARY: "secondary",
  SUCCESS: "success",
  TEXTDISABLED: "textDisabled",
  TEXTSUBTLE: "textSubtle",
  BINANCE: "binance",
  FAILURE: "failure",
  WARNING: "warning",
} as const;

export const scales = {
  MD: "md",
  SM: "sm",
} as const;

export type Scale = typeof scales[keyof typeof scales];
export type Variant = typeof variants[keyof typeof variants];

export interface TagProps extends SpaceProps, TypographyProps {
  variant?: Variant;
  scale?: Scale;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  outline?: boolean;
  textTransform?: "uppercase" | "lowercase" | "capitalize";
}
