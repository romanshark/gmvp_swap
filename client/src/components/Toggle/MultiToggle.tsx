import styled from 'styled-components'

export const ToggleWrapper = styled.button<{ width?: string }>`
  display: flex;
  align-items: center;
  width: ${({ width }) => width ?? '100%'};
  padding: 4px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 8px;
  border: ${({ theme }) => '2px solid ' + theme.colors.background};
  cursor: pointer;
  outline: none;
`

export const ToggleElement = styled.span<{ isActive?: boolean; fontSize?: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px 0.5rem;
  border-radius: 8px;
  justify-content: center;
  height: 100%;
  background: ${({ theme, isActive }) => (isActive ? theme.colors.background : 'none')};
  color: ${({ theme, isActive }) => (isActive ? theme.colors.text : theme.colors.text)};
  font-size: 1rem; 
  font-weight: 500;
  white-space: nowrap;
  :hover {
    user-select: initial;
    color: ${({ theme, isActive }) => (isActive ? theme.colors.secondary : theme.colors.tertiary)};
  }
`
