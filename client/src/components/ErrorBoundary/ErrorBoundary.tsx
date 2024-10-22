import * as Sentry from '@sentry/react'
import Page from 'components/Layout/Page'
import { useTranslation } from '@pancakeswap/localization'
import { Button, Text, LogoIcon, Flex, IconButton, CopyIcon } from '@pancakeswap/uikit'
import { copyText } from 'utils/copyText'
import { useCallback } from 'react'
import styled, { keyframes } from 'styled-components'

const float = keyframes`
	0% {
		transform: translatey(0px);
	}
	50% {
		transform: translatey(10px);
	}
	100% {
		transform: translatey(0px);
	}
`

const FloatingImage = styled.img`
  animation: ${float} 6s ease-in-out infinite;
  transform: translate3d(0, 0, 0);
`

export default function ErrorBoundary({ children }) {
  const { t } = useTranslation()
  const handleOnClick = useCallback(() => window.location.reload(), [])
  return (
    <Sentry.ErrorBoundary
      beforeCapture={(scope) => {
        scope.setLevel(Sentry.Severity.Fatal)
      }}
      fallback={({ eventId }) => {
        return (
          <Page>
            <Flex flexDirection="column" justifyContent="center" alignItems="center">
            <FloatingImage src="/images/pepetokens.png" alt="Pep" width="250px" />
              <Text mb="16px">{t('Oops, something went wrong.')}</Text>
              {/* {eventId && (
                <Flex flexDirection="column" style={{ textAlign: 'center' }} mb="8px">
                  <Text>{t('Error Tracking Id')}</Text>
                  <Flex alignItems="center">
                    <Text>{eventId}</Text>
                    <IconButton variant="text" onClick={() => copyText(eventId)}>
                      <CopyIcon color="primary" width="24px" />
                    </IconButton>
                  </Flex>
                </Flex>
              )} */}
              <Button onClick={handleOnClick}>{t('Click here to reset!')}</Button>
            </Flex>
          </Page>
        )
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}
