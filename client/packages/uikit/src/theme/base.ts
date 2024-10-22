import { MediaQueries, Breakpoints, Spacing, Shadows, Radii, ZIndices } from "./types";

export const breakpointMap: { [key: string]: number } = {
  xs: 370,
  sm: 576,
  md: 852,
  lg: 968,
  xl: 1080,
  xxl: 1200,
};

const breakpoints: Breakpoints = Object.values(breakpointMap).map((breakpoint) => `${breakpoint}px`);

const mediaQueries: MediaQueries = {
  xs: `@media screen and (min-width: ${breakpointMap.xs}px)`,
  sm: `@media screen and (min-width: ${breakpointMap.sm}px)`,
  md: `@media screen and (min-width: ${breakpointMap.md}px)`,
  lg: `@media screen and (min-width: ${breakpointMap.lg}px)`,
  xl: `@media screen and (min-width: ${breakpointMap.xl}px)`,
  xxl: `@media screen and (min-width: ${breakpointMap.xxl}px)`,
  nav: `@media screen and (min-width: ${breakpointMap.lg}px)`,
};

export const shadows: Shadows = {
  level1: "0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05)",
  active: "0px 0px 0px 1px #0098A1, 0px 0px 4px 8px rgba(31, 199, 212, 0.4)",
  basicass: "0 8px 8px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF",  
  connect: "0 2px 4px #fff, 8px 0px 8px #0154FD, -7px 0px 7px #68B9FF",  
  connecthover: "0 4px 8px #68B9FF, 4px 0px 8px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF", 

  success: "0px 0px 0px 1px #31D0AA, 0px 0px 0px 4px rgba(49, 208, 170, 0.2)",
  warning: "0px 0px 0px 1px #ffd700, 0px 0px 0px 4px rgba(255, 215, 0, 0.5)",
  focus: "0px 0px 0px 1px #0154FE, 0px 0px 0px 4px rgba(255, 255, 255, 0.5)",
  inset: "inset 0px 2px 2px -1px rgba(255, 255, 255, 0.5)",
  tooltip: "0px 0px 2px rgba(0, 0, 0, 0.2), 0px 4px 12px -8px rgba(14, 14, 44, 0.1)",
};

const spacing: Spacing = [0, 4, 8, 16, 24, 32, 48, 64];

const radii: Radii = {
  small: "4px",
  default: "2px",
  card: "2px",
  circle: "50%",
};

const zIndices: ZIndices = {
  ribbon: 9,
  dropdown: 10,
  modal: 100,
};

export default {
  siteWidth: 1200,
  breakpoints,
  mediaQueries,
  spacing,
  shadows,
  radii,
  zIndices,
};
