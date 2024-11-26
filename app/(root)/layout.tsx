import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'
import React from 'react'
import { Toaster } from '@/components/ui/toaster'
export const dynamic = "force-dynamic";
const layout = async({children}:{children: React.ReactNode}) => {
    const currentUser = await getCurrentUser()
    if(!currentUser){
        return redirect('/sign-in');
    }
  return (
    <main className='flex h-screen'>
        <Sidebar {...currentUser}></Sidebar>
        <section className='flex h-full flex-1 flex-col'>
            <MobileNavigation {...currentUser}></MobileNavigation>
            <Header userId={currentUser.$id} accountId={currentUser.accountId}></Header>
            <div className='main-content'>{children}</div>
        </section>
        <Toaster/>
    </main>
  )
}

export default layout