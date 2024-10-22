import { useTranslation } from '@pancakeswap/localization'
import { CreateNewIcon, Text, Button } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'

interface NewPositionProps {
  currencyIdA?: string
  currencyIdB?: string
  feeAmount?: number
}

export default function NewPositionButton({ currencyIdA, currencyIdB, feeAmount }: NewPositionProps) {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <Button
      m={2}
      onClick={() => {
        router.replace({
          pathname: '/addV3',
          query: {
            currencyIdA,
            currencyIdB,
            feeAmount,
          },
        })
      }}
    >
      <CreateNewIcon />
      <Text marginLeft="8px">{t('New Position')}</Text>
    </Button>
  )
}
