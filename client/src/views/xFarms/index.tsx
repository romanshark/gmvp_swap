import { FC } from 'react'
import Farms, { FarmsContext } from './XFarms'

export const FarmsPageLayout: FC = ({ children }) => {
  return <Farms>{children}</Farms>
}

export { FarmsContext }
