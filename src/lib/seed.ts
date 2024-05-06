import { countryList } from "@/constants/countries";

import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

countryList.forEach((country)=>{
    const term = country.toUpperCase()
    const terms: {score: number, member: string}[] = []

    for(let i = 0; i<=term.length; i++){
        terms.push({
            score: 0,
            member: term.slice(0,i)
        })
    }
    terms.push({score: 0, member: term + '*'})

    const populateDB = async () => {
        // @ts-ignore
        redis.zadd('terms', ...terms.flat())
    }
    populateDB()

    console.log(`Seeded ${country}`)
})