import styled from 'styled-components'
import { ArrowDropDownIcon, Box, Button, Text, useModal, Flex, BoxProps, useMatchBreakpoints } from '@pancakeswap/uikit'
import CurrencySearchModal, { CurrencySearchModalProps } from 'components/SearchModal/CurrencySearchModal'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import { formatNumber } from 'utils/formatBalance'
import { useCurrencyBalance } from 'state/wallet/hooks'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { CurrencyLogo } from '../Logo'
import { RowBetween, AutoRow } from '../Layout/Row'

const DropDownHeader = styled.div`
  width: 100%;
  height: 0px;
  display: flex;
  color: #fff;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  background-color: transparent;
  border-radius: 8px;
  min-width: 168px;

  &:hover {
    color: ${({ theme }) => theme.colors.background};
  }
`

const DropDownContainer = styled(Button)`
  cursor: pointer;
  width: 100%;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  background: ${({ theme }) => theme.colors.gradients.basedsexgray};
  justify-content: flex-start;
  border-radius: 12px;
  height: 50px;
  padding: 4px;
  padding-left: 8px;
  min-width: 106px;
  max-width: 140px;
  user-select: none;
  border: 2px solid #0154fd;
  z-index: 20;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
    max-width: 340px;
    height: 60px;
  }
  .down-icon {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    ${({ theme }) => theme.mediaQueries.sm} {
      right: 8px;
    }
  }
`

interface CurrencySelectProps extends CurrencySearchModalProps, BoxProps {
  hideBalance?: boolean
}

export const CurrencySelect = ({
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases,
  hideBalance,
  ...props
}: CurrencySelectProps) => {
  const { account } = useActiveWeb3React()
  const { isMobile } = useMatchBreakpoints()

  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    !hideBalance && selectedCurrency ? selectedCurrency : undefined,
  )

  const { t } = useTranslation()

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={selectedCurrency}
      otherSelectedCurrency={otherSelectedCurrency}
      showCommonBases={showCommonBases}
    />,
  )

  const price = useBUSDPrice(selectedCurrencyBalance && selectedCurrency ? selectedCurrency : undefined)
  const quoted = selectedCurrencyBalance && price?.quote(selectedCurrencyBalance)

  return (
    <Box width="100%" {...props}>
      <DropDownContainer p={0} onClick={onPresentCurrencyModal}>
        <Text id="pair" color={!selectedCurrency ? 'text' : undefined}>
          {!selectedCurrency ? (
            <>{t('Select')}</>
          ) : (
            <Flex flexDirection="row" width="100%" alignItems="center" justifyContent="flex-start">
              <CurrencyLogo currency={selectedCurrency} size={isMobile ? '32px' : '54px'} />
              <Text
                marginLeft={isMobile ? '2px' : '8px'}
                fontSize={isMobile ? '1rem' : '1.4rem'}
                id="pair"
                color="text"
                fontWeight="400"
              >
                {selectedCurrency && selectedCurrency.symbol && selectedCurrency.symbol.length > 20
                  ? `${selectedCurrency.symbol.slice(0, 4)}...${selectedCurrency.symbol.slice(
                      selectedCurrency.symbol.length - 5,
                      selectedCurrency.symbol.length,
                    )}`
                  : selectedCurrency?.symbol}
              </Text>
            </Flex>
          )}
        </Text>

        <ArrowDropDownIcon width={isMobile ? '20px' : '32px'} color="text" className="down-icon" />
      </DropDownContainer>
      {account && !!selectedCurrency && !hideBalance && (
        <Box>
          <AutoRow justify="space-between" gap="2px">
            <Text color="textSubtle" fontSize="12px">
              {t('Balance')}:
            </Text>
            <Text fontSize="12px">{selectedCurrencyBalance?.toSignificant(6) ?? t('Loading')}</Text>
          </AutoRow>
          <RowBetween>
            <div />
            {Number.isFinite(+quoted?.toExact()) && (
              <Text fontSize="12px" color="textSubtle">
                ~${formatNumber(+quoted.toExact())}
              </Text>
            )}
          </RowBetween>
        </Box>
      )}
    </Box>
  )
}
