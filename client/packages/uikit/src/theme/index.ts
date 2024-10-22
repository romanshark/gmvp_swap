import styled, { css, keyframes } from "styled-components";
import { AlertTheme } from "../components/Alert/types";
import { CardTheme } from "../components/Card/types";
import { PancakeToggleTheme } from "../components/PancakeToggle/types";
import { RadioTheme } from "../components/Radio/types";
import { ToggleTheme } from "../components/Toggle/theme";
import { TooltipTheme } from "../components/Tooltip/types";
import { NavThemeType } from "../widgets/Menu/theme";
import { ModalTheme } from "../widgets/Modal/types";
import { Breakpoints, Colors, MediaQueries, Radii, Shadows, Spacing, ZIndices } from "./types";

export interface PancakeTheme {
  siteWidth: number;
  isDark: boolean;
  alert: AlertTheme;
  colors: Colors;
  card: CardTheme;
  nav: NavThemeType;
  modal: ModalTheme;
  pancakeToggle: PancakeToggleTheme;
  radio: RadioTheme;
  toggle: ToggleTheme;
  tooltip: TooltipTheme;
  breakpoints: Breakpoints;
  mediaQueries: MediaQueries;
  spacing: Spacing;
  shadows: Shadows;
  radii: Radii;
  zIndices: ZIndices;
}

export { darkColors, lightColors } from "./colors";
export { default as dark } from "./dark";
export { default as light } from "./dark";
export * from "./types";
export * from "./zIndex";
export * from "./styles";

const gapValues = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "24px",
  xl: "32px",
};
export type Gap = keyof typeof gapValues;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerCss = css`
  animation: 2s ${rotate} linear infinite;
`;
const Spinner = styled.img`
  ${SpinnerCss}
  width: 16px;
  height: 16px;
`;
export const SpinnerSVG = styled.svg`
  ${SpinnerCss}
`;
