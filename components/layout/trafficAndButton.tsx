import React from 'react'
import MainButton from '../sections/mainButton'
import CountData from '../sections/countData'
import StatistikMalware from '../sections/statistikMalware'
import StatistikJenisMalware from '../sections/statistikJenisMalware'

const TrafficAndButton = () => {
  return (
    <div className='w-full h-[300px] flex flex-row justify-end items-start gap-4 px-12'>
        <StatistikJenisMalware></StatistikJenisMalware>
        <StatistikMalware></StatistikMalware>
        <CountData></CountData>
        <MainButton></MainButton>
    </div>
  )
}

export default TrafficAndButton