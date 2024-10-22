import throttle from "lodash/throttle";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button } from "../../components/Button";
import BottomNav from "../../components/BottomNav";
import { Box } from "../../components/Box";
import Flex from "../../components/Box/Flex";
import { SubMenuItems } from "../../components/SubMenuItems";
import { BsCoin } from "react-icons/bs";
import { useMatchBreakpoints } from "../../hooks";
import UserMenu from "./components/UserMenu";
import { MENU_HEIGHT, MOBILE_MENU_HEIGHT, TOP_BANNER_HEIGHT, TOP_BANNER_HEIGHT_MOBILE } from "./config";
import { NavProps } from "./types";
import { MdGamepad } from "react-icons/md";
import { MenuContext } from "./context";
import { Text } from "../../components/Text";
import { Link } from "../../components/Link";
import TypeIt from "typeit-react";
import { Image } from "../../components/Image";
import { FlamingText } from "./components/FlamingText";
import { PiSwapBold } from "react-icons/pi";
import { RiPlantFill } from "react-icons/ri";
import { GiWaterSplash } from "react-icons/gi";
import { FaSpaceShuttle } from "react-icons/fa";
import NavbarIcon from "./components/Icon";
import { BsFillDropletFill } from "react-icons/bs"
import { GiBurstBlob } from "react-icons/gi";

type DropdownTextProps = {
  marginRight?: string;
};

const DropdownText = styled.div<DropdownTextProps>`
  font-size: 1.1rem;
  color: #fff;
  text-transform: uppercase;
  font-weight: 400;
  margin-right: ${(props) => props.marginRight || "0px"};
`;

const DropdownMenu = styled.div`
  display: none;
  border: 3px solid #fff; 
  position: absolute;
  background-color: rgba(0, 0, 0, 0.7); 
  backdrop-filter: blur(18px); 
  border-radius: 12px;
  min-width: 280px;
  padding: 18px 12px;
  z-index: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center; 
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${DropdownMenu} {
    display: block;
  }
  a {
    text-transform: none !important;
  }
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 70px;
  background: ${({ theme }) => theme.colors.gradients.pagebg};
  border-bottom: 4px solid ${({ theme }) => theme.colors.cardBorder};
  transform: translate3d(0, 0, 0);
  padding-left: 16px;
  padding-right: 16px;
`;

const StyledNavInner = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: auto;
  width: 100%;
 
`;

const FixedContainer = styled.div<{ showMenu: boolean; height: number }>`
  position: fixed;
  top: ${({ showMenu, height }) => (showMenu ? 0 : `-${height}px`)};
  left: 0;
  transition: top 0.2s;
  height: 70px;
  width: 100%;
  z-index: 20;
`;

const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
`;

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  max-width: 100%;
`;

const Menu: React.FC<NavProps> = ({
  linkComponent = "a",
  banner,
  rightSide,
  isDark,
  toggleTheme,
  currentLang,
  setLang,
  cakePriceUsd,
  links,
  subLinks,
  footerLinks,
  activeItem,
  activeSubItem,
  langs,
  buyCakeLabel,
  children,
}) => {
  const { isMobile, isMd, isTablet } = useMatchBreakpoints();
  const [showMenu, setShowMenu] = useState(true);
  const refPrevOffset = useRef(typeof window === "undefined" ? 0 : window.pageYOffset);
  const topBannerHeight = isMobile || isTablet ? TOP_BANNER_HEIGHT_MOBILE : TOP_BANNER_HEIGHT;
  const totalTopMenuHeight = banner ? MENU_HEIGHT + topBannerHeight : MENU_HEIGHT;
  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset;
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight;
      const isTopOfPage = currentOffset === 0;
      // Always show the menu when user reach the top
      if (isTopOfPage) {
        setShowMenu(true);
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current || currentOffset <= totalTopMenuHeight) {
          // Has scroll up
          setShowMenu(true);
        } else {
          // Has scroll down
          setShowMenu(false);
        }
      }
      refPrevOffset.current = currentOffset;
    };
    const throttledHandleScroll = throttle(handleScroll, 200);

    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [totalTopMenuHeight]);

  return (
  <MenuContext.Provider value={{ linkComponent }}>
    <FixedContainer showMenu={showMenu} height={totalTopMenuHeight}>
      <StyledNav>
        <StyledNavInner>
          <a href="/" style={{ marginLeft: "1rem" }}>
            <Flex alignItems="center" justifyContent="flex-start" flexDirection="row">
              <img
                style={{
                  boxShadow: "0 8px 8px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF",
                  borderRadius: "50%",
                }}
                width={isMobile || isTablet ? 0 : 40}
                height={isMobile || isTablet ? 0 : 40}
                src="/images/newlogo.png"
                alt="logo"
              />

              <Text
                marginLeft={["0rem", null, null, "0.5rem"]}
                marginRight={["0rem", null, null, "0.7rem"]}
                fontSize="1.8rem"
              >
                BaseSwap
              </Text>
              <img
                style={{
                  boxShadow: "0 8px 8px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF",
                  borderRadius: "50%",
                }}
                src="/images/tokens/0xd5046B976188EB40f6DE40fB527F89c05b323385.png"
                width={isMobile || isTablet ? 0 : 40}
                height={isMobile || isTablet ? 0 : 40}
                alt="logo"
              />
            </Flex>
          </a>
          {!isMobile && !isTablet && (
            <Flex
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="flex-end"
              
            >
              <DropdownContainer>
                <NavbarIcon icon={PiSwapBold} label="TRADE" href="/swap" />
                <DropdownMenu>
                  <Link href="/swap" marginBottom="1.2rem">
                    <DropdownText>SWAP</DropdownText>
                  </Link>
                  <Link href="/basicswap" marginBottom="1.2rem">
                    <DropdownText>BASIC SWAP</DropdownText>
                  </Link>
                  <Link href="http://perpetuals.baseswap.fi">
                    <DropdownText>PERPETUALS</DropdownText>
                  </Link>
                </DropdownMenu>
              </DropdownContainer>

              <DropdownContainer>
                <NavbarIcon icon={BsFillDropletFill} label="LIQUIDITY" href="/liquidity" />
                <DropdownMenu>
                  <Link href="/liquidity" marginBottom="1.2rem">
                    <DropdownText>STANDARD</DropdownText>
                  </Link>
                  <Link href="/positions" >
                    <DropdownText>CONCENTRATED</DropdownText>
                  </Link>
                </DropdownMenu>
              </DropdownContainer>

              <DropdownContainer>
                <NavbarIcon icon={RiPlantFill} label="FARM" href="/farm" />
                <DropdownMenu>
                  <Link href="/farm" marginBottom="1.2rem">
                    <DropdownText>STANDARD FARMS</DropdownText>
                  </Link>
                  <Link href="/farmV3" >
                    <DropdownText>CONCENTRATED FARMS</DropdownText>
                  </Link>
                </DropdownMenu>
              </DropdownContainer>



              <NavbarIcon icon={BsCoin} label="Earn" href="/pools" />

              <DropdownContainer>
                <NavbarIcon icon={MdGamepad} label="MORE!" href="/" />
                <DropdownMenu>
                  <Link href="/xbsx" marginBottom="1.2rem">
                    <DropdownText marginRight="2rem">xBSX</DropdownText>
                  </Link>
                  <Link href="/finishedfarms" marginBottom="1.2rem">
                    <DropdownText marginRight="2rem">Finished Farms </DropdownText>
                  </Link>
                  <Link href="/bridge" marginBottom="1.2rem">
                    <DropdownText marginRight="2rem">Bridge </DropdownText>
                  </Link>
                  <Link href="/locker" marginBottom="1.2rem">
                    <DropdownText marginRight="2rem">Token Locker </DropdownText>
                  </Link>
                  <Link href="https://marketplace.baseswap.fi">
                    <DropdownText marginRight="2rem">NFT</DropdownText>
                  </Link>
                </DropdownMenu>
              </DropdownContainer>
            </Flex>
          )}
        <Flex alignItems="center" justifyContent="flex-end" height="100%" >
            {rightSide}
        </Flex>
        </StyledNavInner>
        </StyledNav>
    </FixedContainer>
      {subLinks && (
        <Flex justifyContent="space-around" mt={`${totalTopMenuHeight + 1}px`}>
     
        </Flex>
      )}
      <BodyWrapper mt={!subLinks ? `${totalTopMenuHeight + 1}px` : "0"}>
        <Inner isPushed={false} showMenu={showMenu}>
          {children}
          {/* <Footer
        items={footerLinks}
        isDark={isDark}
        toggleTheme={toggleTheme}
        langs={langs}
        setLang={setLang}
        currentLang={currentLang}
        cakePriceUsd={cakePriceUsd}
        buyCakeLabel={buyCakeLabel}
        mb={[`${MOBILE_MENU_HEIGHT}px`, null, "0px"]}
      /> */}
        </Inner>
      </BodyWrapper>
      {(isMobile || isTablet) && <BottomNav items={links} activeItem={activeItem} activeSubItem={activeSubItem} />}

  </MenuContext.Provider>
  );
};

export default Menu;
