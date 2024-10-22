import styled from 'styled-components'
import {
  Text,
  Toggle,
  Flex,
  Modal,
  InjectedModalProps,
  // ThemeSwitcher, Box
} from '@pancakeswap/uikit'
import { useSubgraphHealthIndicatorManager } from 'state/user/hooks'
import { useTranslation } from '@pancakeswap/localization'
// import useTheme from 'hooks/useTheme'
import QuestionHelper from '../../QuestionHelper'
import TransactionSettings from './TransactionSettings'
import GasSettings from './GasSettings'
import { SettingsMode } from './types'
import { useShowRoute } from '../../../state/user/hooks'
import { TbRoute } from 'react-icons/tb'

const Route = styled(TbRoute)`
  color: #fff;
  width: 32px;
  height: 32px;
`

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: none;
    height: 65vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
    height: auto;
  }
`

const SettingsModal: React.FC<InjectedModalProps> = ({ onDismiss, mode }) => {
  // const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  // const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgementShow()
  // const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [showRoute, toggleSetShowRoute] = useShowRoute()
  // const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  // const [audioPlay, toggleSetAudioMode] = useAudioModeManager()
  // const [zapMode, toggleZapMode] = useZapModeManager()
  const [subgraphHealth, setSubgraphHealth] = useSubgraphHealthIndicatorManager()
  // const { onChangeRecipient } = useSwapActionHandlers()

  const { t } = useTranslation()
  // const { isDark, setTheme } = useTheme()

  // if (showConfirmExpertModal) {
  //   return (
  //     <ExpertModal
  //       setShowConfirmExpertModal={setShowConfirmExpertModal}
  //       onDismiss={onDismiss}
  //       setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
  //     />
  //   )
  // }

  // const handleExpertModeToggle = () => {
  //   if (expertMode) {
  //     onChangeRecipient(null)
  //     toggleExpertMode()
  //   } else if (!showExpertModeAcknowledgement) {
  //     onChangeRecipient(null)
  //     toggleExpertMode()
  //   } else {
  //     setShowConfirmExpertModal(true)
  //   }
  // }

  return (
    <Modal title={t('SETTINGS')} headerBackground="background" onDismiss={onDismiss} style={{ maxWidth: '420px' }}>
      <ScrollableContainer>
        {mode === SettingsMode.GLOBAL && (
          <>
            <Flex pb="24px" flexDirection="column">
              <Text bold textTransform="uppercase" fontSize="18px" color="secondary" mb="24px">
                {t('Global')}
              </Text>
              {/* <Flex justifyContent="space-between" mb="24px">
                <Text>{t('Dark mode')}</Text>
                <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme(isDark ? 'dark' : 'dark')} />
              </Flex> */}
              <Flex justifyContent="space-between" alignItems="center" mb="24px">
                <Flex alignItems="center">
                  <Text>{t('Subgraph Health Indicator')}</Text>
                  <QuestionHelper
                    text={t(
                      'Turn on NFT market subgraph health indicator all the time. Default is to show the indicator only when the network is delayed',
                    )}
                    placement="top-start"
                    ml="4px"
                  />
                </Flex>
                <Toggle
                  id="toggle-subgraph-health-button"
                  checked={subgraphHealth}
                  scale="md"
                  onChange={() => {
                    setSubgraphHealth(!subgraphHealth)
                  }}
                />
              </Flex>
              <GasSettings />
            </Flex>
          </>
        )}
        {mode === SettingsMode.SWAP_LIQUIDITY && (
          <>
            <Flex marginTop="-4px" flexDirection="column">
              {/* <Flex justifyContent="space-between" alignItems="center" mb="24px"> */}

              <GasSettings />

              <TransactionSettings />
              {/* <Flex flexDirection="column" mb="2rem">
                <Flex mb="8px" alignItems="center" justifyContent="center"  >
                  <Route />
                  <Text marginLeft="3px" marginRight="2px" textAlign="center" 
              fontSize="1rem"  fontWeight="400" color="#fff">
                    {t('ROUTE')}</Text>
                  <QuestionHelper
                    text={t(
                      'BaseSwap routes trades through liquidity pools in order to return the best price. Toggle this on to see the path your trade will take.',
                    )}
                    placement="top-start"
                    ml="4px"
                  />
                </Flex>
                <Toggle
                  id="show-route"
                  checked={showRoute}
                  scale="md"
                  onChange={() => {
                    toggleSetShowRoute()
                  }}
                />
              </Flex> */}
            </Flex>
            {/* <Flex justifyContent="space-between" alignItems="center" mb="12px">
              <Flex  alignItems="center">
                <Text>{t('Zap')}</Text>
                <QuestionHelper
                  text={
                    <Box >
                      <Text color="#333">
                        {t(
                          'Zap enables simple liquidity provision. Add liquidity with one token and one click, without manual swapping or token balancing.',
                        )}
                      </Text>
                      <Text>
                        {t(
                          'If you experience any issue when adding or removing liquidity, please disable Zap and retry.',
                        )}
                      </Text>
                    </Box>
                  }
                  placement="top-start"
                  ml="4px"
                />
              </Flex>
              <Toggle
                checked={zapMode}
                scale="md"
                onChange={() => {
                  toggleZapMode(!zapMode)
                }}
              />
            </Flex> */}

            {/* <Flex justifyContent="space-between" alignItems="center" mb="24px">
              <Flex alignItems="center">
                <Text>{t('Expert Mode')}</Text>
                <QuestionHelper
                  text={t('Bypasses confirmation modals and allows high slippage trades. Use at your own risk.')}
                  placement="top-start"
                  ml="4px"
                />
              </Flex>
              <Toggle
                id="toggle-expert-mode-button"
                scale="md"
                checked={expertMode}
                onChange={handleExpertModeToggle}
              />
            </Flex> */}
            {/* <Flex justifyContent="space-between" alignItems="center" mb="24px">
              <Flex alignItems="center">
                <Text>{t('Disable Multihops')}</Text>
                <QuestionHelper text={t('Restricts swaps to direct pairs only.')} placement="top-start" ml="4px" />
              </Flex>
              <Toggle
                id="toggle-disable-multihop-button"
                checked={singleHopOnly}
                scale="md"
                onChange={() => {
                  setSingleHopOnly(!singleHopOnly)
                }}
              />
            </Flex> */}
            {/* <Flex justifyContent="space-between" alignItems="center" mb="24px">
              <Flex alignItems="center">
                <Text>{t('Flippy sounds')}</Text>
                <QuestionHelper
                  text={t('Fun sounds to make a truly immersive pancake-flipping trading experience')}
                  placement="top-start"
                  ml="4px"
                />
              </Flex>
              <PancakeToggle checked={audioPlay} onChange={toggleSetAudioMode} scale="md" />
            </Flex> */}
          </>
        )}
      </ScrollableContainer>
    </Modal>
  )
}

export default SettingsModal
