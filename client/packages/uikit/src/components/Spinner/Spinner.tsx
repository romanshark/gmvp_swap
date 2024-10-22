import React from "react";
import styled, { keyframes } from "styled-components";
import PanIcon from "./PanIcon";
import PancakeIcon from "./PancakeIcon";
import { SpinnerProps } from "./types";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const float = keyframes`
	0% {
		transform: translatey(0px);
	}
	50% {
		transform: translatey(10px);
	}
	100% {
		transform: translatey(0px);
	}
`;

const Container = styled.div`
  position: relative;
  background-color: #fff; 
  border-radius: 120px; 
  box-shadow: 0 4px 6px #fff, 8px 0px 8px #0154FD, -8px 0px 8px #68B9FF; 


`;

const RotatingPancakeIcon = styled(PancakeIcon)`
  position: absolute;
  top: 0;
  left: 0;
  animation: ${rotate} 2s linear infinite;
  transform: translate3d(0, 0, 0);
`;

const RotatingImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  animation: ${rotate} 2s linear infinite;
  transform: translate3d(0, 0, 0);
`;

const FloatingImage = styled.img`
  animation: ${float} 6s ease-in-out infinite;
  transform: translate3d(0, 0, 0);
`;

const FloatingPanIcon = styled(PanIcon)`
  animation: ${float} 6s ease-in-out infinite;
  transform: translate3d(0, 0, 0);
`;

const Spinner: React.FC<SpinnerProps> = ({ size = 90 }) => {
  return (
    <Container>
      {/* <RotatingPancakeIcon width={`${size * 0.5}px`} /> */}
      {/* <RotatingImage src="/images/ayush.png" alt="Ayush" width="50px" /> */}
      <FloatingImage src="/images/newlogo.png" alt="bswap" width={`${size}px`} />
      <FloatingImage src="/images/bsx.png" alt="bswap" width={`${size}px`} />


      {/* <FloatingPanIcon width={`${size}px`} /> */}
    </Container>
  );
};

export default Spinner;
