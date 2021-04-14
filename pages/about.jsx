import React from 'react'
// import { BrowserRouter as Router, Switch, Route } from 'next/link'
import Link from 'next/link'

import useDesktopBrowser from '../lib/useDesktopBrowser'
import { Onboard } from '../components'

export default () => {
  useDesktopBrowser()
  return (
    <div>
      <Link href='/about'>
        <a>About</a>
      </Link>
      <Link href='/'>
        <a>Home</a>
      </Link>
      <Onboard />
    </div>
  )
}
