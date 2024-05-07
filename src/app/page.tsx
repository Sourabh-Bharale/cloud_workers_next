'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useEffect, useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<{
    results: string[]
    duration: number
  }>()

  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery) return setSearchResults(undefined)

      if(!process.env.NEXT_PUBLIC_BASE_URL) console.error('NEXT_PUBLIC_BASE_URL is not defined')

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/search?q=${searchQuery}`)
      const data = (await res.json()) as {
        results: string[]
        duration: number
      }
      setSearchResults(data)
    }
    fetchData()
  }, [searchQuery])

  return (
    <div className="flex flex-col w-full h-[100vh] justify-center items-center">
      <h1>An optimized and fast API demonstartion using cloudflare workers & redis</h1>
      <div className="flex w-full max-w-md">
      <Command className="rounded-lg border shadow-md">
        <CommandInput value={searchQuery} onValueChange={setSearchQuery} placeholder="search countries" />
        <CommandList>
          {
            searchResults?.results.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )
          }
          {
            searchResults?.results && (
              <CommandGroup heading="Results">
                {
                  searchResults?.results.map((result: string, index) => (
                    <CommandItem
                      key={index}
                      value={result}
                      onSelect={setSearchQuery}>
                      {result}
                    </CommandItem>
                  ))
                }
              </CommandGroup>
            )
          }
          <CommandSeparator />
        </CommandList>
          {
            searchResults?.results ? (
              <div className="text-xs text-left text-muted-foreground px-2 py-1">
                fetched {searchResults.results.length} records in {searchResults.duration}ms
              </div>
            ):null
          }
      </Command>
      </div>
    </div>
  );
}
