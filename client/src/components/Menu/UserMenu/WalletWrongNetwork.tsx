import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Button, Text, Link, HelpIcon } from '@pancakeswap/uikit'
import { setupNetwork } from 'utils/wallet'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ChainId } from '@magikswap/sdk'
import { DEFAULT_CHAIN_ID } from 'utils/providers'

const StyledLink = styled(Link)`
  width: 100%;
  &:hover {
    text-decoration: initial;
  }
`

interface WalletWrongNetworkProps {
  onDismiss: () => void
}

const WalletWrongNetwork: React.FC<WalletWrongNetworkProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { connector, library } = useWeb3React()

  const handleSwitchNetwork = async (): Promise<void> => {
    await setupNetwork(DEFAULT_CHAIN_ID, library)
    onDismiss?.()
  }

  return (
    <>
      <Text mb="24px">{t('You’re connected to the wrong network.')}</Text>
      {connector instanceof InjectedConnector && (
        <Button onClick={handleSwitchNetwork} mb="24px">
          {t('Switch Network')}
        </Button>
      )}
      {/* <StyledLink href="https://base-swap-1.gitbook.io/baseswap/" external>
        <Button width="100%" variant="secondary">
          {t('Learn How')}
          <HelpIcon color="primary" ml="6px" />
        </Button>
      </StyledLink> */}
    </>
  )
}

export default WalletWrongNetwork
