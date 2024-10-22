import { useSelector } from 'react-redux'
import { XTokenState } from './types'
import { xTokenInfoSelector } from './selectors'

export const useXTokenInfo = (): XTokenState => {
  return useSelector(xTokenInfoSelector)
}
