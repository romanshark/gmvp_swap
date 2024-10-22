import styled from 'styled-components'
import PageSection from 'components/PageSection'
import useTheme from 'hooks/useTheme'
import { PageMeta } from 'components/Layout/Page'
import Hero from './components/Hero'
import MetricsSection from './components/MetricsSection'
import TVL from './components/TVL'
import { useRef } from 'react'
import Footer from 'components/Menu/Footer'


const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 16px;
  }
`

const Home: React.FC = () => {
  const { theme } = useTheme()
 
  return (
    <>
      <PageMeta />


      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'linear-gradient(to bottom right, #000, #222 )'
            : 'linear-gradient(139.73deg, #0154FD 0%, #fff 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
            <Hero />
            <TVL />
      </StyledHeroSection>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'linear-gradient(to top right, #000, #222 )'
            : 'linear-gradient(180deg, #0154FD 0%, #fff 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        <MetricsSection />
      </PageSection>
      <Footer /> 

    </>
  )
}

export default Home
