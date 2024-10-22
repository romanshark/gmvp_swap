import React, { ReactNode, useCallback } from 'react'
import { Orders, TWAP as BaseTWAP } from '@orbs-network/twap-ui-baseswap'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useAllTokens } from 'hooks/Tokens'
import { useActiveHandle } from 'hooks/useEagerConnect.bmp'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { useModal, useWalletModal } from '@pancakeswap/uikit'
import { useSwapState } from 'state/swap/hooks'
import { Field } from 'state/swap/actions'
import useTranslation from '../../../../packages/localization/src/useTranslation'
import useAuth from 'hooks/useAuth'
import { Wrapper } from './styleds'
import { AppBody } from 'components/App'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from '../styles'

export const Container = ({ limit }: { limit?: boolean }) => {
  const { chainId, account, library } = useActiveWeb3React()
  const tokens = useAllTokens()
  const { t } = useTranslation()
  const { login } = useAuth()
  const handleActive = useActiveHandle()
  const { onPresentConnectModal } = useWalletModal(login, t)

  const handleClick = useCallback(() => {
    if (typeof __NEZHA_BRIDGE__ !== 'undefined') {
      handleActive()
    } else {
      onPresentConnectModal()
    }
  }, [handleActive, onPresentConnectModal])

  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  return (
    <BaseTWAP
      TokenSelectModal={CurrencySearchModal}
      useModal={useModal}
      connect={handleClick}
      connectedChainId={chainId}
      dappTokens={tokens}
      account={account}
      provider={library.provider}
      isDarkTheme={true}
      limit={limit}
      srcToken={inputCurrencyId}
      dstToken={outputCurrencyId}
    />
  )
}

export const TWAP = ({ isChartExpanded, limit }: { isChartExpanded: boolean; limit?: boolean }) => {
  const { account } = useActiveWeb3React()

  return (
    <>
      <SwapContainer isChartExpanded={isChartExpanded}>
        <Container limit={limit} />
      </SwapContainer>
      <SwapContainer hide={!account} isChartExpanded={isChartExpanded}>
        <Orders />
      </SwapContainer>
    </>
  )
}

const SwapContainer = ({
  children,
  isChartExpanded,
  hide,
}: {
  children: ReactNode
  isChartExpanded: boolean
  hide?: boolean
}) => {
  return (
    <StyledSwapContainer
      style={{ display: hide ? 'none' : 'block' }}
      className="animate__animated animate__fadeInLeft animate__fast"
      $isChartExpanded={isChartExpanded}
    >
      <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
        <AppBody>
          <Wrapper id="swap-page" style={{ minHeight: '412px' }}>
            {children}
          </Wrapper>
        </AppBody>
      </StyledInputCurrencyWrapper>
    </StyledSwapContainer>
  )
}
