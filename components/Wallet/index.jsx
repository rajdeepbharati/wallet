import React, { useCallback, useState } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  Button,
  ButtonGroup,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import {
  AccountCard,
  AccountError,
  BalanceCard,
  Wrapper,
  Sidebar,
  Content,
  BaseButton as ButtonLogout,
  Box,
  Tooltip
} from '../Shared'
import Send from './Send.js'
import MessageView from './Message'
import { useWalletProvider } from '../../WalletProvider'
import {
  hasLedgerError,
  reportLedgerConfigError
} from '../../utils/ledger/reportLedgerConfigError'
import MsgConfirmer from '../../lib/confirm-message'
import useWallet from '../../WalletProvider/useWallet'
import { MESSAGE_HISTORY, SEND } from './views'
import reportError from '../../utils/reportError'
// import useReset from '../../utils/useReset'

function WalletView({ accountAddresses }) {
  const wallet = useWallet()
  const router = useRouter()
  const childView = router.pathname.includes('home') ? MESSAGE_HISTORY : SEND
  const { ledger, connectLedger } = useWalletProvider()
  const [uncaughtError, setUncaughtError] = useState('')
  const [showLedgerError, setShowLedgerError] = useState(false)
  const [ledgerBusy, setLedgerBusy] = useState(false)
  const [addressConfirmed, setAddressConfirmed] = useState(false)

  const [isOpen, setIsOpen] = React.useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = React.useRef()

  // const resetState = useReset()

  console.log('WVIEW', accountAddresses)

  const setChildView = useCallback(
    view => {
      const params = new URLSearchParams(router.query)
      if (view === MESSAGE_HISTORY) {
        router.push(`/home?${params.toString()}`)
      } else if (view === SEND) {
        router.push(`/send?${params.toString()}`)
      }
    },
    [router]
  )

  const onAccountSwitch = () => {
    const params = new URLSearchParams(router.query)
    router.push(`/home/accounts?${params.toString()}`)
  }

  const onShowOnLedger = async () => {
    setLedgerBusy(true)
    try {
      setUncaughtError('')
      setShowLedgerError(false)
      const provider = await connectLedger()
      if (provider) {
        await provider.wallet.showAddressAndPubKey(wallet.path)
        const params = new URLSearchParams(router.query)
        const selectedAddress = params.toString().split('=')[1]
        console.log('router address:', selectedAddress)
        if (selectedAddress === wallet.address) {
          console.log('MATCH!!!')
        } else {
          console.log('SORRY!')
          setShowLedgerError(true)
        }
      } else setShowLedgerError(true)
    } catch (err) {
      reportError(8, false, err.message, err.stack)
      setUncaughtError(err.message)
    }
    setLedgerBusy(false)
    setAddressConfirmed(true)
    console.log('confirmed')
    alert('Yay! your address is verified')
  }

  const onViewChange = view => childView !== view && setChildView(view)

  const params = new URLSearchParams(router.query)
  const selectedAddress = params.toString().split('=')[1]
  if (selectedAddress !== wallet.address) {
    // setIsOpen(true)
    // alert('wrong address')
    // router.back()
    // router.replace('/')
    // window.location.reload()
  }
  return (
    <>
      <MsgConfirmer />
      {selectedAddress !== wallet.address ? (
        <>
          <Link
            href='/?address=null'
            as='/?address=null'
            onClick={() => window.location.reload()}
          >
            <a>Go back Home</a>
          </Link>
          <h1>Wrong address! ❌</h1>
        </>
      ) : (
        <>
          <Wrapper
            css={`
              /* Temp implementation to simplistically handle large scale displays. This should be removed and a more dynamic solution introduced e.g https://css-tricks.com/optimizing-large-scale-displays/  */
              max-width: 1440px;
              margin: 0 auto;
              min-height: 100vh;
            `}
          >
            {childView === SEND ? (
              <Content>
                <Send close={() => setChildView(MESSAGE_HISTORY)} />
              </Content>
            ) : (
              <>
                <Sidebar height='100vh'>
                  {hasLedgerError({ ...ledger, otherError: uncaughtError }) &&
                  showLedgerError ? (
                    <AccountError
                      onTryAgain={onShowOnLedger}
                      errorMsg={reportLedgerConfigError({
                        ...ledger,
                        otherError: uncaughtError
                      })}
                      mb={2}
                    />
                  ) : (
                    <AccountCard
                      onAccountSwitch={onAccountSwitch}
                      color='purple'
                      address={wallet.address}
                      walletType={wallet.type}
                      onShowOnLedger={onShowOnLedger}
                      ledgerBusy={ledgerBusy}
                      mb={2}
                    />
                  )}
                  <BalanceCard
                    balance={wallet.balance}
                    onSend={() => onViewChange(SEND)}
                    disableButtons={childView === SEND}
                  />
                  <ButtonLogout
                    variant='secondary'
                    width='100%'
                    mt={4}
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                    css={`
                      background-color: ${({ theme }) =>
                        theme.colors.core.secondary}00;
                      &:hover {
                        background-color: ${({ theme }) =>
                          theme.colors.core.secondary};
                      }
                    `}
                    onClick={() => window.location.reload()}
                  >
                    Logout
                    <Tooltip content='Logging out clears all your sensitive information from the browser and sends you back to the home page' />
                  </ButtonLogout>
                </Sidebar>
                <Content>
                  <Box
                    display='flex'
                    justifyContent='center'
                    maxWidth={16}
                    width='100%'
                  >
                    {childView === MESSAGE_HISTORY && <MessageView />}
                  </Box>
                </Content>
              </>
            )}
          </Wrapper>
        </>
      )}
    </>
  )
}

WalletView.propTypes = {
  accountAddresses: PropTypes.array
}

export default WalletView
