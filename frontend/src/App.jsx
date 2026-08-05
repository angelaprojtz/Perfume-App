import { useState } from 'react'
import './App.css'
import PerfumeSearch from './PerfumeSearch'
import PerfumeCollection from './PerfumeCollection'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs'
import "react-tabs/style/react-tabs.css"

function App() {

  return (
    <Tabs>
      <TabList>
        <Tab>Search Perfume</Tab>
        <Tab>My Perfume Collection</Tab>
      </TabList>

      <TabPanel>
        <PerfumeSearch/>
      </TabPanel>

      <TabPanel>
        <PerfumeCollection/>
      </TabPanel>

    </Tabs>
  )
}

export default App
