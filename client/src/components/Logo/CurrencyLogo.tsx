import { Currency, ETHER, Token } from '@magikswap/sdk'
import { useMemo } from 'react'
import styled from 'styled-components'
import { WrappedTokenInfo } from 'state/types'
import useHttpLocations from '../../hooks/useHttpLocations'
import getTokenLogoURL from '../../utils/getTokenLogoURL'
import Logo from './Logo'

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  const srcs: string[] = useMemo(() => {
    if (currency === ETHER)
      return ['https://pancakeswap.finance/images/tokens/0x2170Ed0880ac9A755fd29B2688956BD959F933F8.png']
    if (currency?.symbol === 'ETH')
      return [`/images/tokens/${'0x4200000000000000000000000000000000000006'.toLowerCase()}.png`]
    if (currency?.symbol === 'BSX')
      return [`/images/tokens/${'0xd5046B976188EB40f6DE40fB527F89c05b323385'.toLowerCase()}.png`]
    if (currency?.symbol === 'xBSX')
      return [`/images/tokens/${'0xE4750593d1fC8E74b31549212899A72162f315Fa'.toLowerCase()}.png`]
    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, `/images/tokens/${currency.address.toLowerCase()}.png`]
      }

      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
