import { Box, Text, UserMenu, UserMenuDivider, UserMenuItem } from '@pancakeswap/uikit'
import { baseChain, baseGoerli } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Image from 'next/image'
import { setupNetwork } from 'utils/wallet'

const chains = [baseChain]

export const NetworkSelect = () => {
  const { t } = useTranslation()
  return (
    <>
      <Box px="16px" py="8px">
        <Text>{t('Select a Network')}</Text>
      </Box>
      <UserMenuDivider />
      {chains.map((chain) => (
        <UserMenuItem key={chain.id} style={{ justifyContent: 'flex-start' }} onClick={() => setupNetwork(chain.id)}>
          <Image width={24} height={24} src="images/baselogolarge.png" unoptimized />
          <Text pl="12px">{chain.name}</Text>
        </UserMenuItem>
      ))}
    </>
  )
}

export const NetworkSwitcher = () => {
  const { chainId } = useActiveWeb3React()

  if (chainId === baseGoerli.id) {
    return (
      <UserMenu mr="8px" avatarSrc="images/baselogolarge.png" account={baseGoerli.name} ellipsis={false}>
        {() => <NetworkSelect />}
      </UserMenu>
    )
  }

  return null
}
