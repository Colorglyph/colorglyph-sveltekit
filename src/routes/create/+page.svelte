<script lang="ts">
    import { countBy } from "lodash-es";
    import { onMount } from "svelte";
    import { writable, derived, type Writable } from "svelte/store";
    import HexGlyph from "@/components/Hexglyph.svelte";
    import { Keypair } from '@stellar/stellar-sdk'
    import { fetcher } from 'itty-fetcher'
    import { API_BASE, isFuture, isLocal, isTest } from "$lib/utils";

    const api = fetcher({base: API_BASE})

    const width = writable(16);
    const palette: Writable<string[]> = writable([]);

    let hash: string|null = null
    let json: any = null
    let minting: boolean = false

    const colors = derived(palette, (p) => {
        return Object.entries(countBy(p)).map(([hex, count]) => ({
            hex,
            count,
        }));
    });

    let color = "#000000";

    $: {
        if ($width > 40) width.set(40);
        else if (!$width || $width < 1) width.set(1);
    }

    onMount(() => {
        if (localStorage.hasOwnProperty("smol.xyz_createWidth"))
            width.set(
                Number(localStorage.getItem("smol.xyz_createWidth") || 0)
            );

        //   if (localStorage.hasOwnProperty('smol.xyz_createName'))
        //     name.set(localStorage.getItem('smol.xyz_createName'))

        //   if (localStorage.hasOwnProperty('smol.xyz_createDescription'))
        //     description.set(localStorage.getItem('smol.xyz_createDescription'))

        if (localStorage.hasOwnProperty("smol.xyz_createPalette"))
            palette.set(
                JSON.parse(
                    localStorage.getItem("smol.xyz_createPalette") || "[]"
                )
            );

        width.subscribe((w) => {
            localStorage.setItem("smol.xyz_createWidth", w.toString());

            palette.update((p) =>
                new Array(Math.pow(w, 2))
                    .fill("#ffffff")
                    .map((white, i) => p[i] || white)
            );
        });

        //   name.subscribe((n) => localStorage.setItem('smol.xyz_createName', n))
        //   description.subscribe((d) => localStorage.setItem('smol.xyz_createDescription', d))
        palette.subscribe((p) =>
            localStorage.setItem("smol.xyz_createPalette", JSON.stringify(p))
        );
    });

    function colorPixel(e: MouseEvent, i: number) {
        if (e.buttons === 1 || e.type === "mousedown") {
            if ($palette[i] === color)
                palette.update((p) => {
                    p[i] = "#ffffff";
                    return p;
                });
            else
                palette.update((p) => {
                    p[i] = color;
                    return p;
                });
        }
    }

    function erase() {
        localStorage.removeItem("smol.xyz_createPalette");
        palette.set(new Array(Math.pow($width, 2)).fill("#ffffff"));
    }

    async function mint() {
        json = null
        hash = null
        minting = true

        // TODO we've added the ability to separate out destinations from source accounts
        // so we should separate out the final destination of colors and glyphs from the source accounts that pay for and progressively mint them

        const secret = sessionStorage.getItem('secret')
        const kp = secret ? Keypair.fromSecret(secret) : Keypair.random() // Allows us to queue up a bunch of different mints. Otherwise we get into trouble with the progressive mint

        if (
            !secret
            && (
                isLocal
                || isFuture
                || isTest
            )
        ) {
            await fetch(
                isLocal ? `http://localhost:8000/friendbot?addr=${kp.publicKey()}`
                : isFuture ? `https://friendbot-futurenet.stellar.org?addr=${kp.publicKey()}`
                : `https://friendbot.stellar.org?addr=${kp.publicKey()}`
            )

            sessionStorage.setItem('secret', kp.secret())
        }

        await api.post('/mint', {
            palette: $palette.map((hex) => parseInt(hex.replace("#", ""), 16)),
            width: $width,
            secret: kp.secret()
        })
        .then((res: any) => {
            console.log(res)
            hash = res
            check()
        })
        .finally(() => minting = false)
    }
    async function check() {
        await api.get(`/mint/${hash}`)
        .then((res: any) => {
            console.log(res)
            json = res
        })
    }
</script>

<div class="flex flex-col items-start">
    <label class="flex items-center mb-2">
        <span class="mr-2">Width</span>
        <input
            class="w-24 h-8 border-2 border-gray active:border-blue-500 rounded px-2"
            type="number"
            bind:value={$width}
        />
    </label>

    <label class="flex items-center mb-2 relative">
        <span class="mr-2">Color</span>
        <div class="z-10 w-24 h-8 border-2 border-gray rounded relative">
            <div
                class="absolute rounded"
                style:top="2px"
                style:bottom="2px"
                style:left="2px"
                style:right="2px"
                style:background-color={color}
            />
        </div>
        <input
            class="z-20 absolute top-0 right-0 opacity-0"
            type="color"
            bind:value={color}
        />
    </label>

    <div class="flex max-w-full">
        <div class="w-full overflow-y-scroll">
            <ul
                class="flex flex-wrap"
                style:width="calc({$width} * 2rem)"
                style:box-shadow="inset -1px -1px 0 0 #e5e7eb"
            >
                {#each $palette as hex, i (i)}
                    <li
                        class="w-8 h-8"
                        style:background-color={/ffffff/gi.test(hex)
                            ? "transparent"
                            : hex}
                        style:box-shadow={`inset 1px 1px 0 0 ${
                            /ffffff/gi.test(hex) ? "#e5e7eb" : hex
                        }`}
                        on:mousedown={(event) => colorPixel(event, i)}
                        on:mouseenter={(event) => colorPixel(event, i)}
                    />
                {/each}
            </ul>

            <ul class="flex flex-wrap mt-2 sticky left-0 bottom-0">
                {#each $colors as { hex, count } (hex)}
                    <li
                        class="flex flex-col items-center"
                        on:click={() => (color = hex)}
                    >
                        <div
                            class="w-6 h-6"
                            style:background-color={hex}
                            style:box-shadow={`inset 0 0 0 1px ${
                                /ffffff/gi.test(hex) ? "#e5e7eb" : hex
                            }`}
                        />
                        <span class="text-sm">{count}</span>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="flex flex-col ml-4">
            <HexGlyph class="mb-2" palette={$palette} width={$width} px={128} />
            <HexGlyph class="mb-2" palette={$palette} width={$width} px={64} />
            <HexGlyph class="mb-2" palette={$palette} width={$width} px={32} />
        </div>
    </div>

    <!-- <label class="flex items-center mb-2">
        <span class="mr-2">Title</span>
        <input class="h-8 border-2 border-gray active:border-blue-500 rounded px-2" type="text" bind:value={$name}>
      </label>
    
      <label class="flex mb-2">
        <span class="mr-2">Story</span>
        <textarea class="border-2 border-gray active:border-blue-500 rounded px-2 py-1" style:min-height="5.25rem" rows="3" bind:value={$description}></textarea>
      </label> -->

    <div class="mt-2 flex">
        <button
            on:click={erase}
            class="mr-2 bg-black text-white py-1 px-2 rounded">Erase</button
        >
        <button
            on:click={mint}
            disabled={minting}
            class="mr-2 bg-black text-white py-1 px-2 rounded disabled:bg-gray-500">Mint</button
        >
        {#if hash}
            <button
                on:click={check}
                class="mr-2 bg-black text-white py-1 px-2 rounded">Check</button
            >
        {/if}
    </div>

    {#if json}
        <pre>{JSON.stringify(json, null, 2)}</pre>
    {/if}
</div> 