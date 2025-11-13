import React from 'react'
import Header from '../components/Header'
import CategoryMenu from '../components/CategoryMenu'
import Banner from '../components/Banner'
import TopServices from '../components/TopServices'

const Home = () => {
  return (
    <div>
      <Header />
      <CategoryMenu />
      <TopServices />
      <Banner />
    </div>
  )
}

export default Home