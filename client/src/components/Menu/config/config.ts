import {
  MenuItemsType,
  SwapIcon,
  SwapFillIcon,
  EarnFillIcon,
  EarnIcon,
  FarmIcon,
  CurrencyIcon,
  TradeFilledIcon,
  AddIcon,
  EllipsisIcon,
  RocketIcon,
} from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'
import { DropdownMenuItems } from '@pancakeswap/uikit/src/components/DropdownMenu/types'
import { DEFAULT_CHAIN_ID } from 'utils/providers'
import { PiLinkSimpleHorizontalBold } from 'react-icons/pi'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean } & {
  items?: ConfigMenuDropDownItemsType[]
}

const filterItemBySupportChainId = (item, chainId) => {
  return !chainId || !item.supportChainIds ? true : item.supportChainIds?.includes(chainId)
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Trade'),
      href: '',
      fillIcon: SwapFillIcon,
      icon: SwapFillIcon,
      supportChainIds: [DEFAULT_CHAIN_ID],
      items: [
        {
          label: t('Swap'),
          href: '/swap',
        },
        {
          label: t('Basic Swap'),
          href: '/basicswap',
        },
        {
          label: t('Perpetuals'),
          href: 'http://perpetuals.baseswap.fi',
        },
      ],
    },
    {
      label: t('Liquidity'),
      href: '',
      fillIcon: AddIcon,
      icon: AddIcon,
      supportChainIds: [DEFAULT_CHAIN_ID],
      items: [
        {
          label: t('Standard Liquidity'),
          href: '/liquidity',
        },
        {
          label: t('Concentrated Liquidity'),
          href: '/positions',
        },
      ],
    },


    {
      label: t('Farm'),
      href: '',
      icon: EarnIcon,
      fillIcon: EarnIcon,
      supportChainIds: [DEFAULT_CHAIN_ID],
      items: [
        {
          label: t('Standard Farms'),
          href: '/farm',
        },
        {
          label: t('Concentrated Farms'),
          href: '/farmV3',
        },
      ],
    },
    {
      label: t('Earn'),
      href: '/pools',
      showItemsOnMobile: false,
      icon: CurrencyIcon,
      fillIcon: CurrencyIcon,
      items: [].filter((item) => filterItemBySupportChainId(item, chainId)),
    },
  
    {
      label: t('Links'),
      href: '',
      icon: PiLinkSimpleHorizontalBold,
      fillIcon: PiLinkSimpleHorizontalBold,
      supportChainIds: [DEFAULT_CHAIN_ID],
      items: [
        {
          label: t('Twitter'),
          href: 'https://twitter.com/BaseSwap_Fi',
        },

        {
          label: t('Discord'),
          href: 'https://discord.gg/2zUzjyGxw2',
        },
        {
          label: t('Telegram'),
          href: 'https://t.me/BaseswapFi',
        },
        {
          label: t('Medium'),
          href: 'https://medium.com/@BaseSwap',
        },
        {
          label: t('YouTube'),
          href: 'https://www.youtube.com/@BaseSwap',
        },
        {
          label: t('Docs'),
          href: 'https://base-swap-1.gitbook.io/baseswap/',
        },
      ],
    },
    {
      label: t('More'),
      href: '',
      icon: EllipsisIcon,
      fillIcon: EllipsisIcon,
      supportChainIds: [DEFAULT_CHAIN_ID],
      items: [
        // {
        //   label: t("New here?"),
        //   href: '/new',
        // },
        {
          label: t('xBSX'),
          href: '/xbsx',
        },
        // {
        //   label: t('BSX Presale!'),
        //   href: 'https://presale.baseswap.fi',
        // },
        {
          label: t('Bridge'),
          href: '/bridge',
        },
        {
          label: t('Locker'),
          href: '/locker',
        },
        {
          label: t('NFT'),
          href: 'https://marketplace.baseswap.fi',
        },
      ],
    },

    // {
    //   label: t('Swap'),
    //   icon: SwapIcon,
    //   fillIcon: SwapFillIcon,
    //   href: '/swap',
    //   showItemsOnMobile: false,
    //   items: [
    //     {
    //       label: t('Swap'),
    //       href: '/swap',
    //     },
    //     {
    //       label: t('Liquidity'),
    //       href: '/liquidity',
    //     },
    // {
    //   label: t('Perpetual'),
    //   href: `https://perp.pancakeswap.finance/${perpLangMap(languageCode)}/futures/BTCUSDT?theme=${perpTheme(
    //     isDark,
    //   )}`,
    //   type: DropdownMenuItemType.EXTERNAL_LINK,
    // },
    // {
    //   label: t('Transfer'),
    //   href: '/transfer',
    // },
    //     ].filter((item) => filterItemBySupportChainId(item, chainId)),
    //   },
  ].filter((item) => filterItemBySupportChainId(item, chainId))

export default config
