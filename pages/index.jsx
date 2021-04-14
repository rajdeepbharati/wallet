import React, { useEffect, useState } from 'react'
// import { BrowserRouter as Router, Switch, Route } from 'next/link'
import Link from 'next/link'
import PropTypes from 'prop-types'
import axios from 'axios'

import useDesktopBrowser from '../lib/useDesktopBrowser'
import { Onboard } from '../components'

export default function Main({ jsonData }) {
  useDesktopBrowser()
  const [accountAddrs, setAccountAddrs] = useState(jsonData)

  return (
    <div>
      <Onboard accountAddresses={jsonData} />
    </div>
  )
}

Main.propTypes = {
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
