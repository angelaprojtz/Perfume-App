import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import PerfumeSearch from './components/PerfumeSearch'
import PerfumeCollection from './components/PerfumeCollection'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs'
import "react-tabs/style/react-tabs.css"

export default function App() {

  return (
    <>
    < Header />
    <Tabs>
      <TabList>
        <Tab>Search Perfume</Tab>
        <Tab>My Perfume Collection</Tab>
      </TabList>

      <TabPanel>
        < PerfumeSearch />
      </TabPanel>

      <TabPanel>
        < PerfumeCollection />
      </TabPanel>

    </Tabs>    
    </>
  )
}