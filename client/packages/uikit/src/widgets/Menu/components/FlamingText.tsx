import styled, { keyframes } from "styled-components";


const flameAnimation = keyframes`
  0% {
    text-shadow: 0 0 12px #ffffff, 2px 0px 8px #68B9FF, -4px 0px 10px #6faeff,
      4px 0px 12px #3d8eff, -4px 0px 14px #0164fd, 0 0px 16px #0154FD, 4px 0px 24px #013a9f;
  }
  100% {
    text-shadow: 0 0 12px #ffffff, 2px 0px 8px #ffffff, -4px 0px 10px #68B9FF,
      4px 0px 14px #6faeff, -4px 0px 12px #3d8eff, 0 0px 18px #0164fd, 4px 0px 24px #0154FD;
  }
`;


export const FlamingText = styled.span`
  animation: ${flameAnimation} 2s ease-in-out infinite alternate;
`;

// #0154FD #ccc #fff