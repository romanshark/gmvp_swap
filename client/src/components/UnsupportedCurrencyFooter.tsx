import { Currency, Token } from '@magikswap/sdk'
import { Button, Flex, Text, Modal, useModal, InjectedModalProps, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { AutoRow } from 'components/Layout/Row'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getBscScanLink } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { useUnsupportedTokens } from '../hooks/Tokens'

interface Props extends InjectedModalProps {
  currencies: (Currency | undefined)[]
}

const DetailsFooter = styled.div`
  padding: 8px 0;
  width: 100%;
  max-width: 420px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  text-align: center;
`

const UnsupportedModal: React.FC<Props> = ({ currencies, onDismiss }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const tokens =
    chainId && currencies
      ? currencies.map((currency) => {
          return wrappedCurrency(currency, chainId)
        })
      : []

  const unsupportedTokens: { [address: string]: Token } = useUnsupportedTokens()

  return (
    <Modal title={t('Unsupported Assets')} width="50%" maxWidth="420px" onDismiss={onDismiss}>
      <AutoColumn justify="center" gap="lg">
        {tokens.map((token) => {
          return (
            token &&
            unsupportedTokens &&
            Object.keys(unsupportedTokens).includes(token.address) && (
              <AutoColumn key={token.address?.concat('not-supported')} gap="10px">
                <AutoRow gap="5px" align="center">
                  <CurrencyLogo currency={token} size="24px" />
                  <Text>{token.symbol}</Text>
                </AutoRow>
                {chainId && (
                  <Link external small color="primaryDark" href={getBscScanLink(token.address, 'address', chainId)}>
                    {token.address}
                  </Link>
                )}
              </AutoColumn>
            )
          )
        })}
        <AutoColumn justify="center" gap="lg">
          <Flex width="90vw">
            <Text textAlign="center" letterSpacing="0px" fontSize="14px">
              Lets do this first: BaseSwap isn't responsible for what you do on BaseSwap.fi. That's the law of the land.
              Investors take their own risk, and they're responsible for their own outcomes. Period. Full stop. <br />{' '}
              <br />
              Now, with that said, we're trying our very best to keep you from getting scammed. We don't blacklist every
              token, we can't keep up with em all. Plus this is DeFi: the land of decentralization, and you take your
              own risks in this space. <br /> <br />
              So its kinda Home Alone when the Mom told Kevin: "if Uncle Frank said it's bad...then it must be really
              bad".
              <br /> <br /> Thank us later.
            </Text>
          </Flex>
        </AutoColumn>
      </AutoColumn>
    </Modal>
  )
}

export default function UnsupportedCurrencyFooter({
  currencies,
  show,
}: {
  currencies: (Currency | undefined)[]
  show: boolean
}) {
  const { t } = useTranslation()
  const [onPresentModal] = useModal(<UnsupportedModal currencies={currencies} />)

  return (
    show && (
      <DetailsFooter>
        <Button variant="text" onClick={onPresentModal}>
          {t('If you need more info, go on and click here')}
        </Button>
      </DetailsFooter>
    )
  )
}
