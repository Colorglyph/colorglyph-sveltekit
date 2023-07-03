<script lang="ts">
  import * as ColorglyphSDK from 'colorglyph-sdk'
  import type { Option, OfferType, AssetAmount } from 'colorglyph-sdk'

  const ME = "GCNDTLR5X5N224AHCWCF4ICK4FVRPDE6HRWU66ILPID35O743L5TDNL5"
  const THEM = "GASU7EZDR4AT5S7QPL6W6JLUTYP7YWN5MV7UEEPVKNC6CCXI76GDV6P6" // SAFKQS3KC3WZBFJ5T2Q6OQFUDNLY6CZ4KZPQ2SIXLWDISIOPW456UPUA
  const GLYPH = '40567bc4bf9722ea23f49ff8ff5d521d5fb8b91e9ed68a7390aa592260f28389'
  const XLM = "CDMT6XD3WDV4JKOI64T4LTV4JZARSTJYEV7B2DMRANLLIO74KKEBHYNJ" // d93f5c7bb0ebc4a9c8f727c5cebc4e41194d38257e1d0d910356b43bfc528813

  // TODO
  // colors_transfer `colors` arg is broken
  // offer_* `sell` and `buy` args are broken

  async function colors_mine() { // all ✅
    let res = await ColorglyphSDK.colors_mine({
      miner: ME,
      to: null as unknown as Option<string>,
      colors: [[0, 100], [16777215, 100]]
    }, {signAndSend: true, fee: 1_000_000})
    
    console.log(res);
  }

  async function colors_transfer() { // all ✅
    let res = await ColorglyphSDK.colors_transfer({
      from: ME,
      to: THEM,
      colors: [[ME, 0, 1], [ME, 16777215, 1]]
    }, {signAndSend: true, fee: 1_000_000})
    
    console.log(res);
  }

  async function color_balance() { // all ✅
    let res = await ColorglyphSDK.color_balance({
      owner: ME,
      miner: null as unknown as Option<string>,
      color: 0
    })
    
    console.log(res);
  }

  async function glyph_mint() { // submit ✅ // return ❌
    let res = await ColorglyphSDK.glyph_mint({
      minter: ME,
      to: null as unknown as Option<string>,
      colors: [[ME, [[0, [1, 3]], [16777215, [0, 2]]]]],
      width: 2
    }, {signAndSend: true, fee: 1_000_000})
    
    console.log(res);
  }

  async function glyph_get() { // all ✅
    let res = await ColorglyphSDK.glyph_get({
      hash: Buffer.from(GLYPH, 'hex')
    })
    
    console.log(res);
  }

  async function offer_post() { // submit ✅ // return ❌
    let res = await ColorglyphSDK.offer_post({
      seller: ME,
      sell: {
        tag: "Glyph",
        values: [Buffer.from(GLYPH, 'hex')]
      },
      buy: {
        tag: "Asset",
        values: [{0: XLM, 1: BigInt(100)}]
      },
    }, {signAndSend: true, fee: 1_000_000})
    
    console.log(res);
  }

  async function offers_get() { // all ✅
    let res = await ColorglyphSDK.offers_get({
      sell: {
        tag: "Glyph",
        values: [Buffer.from(GLYPH, 'hex')]
      },
      buy: {
        tag: "Asset",
        values: [{0: XLM, 1: BigInt(100)}]
      },
    })
    
    console.log(res);
  }

  async function offer_delete() { // all ✅
    let res = await ColorglyphSDK.offer_delete({
      seller: ME,
      sell: {
        tag: "Glyph",
        values: [Buffer.from(GLYPH, 'hex')]
      },
      buy: {
        tag: "Asset",
        values: [{0: XLM, 1: BigInt(100)}]
      },
    }, {signAndSend: true, fee: 1_000_000})
    
    console.log(res);
  }

  async function glyph_scrape() { // all ✅
    let res = await ColorglyphSDK.glyph_scrape({
      owner: ME,
      to: null as unknown as Option<string>,
      hash: Buffer.from(GLYPH, 'hex')
    }, {signAndSend: true, fee: 1_000_000})
    
    console.log(res);
  }
</script>

<div class="flex flex-col max-w-xs [&>*]:mb-1">
  <button class="bg-black text-white" on:click={() => colors_mine()}>Colors Mine</button>
  <button class="bg-black text-white" on:click={() => colors_transfer()}>Colors Transfer</button>
  <button class="bg-black text-white" on:click={() => color_balance()}>Color Balance</button>

  <button class="bg-black text-white" on:click={() => glyph_mint()}>Glyph Mint</button>
  <button class="bg-black text-white" on:click={() => glyph_get()}>Glyph Get</button>

  <button class="bg-black text-white" on:click={() => offer_post()}>Offer Post</button>
  <button class="bg-black text-white" on:click={() => offers_get()}>Offers Get</button>
  <button class="bg-black text-white" on:click={() => offer_delete()}>Offer Delete</button>

  <button class="bg-black text-white" on:click={() => glyph_scrape()}>Glyph Scrape</button>
</div>