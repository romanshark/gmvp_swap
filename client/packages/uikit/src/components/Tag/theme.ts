import { scales, variants } from "./types";
import { darkColors } from "../../theme";

export const scaleVariants = {
  [scales.MD]: {
    height: "28px",
    padding: "0 8px",
    fontSize: "14px",
  },
  [scales.SM]: {
    height: "24px",
    padding: "0 4px",
    fontSize: "12px",
  },
};

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: "primary",
  },
  [variants.NOHOMO]: {
    backgroundColor: "transparent",
    background: `${darkColors.gradients.basedsexgray}`,
    boxShadow: "0 4px 12px #0154FD, 0 4px 14px #68B9FF", 
    border: "2px solid", 
    borderColor: "#0154fd", 

    borderRadius: "8px", 
  },
  [variants.GREEN]: {
    backgroundColor: "transparent",
    background: `${darkColors.gradients.basedsexgray}`,
    boxShadow: "0 4px 12px #00FF00", 
    border: "2px solid", 
    borderColor: "#00FF00", 

    borderRadius: "8px", 
  },
  [variants.RED]: {
    backgroundColor: "transparent",
    background: `${darkColors.gradients.basedsexgray}`,
    boxShadow: "0 2px 6px #ff0000", 
    border: "2px solid", 
    borderColor: "#ff0000", 

    borderRadius: "8px", 
  },
  [variants.GOLD]: {
    backgroundColor: "transparent",
    background: `${darkColors.gradients.basedsexgray}`,
    boxShadow: "0 2px 8px #FFD700", 
    border: "2px solid", 
    borderColor: "#FFD700", 

    borderRadius: "8px", 
  },
  [variants.TRANS]: {
    backgroundColor: "transparent",
    boxShadow: "0 4px 12px #68B9FF, 0 4px 4px #fff, 4px 0px 12px #0154FD, -4px 0px 12px #68B9FF", 

    borderRadius: "12px", 
  },
  [variants.SECONDARY]: {
    backgroundColor: "background",
  },
  [variants.SUCCESS]: {
    backgroundColor: "success",
  },
  [variants.TEXTDISABLED]: {
    backgroundColor: "textDisabled",
  },
  [variants.TEXTSUBTLE]: {
    backgroundColor: "textSubtle",
  },
  [variants.BINANCE]: {
    backgroundColor: "binance",
  },
  [variants.FAILURE]: {
    backgroundColor: "failure",
  },
  [variants.WARNING]: {
    backgroundColor: "warning",
  },
};
