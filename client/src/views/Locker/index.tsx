import React, { useCallback, useEffect, useState, FC } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // Import the relativeTime plugin
import utc from 'dayjs/plugin/utc'; // Import the utc plugin

import styled from 'styled-components';
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import {
  Button, Flex, ButtonMenu,
  ButtonMenuItem
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrencyBalance } from 'state/wallet/hooks'
import tryParseAmount from 'utils/tryParseAmount'
import { formatNumberScale } from 'utils/formatBalance'
import PageTitle from 'components/PageTitle/PageTitle'
import { ethers } from 'ethers'
import Page from '../Page'
import { useTokenLocker } from 'hooks/useContract'
import NumericalInput from 'components/CurrencyInputPanel/NumericalInput'
import { LOCKER_ADDRESS } from 'config/constants/exchange';
import { useApproveCallback } from 'hooks/useApproveCallback';
import { useCurrency } from 'hooks/Tokens';
import { getAddress, isAddress } from '@ethersproject/address';
import useToast from 'hooks/useToast';
import BigNumber from 'bignumber.js';
import { ToastDescriptionWithTx } from 'components/Toast';
import DateTimePicker from 'react-datetime-picker';
import { StyledCard } from '@pancakeswap/uikit/src/components/Card/StyledCard';

dayjs.extend(relativeTime); // Extend dayjs with the relativeTime plugin
dayjs.extend(utc);


export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

export enum LockerType {
  FIND,
  CREATE
}

const Tabs = styled.div`
  padding: 0px 0px 24px 0px;
  margin-top: 40px;
  margin-bottom: 8px;
`

const Wrapper = styled(Flex)`
  width: 95%;
  min-width: 95%;
  justify-content: center;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 60px;
  overflow: visible;
`;

const StyledFlex = styled(Flex)`
  width: 95%;
  min-width: 95%;
  background: linear-gradient(to bottom, #333333, #000000);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  padding: 12px;
  margin-top: 48px;
  margin-left: 12px;
  margin-right: 12px;
`;


const StyledLockCard = styled.div`
  width: 95%;
  min-width: 95%;
  background: linear-gradient(to bottom, #333333, #000000);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  padding: 12px;
  margin-top: 48px;
  margin-left: 12px;
  margin-right: 12px;
`;

const StyledRow = styled.div`
  margin-top: 12px;
`;
const StyledRowBlue = styled.div`
  margin-top: 24px;
  color: #0154FE;
  font-weight: 600;
`;

const CardInner = styled.div`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const SubText = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #a0aec0;
`;

const TextInput = styled.input`
  border-radius: 2px;
  border: 3px solid #fff;
  width: 100%;
  min-height: 60px;
  background: linear-gradient(to bottom,#000 20%,#111);
  color: #FFF;
  padding-left: 12px;
  font-weight: 500;
  font-size: 24px;
  text-align: right;
  padding-right: 12px;
`;

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];


const Locker: FC = () => {

  const { t } = useTranslation()

  const [view, setView] = useState(LockerType.FIND)

  const handleClick = (newIndex: number) => {
    setView(newIndex)
  }

  const TabsComponent: React.FC = () => (
    <Tabs>
      <ButtonMenu scale="sm" onItemClick={handleClick} activeIndex={view} fullWidth>
        <ButtonMenuItem style={{ height: 40 }}>{t('Find Locker')}</ButtonMenuItem>
        <ButtonMenuItem style={{ height: 40 }}>{t('Create Locker')}</ButtonMenuItem>
      </ButtonMenu>
    </Tabs>
  )

  const { account, chainId } = useActiveWeb3React()
  const [tokenAddress, setTokenAddress] = useState('')
  // const [withdrawer, setWithdrawer] = useState('')
  const [value, setValue] = useState('')
  const [unlockDate, setUnlockDate] = useState(dayjs().add(1, 'day'))

  const [tokenAddressFind, setTokenAddressFind] = useState('')
  const [lockers, setLockers] = useState([])

  const [pendingTx, setPendingTx] = useState(false)

  const assetToken = useCurrency(tokenAddress) || undefined
  const payingToken = useCurrency('0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9') || undefined
  const typedDepositValue = tryParseAmount(value, assetToken)
  const typedPayingValue = tryParseAmount(value, payingToken)
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, assetToken ?? undefined)

  // LIQUIDITY TOKEN APPROVAL
  const [approvalState, approve] = useApproveCallback(typedDepositValue, LOCKER_ADDRESS[chainId])
  // BASESWAP TOKEN APPROVAL
  const [approvalStatePayingValue, approvePayingValue] = useApproveCallback(typedPayingValue, LOCKER_ADDRESS[chainId])

  const lockerContract = useTokenLocker()

  useEffect(() => {
    if (isAddress(tokenAddressFind)) {
      lockerContract.getDepositsByTokenAddress(tokenAddressFind).then(async (r) => {
        if (r.length > 0) {
          const updatedLockers = await Promise.all(r.map(async (locker) => {
            try {
              const lockedTokenData = await lockerContract.lockedToken(locker);
              return {
                ...locker,
                lockerId: locker.toNumber(),
                lockedTokenData: lockedTokenData || null, // Handle the case where lockedTokenData is undefined
              };
            } catch (error) {
              console.error("Error fetching lockedTokenData:", error);
              return locker; // Return the locker as is, without lockedTokenData
            }
          }));
          setLockers(updatedLockers);
        }
      })
    }
  }, [tokenAddressFind, lockerContract]);

  const handleChangeDate = (date: Date) => {
    setUnlockDate(dayjs(date))
  }

  const handleWithdraw = useCallback(
    async (id) => {
      setPendingTx(true)

      try {
        const tx = await lockerContract.withdrawTokens(id)
        toastSuccess(
          `Removed Lock from ${id}`,
          `Your funds have been removed`
        )
      } catch (error) {
        toastError(
          `Error:`,
          `${error}`
        )
      }
      setPendingTx(false)
    },
    [lockerContract]
  )


  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  const [approvalPaymentSubmitted, setApprovalPaymentSubmitted] = useState<boolean>(false)

  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])
  useEffect(() => {
    if (approvalStatePayingValue === ApprovalState.PENDING) {
      setApprovalPaymentSubmitted(true)
    }
  }, [approvalStatePayingValue, approvalPaymentSubmitted])

  const errorMessage = !isAddress(tokenAddress)
    ? 'Invalid token'
    : !isAddress(account)
      ? 'Invalid withdrawer'
      : isNaN(parseFloat(value)) || parseFloat(value) == 0
        ? 'Invalid amount'
        : (!dayjs(unlockDate).isValid() || dayjs(unlockDate).isBefore(dayjs()))
          ? 'Invalid unlock date'
          : ''

  const allInfoSubmitted = errorMessage == ''

  const handleApprove = useCallback(async () => {
    await approve()
  }, [approve])
  const handleApprovePayingValue = useCallback(async () => {
    await approvePayingValue()
  }, [approvePayingValue])

  const handleLock = useCallback(async () => {
    if (allInfoSubmitted) {
      setPendingTx(true)
      const bigNumberValue = new BigNumber(value).times(new BigNumber(10).pow(assetToken?.decimals));

      try {
        const tx = await lockerContract.lockTokensByBaseSwap(
          tokenAddress,
          account,
          bigNumberValue.toString(),
          dayjs(unlockDate).unix().toString(),
        )

        if (tx.wait) {
          const result = await tx.wait()

          const [_withdrawer, _amount, _id] = ethers.utils.defaultAbiCoder.decode(
            ['address', 'uint256', 'uint256'],
            result.events[2].data
          )

          setTokenAddress('')
          // setWithdrawer('')
          setValue('')
          setUnlockDate(dayjs());
          toastSuccess(
            `Created Lock [ID: ${_id}]`,
            <ToastDescriptionWithTx txHash={result.transactionHash}>
              Your funds have been locked
            </ToastDescriptionWithTx>,
          )
        } else {
          toastError(
            `Error:`,
            `User denied transaction signature.`
          )
        }
      } catch (err) {
        toastError(
          `Error:`,
          `${err}`
        )
      } finally {
        setPendingTx(false)
      }
    }
  }, [allInfoSubmitted, assetToken, tokenAddress, account, value, unlockDate, lockerContract])

  return (
    <>
      <Page>
        <PageTitle title="Token Locker" />
        <TabsComponent />
        <Wrapper>
          {view === LockerType.CREATE && <StyledCard className="animate__animated animate__fadeInLeft animate__fast">
            <CardInner>
              <Flex flexDirection="column" mt="12px">
                <TextContainer>
                  <SubText>Token Address</SubText>
                </TextContainer>
                <TextInput
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  pattern="^(0x[a-fA-F0-9]{40})$"
                  onChange={(e) => setTokenAddress(e.target.value)}
                  value={tokenAddress}
                />
              </Flex>
              <Flex flexDirection="column" mt="12px">
                <TextContainer>
                  <SubText>Amount</SubText>
                </TextContainer>
                <NumericalInput
                  style={{
                    minWidth: '100%',
                    borderRadius: '2px',
                    border: '3px solid #fff',
                    width: '100%',
                    minHeight: '60px',
                    background: 'linear-gradient(to bottom,#000 20%,#111)',
                    color: '#FFF',
                    paddingLeft: '12px',
                    fontSize: '24px',
                    paddingRight: '12px'
                  }}
                  id="token-amount-input"
                  value={value}
                  onUserInput={(val) => {
                    setValue(val)
                  }}
                />
              </Flex>
              {assetToken && selectedCurrencyBalance ? (
                <Flex flexDirection="column" alignItems="flex-end" justifyContent="flex-end" mt="12px">
                  <div
                    onClick={() => setValue(selectedCurrencyBalance.toFixed())}
                    className="text-xxs font-medium text-right cursor-pointer text-low-emphesis"
                  >
                    Balance: {formatNumberScale(selectedCurrencyBalance.toSignificant(4))}{' '}
                  </div>
                </Flex>
              ) : null}

              <TextContainer>
                <SubText>Withdrawer</SubText>
              </TextContainer>
              <Flex alignItems="center" marginBottom="12px">
                <TextInput
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  pattern="^(0x[a-fA-F0-9]{40})$"
                  disabled
                  // onChange={(e) => setWithdrawer(e.target.value)}
                  value={account}
                />
                {/* {account && (
                  <Button
                    onClick={() => setWithdrawer(account)}
                    size="xs"
                    marginRight={12}
                    marginLeft={12}
                  >
                    Me
                  </Button>
                )} */}
              </Flex>
              <TextContainer>
                <SubText>Unlock Date</SubText>
              </TextContainer>
              <DateTimePicker onChange={(date) => handleChangeDate(date)} value={unlockDate.toDate()} />
              <TextContainer>
                {!account ? (
                  <div>Connect An Account First</div>
                ) : !allInfoSubmitted ? (
                  <Button className="font-bold" style={{ width: '100%' }} disabled={!allInfoSubmitted}>
                    {errorMessage}
                  </Button>
                ) : (
                  <Flex flexDirection="column" alignItems="center" justifyContent="center" style={{width: '100%'}}>
                    {approvalState !== ApprovalState.APPROVED && (
                      <Button
                        onClick={handleApprove}
                        disabled={
                          approvalState !== ApprovalState.NOT_APPROVED ||
                          approvalSubmitted ||
                          !allInfoSubmitted
                        }
                        style={{
                          width: '100%',
                          marginBottom: '20px'
                        }}
                      >
                        {approvalState === ApprovalState.PENDING ? (
                          <div className={'p-2'}>
                            Approving...
                          </div>
                        ) : (
                          "Approve Spending LP"
                        )}
                      </Button>
                    )}
                    {approvalStatePayingValue !== ApprovalState.APPROVED && (
                      <Button
                        onClick={handleApprovePayingValue}
                        disabled={
                          approvalStatePayingValue !== ApprovalState.NOT_APPROVED ||
                          approvalPaymentSubmitted ||
                          !allInfoSubmitted
                        }
                        style={{
                          width: '100%',
                          marginBottom: '20px'
                        }}
                      >
                        {approvalStatePayingValue === ApprovalState.PENDING ? (
                          <div className={'p-2'}>
                            Approving...
                          </div>
                        ) : (
                          "Approving Spending BaseSwap"
                        )}
                      </Button>
                    )}
                    {approvalState === ApprovalState.APPROVED && (
                      <Button
                        className="font-bold text-light"
                        onClick={handleLock}
                        style={{
                          width: '100%',
                          marginBottom: '20px'
                        }}
                        disabled={approvalState !== ApprovalState.APPROVED || approvalStatePayingValue !== ApprovalState.APPROVED || !allInfoSubmitted || pendingTx}
                      >
                        {pendingTx ? (
                          <div className={'p-2'}>
                            Locking
                          </div>
                        ) : (
                          'Lock'
                        )}
                      </Button>
                    )}
                  </Flex>
                )}
              </TextContainer>

              <StyledFlex flexDirection="column" justifyContent="flex-start">
                <TextContainer>
                  <SubText>How to use</SubText>
                </TextContainer>
                <p>
                  Input your token or liquidity pair address, amount of tokens to lock,
                  withdrawer address and when tokens will become unlocked.
                </p>
                <p>Click on "Approve" to allow the contract to transfer your tokens.  You must approve both the 1 BSWAP fee as well as your LP</p>
                <p>Click on "Deposit" to lock your tokens into the locker contract.</p>
                <TextContainer>
                  <SubText>Fees</SubText>
                </TextContainer>
                <p>Pay 1 BSWAP to lock.</p>
                <TextContainer>
                  <SubText>Considerations</SubText>
                </TextContainer>
                <p>You will not be able to withdraw your tokens before the unlock time.</p>
                <p>Locker contract address: 0x4e4c89937f85bD101C7FCB273435Ed89b49ad0B0</p>
                <p>Always DYOR.</p>
              </StyledFlex>

            </CardInner>
          </StyledCard>}
          {view === LockerType.FIND &&
            <StyledCard className="animate__animated animate__fadeInLeft animate__fast" style={{width: '100%', maxWidth: '1200px', minHeight: '800px'}}>
              <CardInner>
                <Flex flexDirection="column" mt="12px">
                  <TextContainer>
                    <SubText>Search</SubText>
                  </TextContainer>
                  {account ? <TextInput
                    // placeholder={'Search by name, symbol or address'}
                    type="text"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    pattern="^(0x[a-fA-F0-9]{40})$"
                    onChange={(e) => setTokenAddressFind(e.target.value)}
                    value={tokenAddressFind}
                  />: <div>Please connect your account</div>}
                  {lockers.length == 0 && isAddress(tokenAddress) && (
                    <div className="flex justify-center items-center col-span-12 lg:justify mt-20">
                      <span>
                        No lockers found...
                      </span>
                    </div>
                  )}
                  <div className="flex-col">
                    {lockers.length > 0 && lockers.map((locker, index) => {
                      return (
                        <StyledLockCard key={index}>
                          <StyledRow>
                            Tokens locked- {locker.lockedTokenData.token.toString()}
                          </StyledRow>
                          <StyledRow>
                            Amount locked- {locker.lockedTokenData.amount.toString()}
                          </StyledRow>
                          <StyledRow>
                            Withdraw address- {locker.lockedTokenData.withdrawer.toString()}
                          </StyledRow>
                          <StyledRowBlue>
                            Unlocke Date {dayjs.unix(locker.lockedTokenData.unlockTimestamp.toNumber()).fromNow()}
                          </StyledRowBlue>
                          <StyledRow style={{ color: locker.lockedTokenData.withdrawn ? 'green' : 'red' }}>
                            {locker.lockedTokenData.withdrawn ? 'Withdrawn already' : 'Not withdrawn'}
                          </StyledRow>
                          <Button
                            style={{ width: '100%', marginTop: 20 }}
                            onClick={() => handleWithdraw(locker.lockerId)}
                            disabled={
                              dayjs.unix(locker.lockedTokenData.unlockTimestamp.toNumber()).isAfter(new Date()) ||
                              !account ||
                              locker.lockedTokenData.withdrawn ||
                              (account && getAddress(account) != getAddress(locker.lockedTokenData.withdrawer))
                            }
                          >
                            Withdraw
                          </Button>
                        </StyledLockCard>
                      )
                    })}
                  </div>
                </Flex>


              </CardInner>
            </StyledCard>
          }
        </Wrapper>
      </Page>
    </>
  )
}

export default Locker
