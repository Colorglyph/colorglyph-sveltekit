<script lang="ts">
    import { fetcher } from "itty-fetcher";
    import { onMount } from "svelte";
    import { API_BASE } from "$lib/utils";

    const api = fetcher({ base: API_BASE });

    interface Glyph {
        name: string;
        metadata: {
            id: string;
            fee: string;
            status: string;
            width: number;
            length: number;
            mishash: string;
        };
    }

    let glyphs: Glyph[] = [];

    onMount(() => {
        getGlyphs();
    });

    async function getGlyphs() {
        await api.get("/glyphs").then((res: any) => {
            console.log(res);
            res.forEach((glyph: Glyph) => {
                if (glyph.metadata.length)
                    console.log(
                        glyph.metadata.width,
                        glyph.metadata.length,
                        glyph.metadata.fee,
                    );
            });
            glyphs = res;
        });
    }
    async function getStatus(glyph: Glyph) {
        console.log(glyph);

        await api.get(`/mint/${glyph.metadata.id}`).then((res: any) => {
            console.log(res);
            glyph.metadata.status = res.status ?? glyph.metadata.status;
            glyphs = glyphs;
        });
    }
</script>

<div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1">
    {#each glyphs as glyph}
        <div class="relative" on:click={() => getStatus(glyph)}>
            <span
                class="w-3 h-3 rounded-full absolute top-1 left-1 border-2 border-white {glyph
                    .metadata.status === 'mining'
                    ? 'bg-red-500'
                    : glyph.metadata.status === 'minting'
                      ? 'bg-yellow-500'
                      : glyph.metadata.status === 'complete' ||
                          glyph.metadata.status === 'minted'
                        ? 'bg-green-500'
                        : 'bg-black'}"
            ></span>
            <img
                class="w-full rendering-pixelated"
                src="{API_BASE}/image/{glyph.name}"
            />
        </div>
    {/each}
</div>
