import React from "react";
import styled from "styled-components";
import Flex from "../../components/Box/Flex";
import { MotionBox } from "../../components/Box";
import { ArrowBackIcon, CloseIcon } from "../../components/Svg";
import { IconButton } from "../../components/Button";
import { ModalProps } from "./types";

export const mobileFooterHeight = 73;

export const ModalHeader = styled.div<{ background?: string }>`
  align-items: center;
  background: ${({ theme }) => theme.colors.gradients.basedsexgray};
  border-bottom: 2px solid ${({ theme }) => theme.colors.background};
  display: flex;
  padding: 4px; 

  
  }
`;

export const ModalTitle = styled(Flex)`
  align-items: flex-end;
  justify-content: flex-start;
  margin-left: 4px; 
  flex: 1;

`;

export const ModalBody = styled(Flex)`
  flex-direction: column;
  overflow-y: auto;
  max-height: calc(90vh - ${mobileFooterHeight}px);
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    max-height: 90vh;
  }
`;

export const ModalCloseButton: React.FC<{ onDismiss: ModalProps["onDismiss"] }> = ({ onDismiss }) => {
  return (
    <IconButton variant="text" onClick={onDismiss} aria-label="Close the dialog">
      <CloseIcon color="#fff" width="25px" />
    </IconButton>
  );
};

export const ModalBackButton: React.FC<{ onBack: ModalProps["onBack"] }> = ({ onBack }) => {
  return (
    <IconButton variant="text" onClick={onBack} area-label="go back" mr="8px">
      <ArrowBackIcon color="text" />
    </IconButton>
  );
};

export const ModalContainer = styled(MotionBox)<{ minWidth: string }>`
  overflow: hidden;
  background: ${({ theme }) => theme.modal.background};
  box-shadow: 0 0 24px #fff, 0 -24px 96px #333, 0 -48px 96px #0154FD, 48px 0px 96px #0154FD, -48px 0px 96px #0154FD, 0px 48px 96px #333; 
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.background};
  width: 100%;
  max-height: calc(var(--vh, 1vh) * 100);
  z-index: ${({ theme }) => theme.zIndices.modal};
  position: absolute;
  min-width: 98vw; 
  bottom: 0;
  max-width: none !important;

  ${({ theme }) => theme.mediaQueries.md} {
    width: auto;
    position: auto;
    bottom: auto;
    max-width: 100%;
    max-height: 100vh;
    min-width: 450px; 
  }
`;
