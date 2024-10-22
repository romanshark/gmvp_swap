import React, { useState } from "react";
import styled from "styled-components";
import { Text } from "../../../components/Text";
import { Flex } from "../../../components/Box";
import { Link } from "../../../components/Link";
import { IconType } from "react-icons";

type NavbarIconProps = {
  icon: IconType;
  label: string;
  href: string;
};

const StyledText = styled(Text)`
  font-size: 18px;
  text-align: center;
  color: #0154fd;
`;

const NavbarIconWrapper = styled(Flex)`
  justify-content: center;
  margin-right: 8px;
  align-items: center;
  flex-direction: column;
  &:hover {
    ${StyledText} {
      color: #fff;
    }
  }
`;

const NavbarIcon: React.FC<NavbarIconProps> = ({ icon: Icon, label, href }) => {
  const [iconColor, setIconColor] = useState("#fff");
  return (
    <Link href={href} marginRight="1.8rem">
      <NavbarIconWrapper
        onMouseEnter={() => {
          setIconColor("#0154FD");
        }}
        onMouseLeave={() => {
          setIconColor("#fff");
        }}
      >
        <Icon size="24px" color={iconColor} />
        <StyledText>{label}</StyledText>
      </NavbarIconWrapper>
    </Link>
  );
};

export default NavbarIcon;
