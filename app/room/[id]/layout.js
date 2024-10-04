'use client'

import { useAppContext } from "@/lib/AppContext"
import { useRouter } from "next/navigation"

export default function RoomLayout({ children }){
    const {user, loading} = useAppContext()
    const router  = useRouter()

    if (loading) return <p>Loading...</p>


    if(!user) {
        router.push('/login')
    }

    
    return children
  }