import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTheme } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import config, { ConfigMenuItemsType } from '../config/config'

export const useMenuItems = (): ConfigMenuItemsType[] => {
  const {
    t,
    currentLanguage: { code: languageCode },
  } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const { isDark } = useTheme()

  const menuItems = useMemo(() => {
    return config(t, isDark, languageCode, chainId)
  }, [t, isDark, languageCode, chainId])

  return useMemo(() => {
    // if (menuItemsStatus && Object.keys(menuItemsStatus).length) {
    //   return menuItems.map((item) => {
    //     const innerItems = item.items.map((innerItem) => {
    //       const itemStatus = menuItemsStatus[innerItem.href]
    //       if (itemStatus) {
    //         let itemMenuStatus
    //         if (itemStatus === 'soon') {
    //           itemMenuStatus = menuStatus.SOON
    //         } else if (itemStatus === 'live') {
    //           itemMenuStatus = menuStatus.LIVE
    //         } else {
    //           itemMenuStatus = menuStatus.NEW
    //         }
    //         return { ...innerItem, status: itemMenuStatus }
    //       }
    //       return innerItem
    //     })
    //     return { ...item, items: innerItems }
    //   })
    // }
    return menuItems
  }, [menuItems])
}
