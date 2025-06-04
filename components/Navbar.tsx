import React from 'react'
import Link from 'next/link'
import NavItems from './NavItems'
import Image from 'next/image'
const Navbar = () => {
    return (
        <nav className='flex items-center justify-between mx-auto w-full px-14 py-4 bg-white max-sm:px-4'>
            <Link href="/">
                <div className='flex items-center gap-2.5 cursor-pointer'>
                    <Image
                        src="/images/logo.svg"
                        alt="logo"
                        width={46}
                        height={44}


                    />


                </div>

            </Link>
            <div className='flex items-center gap-8'>
                {/* <p>Home</p>
                <p>Companions</p>
                <p>My Journey</p>*/}
                <NavItems />
                <p>Sign In</p>

            </div>
        </nav>
    )
}

export default Navbar