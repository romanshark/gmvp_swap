import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

export type CardFooterProps = SpaceProps;

const CardFooter = styled.div<CardFooterProps>`
  

  ${space}
  bottom-border-radius: 8px;
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};

  padding: 1rem;
`;

CardFooter.defaultProps = {
  p: "0px",
};

export default CardFooter;
