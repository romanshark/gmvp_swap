import styled, { keyframes } from 'styled-components'
import { Button, Heading, Text, LogoIcon } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from '@pancakeswap/localization'
import Link from 'next/link'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`
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
const NotFound = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <StyledNotFound>
        <FloatingImage src="/images/pepetokens.png" alt="Ayush" width="250px" />
        <Heading scale="xxl">404</Heading>
        <Text mb="16px" mt="16px">
          {t('Oops, page not found.')}
        </Text>
        <Link href="/" passHref>
          <Button as="a" scale="sm">
            {t('Back Home')}
          </Button>
        </Link>
      </StyledNotFound>
    </Page>
  )
}

export default NotFound
