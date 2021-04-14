import PropTypes from 'prop-types'
import { WalletView } from '../components'

import RenderChildrenIfWalletConnected from '../lib/RequireWallet'
import useDesktopBrowser from '../lib/useDesktopBrowser'

function Send({ jsonData }) {
  useDesktopBrowser()
  return (
    <RenderChildrenIfWalletConnected>
      <WalletView accountAddresses={jsonData} />
    </RenderChildrenIfWalletConnected>
  )
}

Send.propTypes = {
  jsonData: PropTypes.array
}

export async function getStaticProps() {
  const res = await fetch(
    'https://random-testing-fmm.s3.us-west-2.amazonaws.com/accountAddresses.json'
  )
  const jsonData = await res.json()
  console.log('GSPPpagesidx', jsonData)
  return {
    props: {
      jsonData
    }
  }
}

export default Send
