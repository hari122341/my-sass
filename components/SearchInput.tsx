'use client'
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils';
// interface UrlQueryParams {
//     params: string;
//     key: string;
//     value: string;
// }
const SearchInput = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    // const topic = searchParams.get('topic') || '';
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(
        () => {
            // const debounce = setTimeout(() => {

            //     if (searchQuery) {
            //         const parms = { key: 'topic', value: searchQuery };
            //         const url = `?${parms.key}=${parms.value}`;

            //         router.push(url, { scroll: false })
            //     } else {
            //         if (pathname === '/companions') {
            //             // const parms = { key: ["topic"], value: searchParams.toString() };
            //             console.log("This is triggering i think so");
            //             router.push('/companions', { scroll: false });

            //             // router.push(newUrl, { scroll: false });
            //         }
            //     }
            // }, 500)
            const debounce = setTimeout(() => {
                if (searchQuery) {
                    const newUrl = formUrlQuery({
                        params: searchParams.toString(),
                        key: "topic",
                        value: searchQuery,
                    });

                    router.push(newUrl, { scroll: false });
                } else {
                    if (pathname === '/companions') {
                        const newUrl = removeKeysFromUrlQuery({
                            params: searchParams.toString(),
                            keysToRemove: ["topic"],
                        });

                        router.push(newUrl, { scroll: false });
                    }
                }
            }, 500)



        }

        , [searchQuery, router, searchParams, pathname]);


    return (
        <div className='relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit'>
            <Image
                src='/icons/search.svg'
                width={15}
                height={15}
                alt='search'
            />
            <input
                type="text"
                placeholder='search companions...'
                value={searchQuery}
                className='outline-none'
                onChange={
                    (e) => {
                        setSearchQuery(e.target.value);
                    }
                }

            />
        </div>
    )
}

export default SearchInput