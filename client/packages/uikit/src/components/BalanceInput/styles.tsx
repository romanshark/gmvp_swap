import styled from "styled-components";
import Box from "../Box/Box";
import Input from "../Input/Input";
import Text from "../Text/Text";
import IconButton from "../Button/IconButton";
import { BalanceInputProps } from "./types";

export const SwitchUnitsButton = styled(IconButton)`
  width: 16px;
`;

export const UnitContainer = styled(Text)`
  margin-left: 4px;
  text-align: right;
  color: ${({ theme }) => theme.colors.textSubtle};
  white-space: nowrap;
`;

export const StyledBalanceInput = styled(Box)<{ isWarning: BalanceInputProps["isWarning"] }>`
  background-color: ${({ theme }) => theme.colors.gradients.basedsex};
  border: 2px solid ${({ theme }) => theme.colors.text};
  border-radius: 12px;
  padding: 8px 16px;
`;

export const StyledInput = styled(Input)<{ textAlign?: string }>`
  background: transparent;
  font-size: 16px; 
  border-radius: 0;
  box-shadow: none;
  padding-left: 0;
  padding-right: 0;
  text-align: ${({ textAlign = "right" }) => textAlign};
  border: none;
  color: ${({ theme }) => theme.colors.text};

  ::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:focus:not(:disabled) {
    box-shadow: none;
  }
`;
