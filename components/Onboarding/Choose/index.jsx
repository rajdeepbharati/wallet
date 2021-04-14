import React, { useEffect, useState } from 'react'
import { Radio, RadioGroup, Stack, HStack, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import PropTypes from 'prop-types'
import { createHash } from 'crypto'
import {
  Box,
  IconLedger,
  Text,
  Title,
  Header,
  Button,
  Warning,
  NetworkSwitcherGlyph
} from '../../Shared'
import HeaderGlyph from '../../Shared/Glyph/HeaderGlyph'
import ImportWallet from './Import'
import CreateWallet from './Create'
import {
  LEDGER,
  IMPORT_MNEMONIC,
  CREATE_MNEMONIC,
  IMPORT_SINGLE_KEY
} from '../../../constants'
import { useWalletProvider } from '../../../WalletProvider'
import ExpandableBox from './ExpandableBox'

function ChooseWallet({ jsonData, accountAddresses }) {
  const { setWalletType } = useWalletProvider()
  // this could be cleaner, but we use this to more easily navigate to/from the warning card
  const [localWalletType, setLocalWalletType] = useState(null)
  const [accountAddrs, setAccountAddrs] = useState(accountAddresses)
  const [selectedAccountAddress, setSelectedAccountAddress] = useState(null)
  const [value, setValue] = React.useState('1')

  const router = useRouter()

  useEffect(() => {
    // Update the document title using the browser API
    // document.title = `Selected account is: ${value}`
    router.replace(`${router.pathname}?address=${value}`)
  })

  const onChoose = type => {
    if (
      !localWalletType &&
      (type === CREATE_MNEMONIC ||
        type === IMPORT_MNEMONIC ||
        type === IMPORT_SINGLE_KEY)
    ) {
      setLocalWalletType(type)
    } else if (localWalletType) {
      setWalletType(localWalletType)
    } else {
      setWalletType(type)
    }
  }

  const setSelectedAccount = val => {
    setSelectedAccountAddress(val)
    // router.push(`/miner/${val}`)
  }

  const [phishingBanner, setPhishingBanner] = useState(true)
  const items = []

  // <button
  //   type='button'
  //   key={String(k) + String(v)}
  //   onClick={() => setSelectedAccount(v)}
  // >
  //   {v}
  // </button>
  accountAddresses.forEach(v => {
    items.push(<Radio value={v}>{v}</Radio>)
  })
  return (
    <>
      {localWalletType ? (
        <Warning
          title='Warning'
          description='We do not recommend you use this account to hold or transact significant sums of Filecoin. This account is for testing purposes only. For significant sums, Glif should only be used with a Ledger hardware wallet.'
          linkDisplay="Why isn't it secure?"
          linkhref='https://coinsutra.com/security-risks-bitcoin-wallets/'
          onBack={() => setLocalWalletType(null)}
          onAccept={onChoose}
        />
      ) : (
        <Box
          display='flex'
          flexWrap='wrap'
          minHeight='90vh'
          maxWidth='1440px'
          justifyContent='center'
          flexGrow='1'
        >
          {!phishingBanner && (
            <Box
              position='absolute'
              display='block'
              top='0'
              backgroundColor='status.warning.background'
              width='100%'
              minHeight={6}
              px={3}
              py={[2, 2, 0]}
              zIndex={5}
              borderBottomLeftRadius={1}
              borderBottomRightRadius={1}
            >
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-around'
                maxWidth='1440px'
              >
                <Text
                  mt={3}
                  lineHeight='140%'
                  m={0}
                  color="'status.warning.foreground'"
                >
                  For your protection, please check your browser&apos;s URL bar
                  that you&apos;re visiting https://wallet.glif.io
                </Text>
                <Button
                  justifySelf='flex-end'
                  variant='tertiary'
                  title='Close'
                  color='core.black'
                  mx={2}
                  border={0}
                  p={0}
                  onClick={() => setPhishingBanner(true)}
                >
                  CLOSE
                </Button>
              </Box>
            </Box>
          )}
          <Box
            display='flex'
            flexWrap='wrap'
            alignItems='flex-start'
            justifyContent='space-around'
            flexGrow='1'
            marginTop={[8, 7]}
          >
            <Box
              display='flex'
              maxWidth={13}
              width={['100%', '100%', '40%']}
              flexDirection='column'
              alignItems='flex-start'
              alignContent='center'
              mb={4}
            >
              <Box
                display='flex'
                flexDirection='column'
                mt={[2, 4, 4]}
                alignSelf='center'
                textAlign='left'
              >
                <Header fontSize={5}>Filecoin Miner Marketplace</Header>
                <Title mt={3} color='core.darkgray'>
                  Authenticate your owner address and become a verified miner!
                </Title>
                <ul>
                  <RadioGroup onChange={setValue} value={value}>
                    <Stack direction='column'>{items}</Stack>
                  </RadioGroup>
                </ul>
                <ImportWallet
                  onClick={() => onChoose(LEDGER)}
                  Icon={IconLedger}
                  title='Claim account via Ledger Device'
                  tag='Most Secure'
                  display='flex'
                  justifyContent='space-between'
                  flexDirection='column'
                  my={4}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

ChooseWallet.propTypes = {
  jsonData: PropTypes.array,
  accountAddresses: PropTypes.array
}

export default ChooseWallet
