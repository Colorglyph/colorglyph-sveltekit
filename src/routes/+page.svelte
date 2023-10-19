<script lang="ts">
	import { generateRandomSpectrum } from "$lib/utils"
    import { fetcher } from 'itty-fetcher'
    import { PUBLIC_API_BASE } from '$env/static/public'
    import { Keypair } from 'soroban-client'

    const api = fetcher({base: PUBLIC_API_BASE})

    let width: number = 9
    let detail: number = 2
	let palette: number[] = []
    let hash: string|null = null
    let json: any = null 
    let minting: boolean = false

    $: {
        detail = Math.min(detail, width)
        generatePalette()
    }

    generatePalette()

    function generatePalette() {
        palette = generateRandomSpectrum(width, detail)
    }

    async function mint() {
        json = null
        minting = true

        // TODO we've added the ability to separate out destinations from source accounts
        // so we should separate out the final destination of colors and glyphs from the source accounts that pay for and progressively mint them

        const kp = Keypair.random() // Allows us to queue up a bunch of different mints. Otherwise we get into trouble with the progressive mint

        await fetch(`https://friendbot-futurenet.stellar.org/?addr=${kp.publicKey()}`)

        await api.post('/mint', {
            palette,
            width,
            secret: kp.secret()
        })
        .then((res: any) => {
            console.log(res)
            hash = res
            getStatus()
        })
        .finally(() => minting = false)
    }
    async function getStatus() {
        await api.get(`/mint/${hash}`)
        .then((res: any) => {
            console.log(res)
            json = res
        })
    }
</script>

<div class="flex flex-col max-w-xs [&>*]:mb-1">
    <label>
        <input type="range" min="1" max="40" bind:value={width}>
        {width}
    </label>
    <label>
        <input type="range" min="1" max="{width}" bind:value={detail}>
        {detail}
    </label>
    
    <div class="flex flex-col max-w-xs [&>*]:mb-1">
        <ul class="flex flex-wrap border border-black" style:width="calc({width} * 16px + 2px)">
            {#each palette as color}
                <li
                    style:width="16px"
                    style:height="16px"
                    style:background-color="#{color.toString(16).padStart(6, '0')}"
                />
            {/each}
        </ul>
    </div>
    
    <button class="bg-black text-white" on:click={generatePalette}>New Palette</button>
    <button class="bg-red-500 text-white" on:click={mint}>{minting ? '...' : 'Mint'}</button>
    {#if hash}
        <button class="bg-black text-white" on:click={getStatus}>Get Status</button>
    {/if}
    <pre>{JSON.stringify(json, null, 2)}</pre>
</div>