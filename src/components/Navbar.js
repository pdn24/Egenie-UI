import React from 'react'
import EgenieLogo from '../assets/icons/EgenieLogo.svg'
import manuIcon from '../assets/icons/manuIcon.png'

export default function Navbar() {
    return (
        <div className='block md:hidden'>
            <div className='flex justify-between bg-black p-5 items-center'>
                <img src={EgenieLogo} width="75px" alt='icon' />
                <button className='te'>
                    <img src={manuIcon} alt='icon' />
                </button>
            </div>
        </div>
    )
}
