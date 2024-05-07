import { Redis } from "@upstash/redis/cloudflare"
import { Hono } from "hono"
import { env } from "hono/adapter"
import { cors } from "hono/cors"
import { handle } from "hono/vercel"

export const runtime = "edge"

const app = new Hono().basePath('/api')

app.use('/*',cors())

type EnvConfig = {
    UPSTASH_REDIS_TOKEN: string,
    UPSTASH_REDIS_URL: string,
}

let redis: Redis | null = null


app.get('/search', async (ctx) => {
    try {
        const {
            UPSTASH_REDIS_TOKEN,
            UPSTASH_REDIS_URL
        } = env<EnvConfig>(ctx)

        const startTimer = performance.now()

        if (!redis) {
            redis = new Redis({
                url: UPSTASH_REDIS_URL,
                token: UPSTASH_REDIS_TOKEN
            })
        }

        const query = ctx.req.query('q')?.toUpperCase()

        if (!query) {
            return ctx.json({
                message: 'Invalid search query'
            }, { status: 400 })
        }

        const res = []
        const rank = await redis.zrank('terms', query)

        if (rank !== null && rank !== undefined) {
            const temp = await redis.zrange<string[]>('terms', rank, rank + 100)
            for (const el of temp) {
                if (!el.startsWith(query)) {
                    break
                }
                if (el.endsWith('*')) {
                    res.push(el.substring(0, el.length - 1))
                }
            }
        }

        const endTimer = performance.now()
        console.log(res, endTimer - startTimer)

        return ctx.json({
            results: res,
            duration: endTimer - startTimer,
        })

    } catch (err) {
        console.error(err)
        return ctx.json({
            results: [],
            message: 'Internal server error'
        }, { status: 500 })
    }
})

export const GET = handle(app)
export default app as never