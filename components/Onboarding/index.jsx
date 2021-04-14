import React, { useState } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
// import { BrowserRouter as Router, Switch, Route } from 'next/link'
// import Link from 'next/link'
import ChooseWallet from './Choose'
import ConfigureWallet from './Configure'
import { Box, NodeConnectingGlyph } from '../Shared'
import useWallet from '../../WalletProvider/useWallet'

// export async function getStaticProps() {
//   const res = await fetch(
//     'https://random-testing-fmm.s3.us-west-2.amazonaws.com/accountAddresses.json'
//   )
//   const jsonData = await res.json()
//   console.log('GSPPonboarding', jsonData)
//   return {
//     props: {
//       jsonData
//     }
//   }
// }

function Onboard({ jsonData, accountAddresses }) {
  const wallet = useWallet()
  const router = useRouter()
  const [nodeConnecting, setNodeConnecting] = useState(true)
  return (
    <>
      <Box
        display='flex'
        minHeight='100vh'
        justifyContent='center'
        alignContent='center'
        padding={[2, 3, 5]}
      >
        {nodeConnecting && (
          <NodeConnectingGlyph
            apiAddress={process.env.LOTUS_NODE_JSONRPC}
            onConnectionStrengthChange={newStrength => {
              // give a little extra time
              setTimeout(() => {
                if (newStrength === 2) setNodeConnecting(false)
                if (newStrength === 0 || newStrength === 1)
                  router.replace('/error/node-disconnected')
              }, 750)
            }}
          />
        )}
        {!nodeConnecting &&
          (wallet.type ? (
            <ConfigureWallet walletType={wallet.type} />
          ) : (
            <ChooseWallet accountAddresses={accountAddresses} />
          ))}
      </Box>
    </>
  )
}

Onboard.propTypes = {
  jsonData: PropTypes.array,
  accountAddresses: PropTypes.array
}

export default Onboard
