'use client'
const navItems = [
    {
        label: 'Home', href: '/'
    },
    {
        label: 'Companions', href: '/companions'
    },
    {
        label: 'My Journey', href: '/my-journey'
    }
]
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../lib/utils'

const NavItems = () => {
    const pathname = usePathname();
    console.log(pathname)


    return (
        <nav className='flex items-center gap-4'>

            {
                navItems.map(({ label, href }) => (
                    <Link href={href}
                        key={label}
                        className={cn(pathname === href ? 'text-primary font-semibold' : '')} >
                        {label}
                    </Link>
                ))

            }

        </nav>
    )
}

export default NavItems