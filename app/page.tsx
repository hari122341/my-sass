import React from 'react'
// import { Button } from '@/components/ui/button'
import CompanionCard from '@/components/CompanionCard'
import CompanionsList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
import { recentSessions } from '@/constants'
import { getAllCompanions, getRecentSessions } from '@/lib/actions/companion.actions'
import { getSubjectColor } from '@/lib/utils'
const Page = async () => {
  const companions = await getAllCompanions({ limit: 3 });
  // console.log("Companions: in page", companions);
  const recentSessionsCompanions = await getRecentSessions(10);
  const recentSessionsCompanions1 = recentSessionsCompanions.map(({ companions }) => {
    return companions;

  })
  // console.log("Companions: asdfsd", recentSessionsCompanions);
  return (
    <main>
      <h1 className='text-2xl underline'>Welcome to my Sass App</h1>
      {/* <Button>This is a button</Button> */}


      <section className='flex gap-4 justify-between items-start w-full max-lg:flex-col-reverse max-lg:items-center'>

        {
          companions.map(
            (companion) => (

              <CompanionCard
                key={companion.id}
                // id={companion.id}
                {...companion}
                color={
                  getSubjectColor(companion.subject)
                }
              />
            )


          )
        }

      </section>

      <section className='flex gap-4 justify-between items-start w-full max-lg:flex-col-reverse max-lg:items-center'>
        <CompanionsList
          title="Recently completed sessions"
          companions={recentSessionsCompanions}
          classNames='w-2/3 max-lg:w-full'
        />
        <CTA />


      </section>

    </main>
  )
}

export default Page