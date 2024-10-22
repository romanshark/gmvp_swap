import styled from 'styled-components'

export const ActionContainer = styled.div`
  padding: 8px; 
  border: 2px solid ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 12px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 8px;
    margin-right: 8px;
    margin-bottom: 0;
    max-height: 100px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 0;
    max-height: 100px;
  }
`

export const ActionTitles = styled.div`
  display: flex;
`

export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

`
