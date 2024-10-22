import { readableColor } from 'polished'
import { PropsWithChildren } from 'react'
import styled, { DefaultTheme } from 'styled-components'

export enum BadgeVariant {
  DEFAULT = 'DEFAULT',
  NEGATIVE = 'NEGATIVE',
  POSITIVE = 'POSITIVE',
  PRIMARY = 'PRIMARY',
  WARNING = 'WARNING',
  PROMOTIONAL = 'PROMOTIONAL',
  BRANDED = 'BRANDED',
  SOFT = 'SOFT',

  WARNING_OUTLINE = 'WARNING_OUTLINE',
}

interface BadgeProps {
  variant?: BadgeVariant
}

function pickBackgroundColor(variant: BadgeVariant | undefined, theme: DefaultTheme): string {
  switch (variant) {
    // case BadgeVariant.BRANDED:
    //   return theme.brandedGradient
    // case BadgeVariant.PROMOTIONAL:
    //   return theme.promotionalGradient
    // case BadgeVariant.NEGATIVE:
    //   return theme.accentCritical
    // case BadgeVariant.POSITIVE:
    //   return theme.accentSuccess
    // case BadgeVariant.SOFT:
    //   return theme.accentActionSoft
    case BadgeVariant.PRIMARY:
      return theme.colors.primary
    // case BadgeVariant.WARNING:
    //   return theme.accentWarning
    case BadgeVariant.WARNING_OUTLINE:
      return 'transparent'
    default:
      return theme.colors.background
  }
}

function pickBorder(variant: BadgeVariant | undefined, theme: DefaultTheme): string {
  switch (variant) {
    case BadgeVariant.WARNING_OUTLINE:
      return `1px solid ${theme.colors.warning}`
    default:
      return 'unset'
  }
}

function pickFontColor(variant: BadgeVariant | undefined, theme: DefaultTheme): string {
  switch (variant) {
    case BadgeVariant.BRANDED:
      return theme.isDark ? theme.colors.primaryDark : theme.colors.primaryBright
    case BadgeVariant.NEGATIVE:
      return readableColor(theme.colors.failure)
    case BadgeVariant.POSITIVE:
      return readableColor(theme.colors.success)
    case BadgeVariant.WARNING:
      return readableColor(theme.colors.warning)
    case BadgeVariant.WARNING_OUTLINE:
      return theme.colors.warning
    default:
      return readableColor(theme.colors.background)
  }
}

const Badge = styled.div<PropsWithChildren<BadgeProps>>`
  align-items: center;
  background: ${({ theme, variant }) => pickBackgroundColor(variant, theme)};
  border: ${({ theme, variant }) => pickBorder(variant, theme)};
  border-radius: 0.5rem;
  color: ${({ theme, variant }) => pickFontColor(variant, theme)};
  display: inline-flex;
  padding: 4px 6px;
  justify-content: center;
  font-weight: 500;
`

export default Badge
