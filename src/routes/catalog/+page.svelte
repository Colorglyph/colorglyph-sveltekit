<script lang="ts">
    import { fetcher } from "itty-fetcher";
    import { onMount } from "svelte";
    import { API_BASE } from "$lib/utils";

    const api = fetcher({ base: API_BASE });

    interface Glyph {
        Hash: string;
    }

    let glyphs: Glyph[] = [];

    onMount(() => {
        getGlyphs();
    });

    async function getGlyphs() {
        await api.get("/glyphs").then((res: any) => {
            console.log(res);
            glyphs = res;
        });
    }
</script>

<div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1">
    {#each glyphs as glyph}
        <div class="relative">
            <!-- <span
                class="w-3 h-3 rounded-full absolute top-1 left-1 border-2 border-white {glyph
                    .metadata.status === 'mining'
                    ? 'bg-red-500'
                    : glyph.metadata.status === 'minting'
                      ? 'bg-yellow-500'
                      : glyph.metadata.status === 'complete' ||
                          glyph.metadata.status === 'minted'
                        ? 'bg-green-500'
                        : 'bg-black'}"
            ></span> -->
            <img
                class="w-full rendering-pixelated"
                src="{API_BASE}/image/{glyph.Hash}"
            />
        </div>
    {/each}
</div>
