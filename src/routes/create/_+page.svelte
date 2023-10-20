<script lang="ts">
    let white = 256 ** 3 - 1
    let pixels: number[] = new Array(16 ** 2).fill(0).map((_, i) => white)

    $: {
        localStorage.setItem('Colorglyph.v1.pixels', JSON.stringify(pixels))
    }

    function colorToHex(color: number) {
        const [r, g, b] = [
            color >> 16,
            color >> 8 & 0xff,
            color & 0xff
        ].map((rgb) => rgb.toString(16).padStart(2, '0'))

        return `#${r}${g}${b}`
    }
    function colorPixel(i: number) {
        if (pixels[i] === 255)
            pixels[i] = white
        else
            pixels[i] = 255

        pixels = pixels
    }
</script>

<div class="grid grid-cols-16 shadow-[inset_1px_1px_rgba(0,0,0,0.25)]" style="width: {16 * 20}px">
    {#each pixels as color, i}
        <div 
            class="bg-black shadow-[inset_-1px_-1px_rgba(0,0,0,0.25)]" 
            style="background-color: {colorToHex(color)}; height: {20}px; width: {20}px"
            on:click={() => colorPixel(i)}
        ></div>
    {/each}
</div>