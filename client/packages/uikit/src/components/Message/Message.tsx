import React, { useContext } from "react";
import styled from "styled-components";
import { variant as systemVariant, space } from "styled-system";
import { WarningIcon, ErrorIcon, CheckmarkCircleFillIcon } from "../Svg";
import { Text, TextProps } from "../Text";
import { Box } from "../Box";
import { MessageProps } from "./types";
import variants from "./theme";

const MessageContext = React.createContext<MessageProps>({ variant: "success" });

const Icons = {
  warning: WarningIcon,
  danger: ErrorIcon,
  success: CheckmarkCircleFillIcon,
};

const MessageContainer = styled.div<MessageProps>`
  background-color: #000; 
  padding: 4px;
  border-radius: 8px;
  border: solid 1px;

  ${space}
  ${systemVariant({
    variants,
  })}
`;

const Flex = styled.div`
  display: flex;
`;

const colors = {
  // these color names should be place in the theme once the palette is finalized
  warning: "#0154FD",
  success: "#129E7D",
  danger: "failure",
};

export const MessageText: React.FC<TextProps> = ({ children, ...props }) => {
  const ctx = useContext(MessageContext);
  return (
    <Text fontSize="12px" color={colors[ctx?.variant]} {...props}>
      {children}
    </Text>
  );
};

const Message: React.FC<MessageProps> = ({ children, variant, icon, action, actionInline, ...props }) => {
  const Icon = Icons[variant];
  return (
    <MessageContext.Provider value={{ variant }}>
      <MessageContainer variant={variant} {...props}>
        <Flex>
          <Box mr="12px">{icon ?? <Icon color={variants[variant].borderColor} width="24px" />}</Box>
          {children}
          {actionInline && action}
        </Flex>
        {!actionInline && action}
      </MessageContainer>
    </MessageContext.Provider>
  );
};

export default Message;
