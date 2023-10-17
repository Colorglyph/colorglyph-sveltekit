<script lang="ts">
	import { generateRandomSpectrum } from "$lib/utils"
    import { fetcher } from 'itty-fetcher'
    import { PUBLIC_API_BASE } from '$env/static/public'

    const api = fetcher({base: PUBLIC_API_BASE})

    let width: number = 9
	let palette: number[] = []
    let hash: string|null = null
    let json: any = null

    $: {
        width
        generatePalette()
    }

    generatePalette()

    function generatePalette() {
        palette = generateRandomSpectrum(width)
    }

    async function mint() {
        json = null
        await api.post('/mint', {
            palette,
            width,
            secret: 'SCIG6EFQNNZK3DHVDCY3DEINZFPMSG5HEJNYJTUTCB5BB32WEFQ3N6BI' // GBVRCCODAXSSO54KIGIKPI537U6OR3G2PT3Z4MALYZXILW7RALKHFR2Z
        })
        .then((res: any) => {
            console.log(res)
            hash = res
            getStatus()
        })
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
    <button class="bg-red-500 text-white" on:click={mint}>Mint</button>
    {#if hash}
        <button class="bg-black text-white" on:click={getStatus}>Get Status</button>
    {/if}
    <pre>{JSON.stringify(json, null, 2)}</pre>
</div>