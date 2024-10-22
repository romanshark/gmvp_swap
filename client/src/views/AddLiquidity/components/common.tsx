import React from 'react'
import { Currency, Fraction, Percent, TokenAmount } from '@magikswap/sdk'
import { Text, useTooltip, TooltipText, Box, Flex, Svg, SvgProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow, RowBetween, SecondRow } from 'components/Layout/Row'
import { Field } from 'state/burn/actions'
import { DoubleCurrencyLogo, CurrencyLogo } from 'components/Logo'
import { GreyCard } from 'components/Card'
import { getLPSymbol } from 'utils/getLpSymbol'

const Dot = styled(Box)<{ scale?: 'sm' | 'md' }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
`

const CircleSvg = ({ percent = 1, ...props }: SvgProps & { percent?: number }) => (
  <Svg width="60px" height="60px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g filter="url(#filter0_i_1147_113741)">
      <circle r="10" cx="10" cy="10" fill="#fff" />
      <circle
        r="5"
        cx="10"
        cy="10"
        fill="transparent"
        stroke="#0154FD"
        strokeWidth="10"
        strokeDasharray={`calc(${percent * 100}px * 31.4 / 100) 31.4`}
        transform="rotate(-90) translate(-20)"
      />
    </g>
    <defs>
      <filter
        id="filter0_i_1147_113741"
        x={0}
        y={0}
        width={60}
        height={60}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy={-2} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_1147_113741" />
      </filter>
    </defs>
  </Svg>
)

const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Text fontSize="12px" textTransform="uppercase" bold color="secondary">
      {children}
    </Text>
  )
}

export const PairDistribution = ({
  title,
  percent,
  currencyA,
  currencyB,
  currencyAValue,
  currencyBValue,
  tooltipTargetRef,
}: {
  title: React.ReactNode
  percent?: number
  currencyA?: Currency
  currencyB?: Currency
  currencyAValue?: string
  currencyBValue?: string
  tooltipTargetRef?: any
}) => {
  return (
    <AutoColumn gap="8px">
      <Subtitle>{title}</Subtitle>
      <Flex>
        {typeof percent !== 'undefined' && (
          <div ref={tooltipTargetRef}>
            <CircleSvg percent={percent} mr="34px" />
          </div>
        )}
        <AutoColumn style={{ width: '100%' }}>
          {currencyA && (
            <SecondRow>
              <AutoRow gap="3px">
                <Dot bg="primary" />
                <CurrencyLogo currency={currencyA} />
                <Text fontSize="14px" bold color="secondary">
                    {currencyA?.symbol}
                </Text>
              </AutoRow>
              <Text fontSize="14px" bold color="secondary">
                {currencyAValue}
              </Text>
            </SecondRow>
          )}

          {currencyB && (
            <SecondRow>
              <AutoRow gap="3px">
                <Dot bg="text" />
                <CurrencyLogo currency={currencyB} />
                <Text fontSize="14px" bold color="secondary">
                    {currencyB?.symbol}
                </Text>
              </AutoRow>
              <Text fontSize="14px" bold color="secondary">
                {currencyBValue}
              </Text>
            </SecondRow>
          )}
        </AutoColumn>
      </Flex>
    </AutoColumn>
  )
}

interface AddLiquidityModalHeaderProps {
  currencies: { [field in Field]?: Currency }
  poolTokenPercentage?: Percent
  liquidityMinted: TokenAmount
  price: Fraction
  allowedSlippage: number
  children: React.ReactNode
  noLiquidity?: boolean
}

export const AddLiquidityModalHeader = ({
  currencies,
  poolTokenPercentage,
  liquidityMinted,
  price,
  allowedSlippage,
  noLiquidity,
  children,
}: AddLiquidityModalHeaderProps) => {
  const { t } = useTranslation()
  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    t('Output is estimated. If the price changes by more than %slippage%% your transaction will revert.', {
      slippage: allowedSlippage / 100,
    }),
    { placement: 'auto' },
  )

  return (
    <AutoColumn gap="12px">
      <AutoColumn gap="0px">
        <Subtitle>{t('You will receive')}</Subtitle>
        <GreyCard>
          <RowBetween>
            <AutoRow gap="4px">
              <DoubleCurrencyLogo
                currency0={currencies[Field.CURRENCY_A]}
                currency1={currencies[Field.CURRENCY_B]}
                size={24}
              />
          <Text fontSize="14px" bold color="secondary">
                {currencies[Field.CURRENCY_A]?.symbol &&
                  currencies[Field.CURRENCY_B]?.symbol &&
                  getLPSymbol(currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol)}
              </Text>
            </AutoRow>
            <Text fontSize="14px" bold color="secondary">
              {liquidityMinted?.toSignificant(4)}
            </Text>
          </RowBetween>
        </GreyCard>
      </AutoColumn>
      <RowBetween>
        <Subtitle>
          {t('Your pool share')}
        </Subtitle>
        <Text fontSize="14px" bold color="secondary">
          {noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%
        </Text>
      </RowBetween>
      <AutoColumn gap="4px">{children}</AutoColumn>
      <AutoColumn>
        <RowBetween>
          <Subtitle>{t('Rates')}</Subtitle>
          <Text fontSize="14px" bold color="secondary">
            {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
              currencies[Field.CURRENCY_B]?.symbol
            }`}
          </Text>
        </RowBetween>
        <RowBetween style={{ justifyContent: 'flex-end' }}>
        <Text fontSize="14px" bold color="secondary">
            {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
              currencies[Field.CURRENCY_A]?.symbol
            }`}
          </Text>
        </RowBetween>
      </AutoColumn>
      {!noLiquidity && (
        <RowBetween>
          <Subtitle>{t('Slippage Tolerance')}</Subtitle>
          <TooltipText fontSize="14px" bold color="secondary"
          ref={targetRef}>
              {allowedSlippage / 100}%
          </TooltipText>
          {tooltipVisible && tooltip}
        </RowBetween>
      )}
    </AutoColumn>
  )
}
