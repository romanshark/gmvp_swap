import styled from "styled-components";
import { m as Motion } from "framer-motion";

export const Arrow = styled.div`
  &,
  &::before {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    z-index: -1;
  }

  &::before {
    content: "";
    transform: rotate(45deg);
    background: ${({ theme }) => theme.tooltip.background};
  }
`;

export const StyledTooltip = styled(Motion.div)`
  padding: 12px;
  font-size: 14px;
  line-height: 130%;
  border-radius: 8px;
  border: 2px solid #fff; 
  max-width: 350px;
  z-index: 101;
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
  color: ${({ theme }) => theme.colors.text};
  box-shadow:  0 0 12px #111; 
 
  &[data-popper-placement^="top"] > ${Arrow} {
    bottom: -4px;
  }

  &[data-popper-placement^="bottom"] > ${Arrow} {
    top: -4px;
  }

  &[data-popper-placement^="left"] > ${Arrow} {
    right: -4px;
  }

  &[data-popper-placement^="right"] > ${Arrow} {
    left: -4px;
  }
`;
