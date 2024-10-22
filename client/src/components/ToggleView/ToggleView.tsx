import { useCallback } from 'react'
import styled from 'styled-components'
import { ListViewIcon, CardViewIcon, IconButton } from '@pancakeswap/uikit'
import { ViewMode } from 'state/user/actions'

interface ToggleViewProps {
  idPrefix: string
  viewMode: ViewMode
  onToggle: (mode: ViewMode) => void
}

const Container = styled.div`
  margin-left: -8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 0;
  }
`

const ToggleView: React.FunctionComponent<ToggleViewProps> = ({ idPrefix, viewMode, onToggle }) => {
  const handleToggleCard = useCallback(() => {
    if (viewMode !== ViewMode.CARD) {
      onToggle(ViewMode.CARD)
    }
  }, [onToggle, viewMode])

  const handleToggleTable = useCallback(() => {
    if (viewMode !== ViewMode.TABLE) {
      onToggle(ViewMode.TABLE)
    }
  }, [onToggle, viewMode])

  return (
    <Container>
      <IconButton variant="text"  id={`${idPrefix}CardView`} onClick={handleToggleCard}>
        <CardViewIcon width="24px" color={viewMode === ViewMode.CARD ? 'background' : 'text'} />
      </IconButton>
      <IconButton variant="text"  id={`${idPrefix}TableView`} onClick={handleToggleTable}>
        <ListViewIcon width="24px"  color={viewMode === ViewMode.TABLE ? 'background' : 'text'} />
      </IconButton>
    </Container>
  )
}

export default ToggleView
