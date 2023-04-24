import axios from "@/common/api/axios"
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Home() {
  const router = useRouter();
  // useEffect(()=>{
  //   router.push('/auth/login');
  // },[])
  return (
    <>
      <h1 className="text-3xl font-bold underline ">
       
      </h1>
    </>
  )
}
