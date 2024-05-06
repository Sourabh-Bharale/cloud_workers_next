'use client'

import { useEffect, useState } from "react";

export default function Home() {
  const [searchQuery,setSearchQuery] = useState<string>('')
  const [searchResults,setSearchResults] = useState<{
    results: string[]
    duration: number
  }>()

  useEffect(()=>{
    const fetchData = async () => {
      if(!searchQuery) return setSearchResults(undefined)

      const res = await fetch(`/api/search?q=${searchQuery}`)
    }
    fetchData()
  },[searchQuery])

  return (
    <div>
      <input value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="search countries"/>
    </div>
  );
}
