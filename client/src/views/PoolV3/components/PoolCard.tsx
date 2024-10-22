import { Flex, Text, Heading, useTooltip, HelpIcon } from '@pancakeswap/uikit'
import { TokenPairImage } from 'components/TokenImage'
import {
    PoolCardAction,
    StyledPoolCard,
    StyledPoolCardInnerContainer,
} from 'views/xFarms/components/NFTPoolCard/Styled'
import 'animate.css'
import NewPositionButton from 'components/NewPositionButton'

export default function PoolCard({ p, table }) {

    const { targetRef, tooltip, tooltipVisible } = useTooltip(
        `${p.aprs[0].label}:  ${p.aprs[0].value} \n${p.aprs[1].label}:  ${p.aprs[1].value} \n${p.aprs[2].label}:  ${p.aprs[2].value}`,
        { placement: 'top-end', tooltipOffset: [20, 10] },
    )


    return (
        <StyledPoolCard key={p.pool}>
            <StyledPoolCardInnerContainer>
                <Flex justifyContent="space-between" alignItems="center" mb="12px">
                    <TokenPairImage
                        variant="inverted"
                        primaryToken={p.token}
                        secondaryToken={p.quoteToken}
                        width={64}
                        height={64}
                        marginRight={12}
                    />
                    <Flex flexDirection="column" alignItems="flex-end">
                        <Heading mb="4px">
                            {p.token.symbol}-{p.quoteToken.symbol}
                        </Heading>
                    </Flex>
                </Flex>
                <PoolCardAction table={table}>
                    <Flex flexDirection="row" justifyContent="space-between">
                        <Text color="textSubtle" textTransform="uppercase" fontWeight="600" fontSize="14px">
                            APR:
                        </Text>
                        <Text color="textSubtle" textTransform="uppercase" fontWeight="600" fontSize="14px">
                            {p.aprs[0].value}
                        </Text>
                    </Flex>
                    <Flex flexDirection="row" justifyContent="space-between" mb={12}>
                        <Text color="textSubtle" textTransform="uppercase" fontWeight="600" fontSize="14px">
                            TVL:
                        </Text>
                        <Flex flexDirection="row" alignItems="center">
                            <Text color="textSubtle" textTransform="uppercase" fontWeight="600" fontSize="14px">
                                {p.tvl}
                            </Text>
                            <span ref={targetRef}>
                                <HelpIcon width="16px" height="16px" color="textSubtle" marginLeft="4px" />
                            </span>
                            {tooltipVisible && tooltip}
                        </Flex>
                    </Flex>
                    <NewPositionButton
                        currencyIdA={p.token.address}
                        currencyIdB={p.quoteToken.address}
                        feeAmount={p.feeAmount}
                    />
                </PoolCardAction>
            </StyledPoolCardInnerContainer>
        </StyledPoolCard>
    )
}