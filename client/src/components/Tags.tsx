import {
  AutoRenewIcon,
  BlockIcon,
  CommunityIcon,
  RefreshIcon,
  Tag,
  TagProps,
  Text,
  TimerIcon,
  TooltipText,
  useTooltip,
  VerifiedIcon,
  VoteIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { memo } from 'react'
import styled from 'styled-components'
import { BsFire } from 'react-icons/bs'
import { LuHeartHandshake } from 'react-icons/lu'
import { AiFillDollarCircle } from 'react-icons/ai'
import { LiaEthereum } from 'react-icons/lia' 


const OrangeBsFire = styled(BsFire)`
  color: #FC8A17;
  width: 24px;
  height: 24px; 
`;

const Partner = styled(LuHeartHandshake)`
  color: #ff0000;
  width: 24px;
  height: 24px; 
`;

const Stablecoins = styled(AiFillDollarCircle)`
  color: #00FF00;
  width: 24px;
  height: 24px; 
`;

const Bluechip = styled(LiaEthereum)`
  color: #FFD700;
  width: 24px;
  height: 24px; 
`;


const CoreTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="nohomo" startIcon={<OrangeBsFire width="18px"  
    style={{ marginRight: '4px' }} />} {...props}>
      {t('BaseSwap')}
    </Tag>
  )
}

const StableTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="green" startIcon={<Stablecoins width="18px"  
    style={{ marginRight: '4px' }} />} {...props}>
      {t('Stablecoin')}
    </Tag>
  )
}

const PartnerTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="red" startIcon={<Partner width="18px" color="success" style={{ marginRight: '4px' }} />} {...props}>
      {t('Partner')}
    </Tag>
  )
}

const BluechipTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="gold" startIcon={<Bluechip width="18px" color="success" style={{ marginRight: '4px' }} />} {...props}>
      {t('Bluechip')}
    </Tag>
  )
}

const BoostTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="transparent" startIcon={<OrangeBsFire />} {...props}>
      {t('Boosted')}
    </Tag>
  )
}

const FarmAuctionTagToolTipContent = memo(() => {
  const { t } = useTranslation()
  return <Text color="text">{t('Farm Auction Winner, add liquidity at your own risk.')}</Text>
})

const FarmAuctionTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<FarmAuctionTagToolTipContent />, { placement: 'right' })
  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} style={{ textDecoration: 'none' }}>
        <Tag variant="failure" outline startIcon={<CommunityIcon width="18px" color="failure" mr="4px" />} {...props}>
          {t('Farm Auction')}
        </Tag>
      </TooltipText>
    </>
  )
}

const CommunityTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="failure" outline startIcon={<CommunityIcon width="18px" color="failure" mr="4px" />} {...props}>
      {t('Community')}
    </Tag>
  )
}

const DualTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="textSubtle" outline {...props}>
      {t('Dual')}
    </Tag>
  )
}

const ManualPoolTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="secondary" outline startIcon={<RefreshIcon width="18px" color="secondary" mr="4px" />} {...props}>
      {t('Manual')}
    </Tag>
  )
}

const CompoundingPoolTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="success" outline startIcon={<AutoRenewIcon width="18px" color="success" mr="4px" />} {...props}>
      {t('Auto')}
    </Tag>
  )
}



const SoonTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="binance" startIcon={<TimerIcon width="18px" color="success" mr="4px" />} {...props}>
      {t('Soon')}
    </Tag>
  )
}

const ClosedTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="textDisabled" startIcon={<BlockIcon width="18px" color="textDisabled" mr="4px" />} {...props}>
      {t('Closed')}
    </Tag>
  )
}

export {
  CoreTag,
  StableTag, 
  PartnerTag, 
  FarmAuctionTag,
  DualTag,
  ManualPoolTag,
  CompoundingPoolTag,
  BluechipTag, 
  SoonTag,
  ClosedTag,
  CommunityTag,
  BoostTag, 
}
