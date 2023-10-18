<script lang="ts">
    import { fetcher } from 'itty-fetcher'
    import { onMount } from 'svelte'
    import { PUBLIC_API_BASE } from '$env/static/public'

    const api_url = PUBLIC_API_BASE
    const api = fetcher({base: api_url})

    interface Glyph {
        name: string
        metadata: {
            id: string,
            status: string
        }
    }

    let glyphs: Glyph[] = [] 

    onMount(() => {
        getGlyphs()
    })

    async function getGlyphs() {
        await api.get('/glyphs')
        .then((res: any) => {
            console.log(res)
            glyphs = res
        })
    }
    async function getStatus(glyph: Glyph) {
        await api.get(`/mint/${glyph.metadata.id}`)
        .then((res: any) => {
            console.log(res)
            glyph.metadata.status = res.status
            glyphs = glyphs
        })
    }
</script>

<div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1">
    {#each glyphs as glyph }
        <div class="relative" on:click={() => getStatus(glyph)}>
            <span class="w-3 h-3 rounded-full absolute top-1 left-1 border-2 border-white {
                glyph.metadata.status === 'mining'
                ? 'bg-red-500'
                : glyph.metadata.status === 'minting'
                ? 'bg-yellow-500'
                : glyph.metadata.status === 'complete'
                ? 'bg-green-500'
                : 'bg-black' 
            }"></span>
            <img class="w-full rendering-pixelated" src="{api_url}/image/{glyph.name}">
        </div>
    {/each}
</div>