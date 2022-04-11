import React, {useState} from 'react';
import { injectedConnector } from './abi';
import { ABI_TEST } from './abi/erc20_abi';
import {useWeb3React} from '@web3-react/core';
import { Contract } from './type/contract';
import { ethers } from 'ethers';

const contrack_TEST: Contract = {
  addr: '0x0b08f228031758dd6375158f4e26e803176b3ac6',
  abi: ABI_TEST
}

const App = () => {
  const {active, account, library, connector, activate, deactivate} = useWeb3React();
  
  const connect = async(type: string) => {
    if(active) {
      deactivate();
      return;
    }

    try {
      if(type == 'metamask') {
        await activate(injectedConnector);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWaller = async(type: string) => {
    if (type === 'metamask') {
      await connect('metamask')
    }
  }

  const getBalance = async() => {
    try {
      const gasPrice = await library.getGasPrice();
      console.log(gasPrice)
      let balance = await abi().balanceOf(account, {
        gasPrice,
        gasLimit: 40000
      })
      return balance.toString();
    } catch(err) {
      console.log(err)
    }
  }
  
  const abi = () => {
    const signer = library?.getSigner(account).connectUnchecked();
    const test = new ethers.Contract(
      contrack_TEST.addr,
      contrack_TEST.abi,
      signer
    )
    return test;
  }
  return (
    <>
      <h1 style={{marginBottom:'30px', textAlign:'center'}}>web3</h1>
      <div style={{display:'flex', justifyContent:'center'}}>
        <button onClick={() => connectWaller('metamask')}>{account?"끊기":"연결"}</button>
      </div>
      <div>your account : {account}</div>
      <button onClick={getBalance}>abi</button>
    </>
  )
}

export default App