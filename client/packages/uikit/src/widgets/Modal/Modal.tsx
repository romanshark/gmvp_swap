import React, { useRef } from "react";
import { useTheme } from "styled-components";
import Heading from "../../components/Heading/Heading";
import getThemeValue from "../../util/getThemeValue";
import { ModalBody, ModalHeader, ModalTitle, ModalContainer, ModalCloseButton, ModalBackButton } from "./styles";
import { ModalProps } from "./types";
import { Text } from "@pancakeswap/uikit";
import { useMatchBreakpointsContext } from "../../contexts";

export const MODAL_SWIPE_TO_CLOSE_VELOCITY = 300;

const Modal: React.FC<ModalProps> = ({
  title,
  onDismiss,
  onBack,
  children,
  hideCloseButton = false,
  bodyPadding = "12px",
  headerBackground = "transparent",
  minWidth = "320px",
  ...props
}) => {
  const theme = useTheme();
  const { isMobile } = useMatchBreakpointsContext();
  const wrapperRef = useRef<HTMLDivElement>(null);
  return (
    // @ts-ignore
    <ModalContainer
      drag={isMobile ? "y" : false}
      dragConstraints={{ top: 0, bottom: 600 }}
      dragElastic={{ top: 0 }}
      dragSnapToOrigin
      onDragStart={() => {
        if (wrapperRef.current) wrapperRef.current.style.animation = "none";
      }}
      onDragEnd={(e, info) => {
        if (info.velocity.y > MODAL_SWIPE_TO_CLOSE_VELOCITY && onDismiss) onDismiss();
      }}
      ref={wrapperRef}
      minWidth={minWidth}
      {...props}
    >
      <ModalHeader background={getThemeValue(theme, `colors.${headerBackground}`, headerBackground)}>
        <ModalTitle>
          {onBack && <ModalBackButton onBack={onBack} />}
          <Text color="text" fontSize="2rem" fontWeight="400">
            {title}
          </Text>
        </ModalTitle>
        {!hideCloseButton && <ModalCloseButton onDismiss={onDismiss} />}
      </ModalHeader>
      <ModalBody p={bodyPadding}>{children}</ModalBody>
    </ModalContainer>
  );
};

export default Modal;
