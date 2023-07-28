<script lang="ts">
	import * as ColorglyphSDK from 'colorglyph-sdk';
	import { xdr } from 'soroban-client';

	const ME = 'GAN352WSXTCDDTQEMJEVLT6B4LMUIGWIPBINRI3LUHAATKD72UAQYL5W';
	const THEM = 'GDAYVCINVNUZ57EOCN4FK2VVWGQ3L3NW37L6UJLZCK3C7S7CNSS5EHHG';
	const GLYPH = 'e0919f95076048768a673d245276a1f37e9c5cd1397de1a4dfe6d3626dc5d4ee';
	const XLM = 'CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT'; // d93f5c7bb0ebc4a9c8f727c5cebc4e41194d38257e1d0d910356b43bfc528813

	// GCSADM5WWPYAUBOW6WWQZEM4VPZJW22D3ZAQEC52R24G5BG2X5ZTP45C
	// SATWOJISXJXVKS7IMXFPA4WJALXEYCBSIWEOFQCW2NG7ALTSZVEJ3WN6

	// TODO
	// glyph_mint & offer_post return values are broken https://github.com/stellar/soroban-tools/issues/739

	let width: number = 0;
	let palette: number[] = [];

	palette = generateRGBSpectrum();
	width = 16;

	// let colors = new Array(17).fill(0).map(() => Math.floor(Math.random() * (255 ** 3)))
	// let colors = new Array(17).fill(0).map((_, i) => i + 1)

	function generateRGBSpectrum() {
		const colorArray = [];
		const steps = 16;

		for (let i = 0; i < steps; i++) {
			for (let j = 0; j < steps; j++) {
				const red = Math.floor(255 - (i * 255) / steps);
				const green = Math.floor(255 - (j * 255) / steps);
				const blue = Math.floor((i * j * 255) / (steps * steps));

				const colorValue = red * Math.pow(256, 2) + green * 256 + blue;
				colorArray.push(colorValue);
			}
		}

		return colorArray;
	}

	async function colors_mine() {
		// ✅
		let res = await ColorglyphSDK.colorsMine(
			{
				miner: ME,
				to: undefined,
				colors: new Map(new Array(17).fill(0).map((_, i) => [i, 1000]))
			},
			{ responseType: 'full', fee: 1_000_000 }
		);

		console.log(res);
	}

	async function colors_transfer() {
		// ✅
		let res = await ColorglyphSDK.colorsTransfer(
			{
				from: ME,
				to: THEM,
				colors: [
					[ME, 0, 1],
					[ME, 1, 1]
				]
			},
			{ responseType: 'full', fee: 1_000_000 }
		);

		console.log(res);
	}

	async function color_balance() {
		// ✅
		let res = await ColorglyphSDK.colorBalance({
			owner: ME,
			miner: undefined,
			color: 0
		});

		console.log(res);
	}

	let indexes = new Map<number, number[]>();
	indexes.set(0, [0, 1]);
	indexes.set(1, [2, 3]);

	let colors: Map<string, Map<number, number[]>> = new Map();
	colors.set(ME, indexes);

	async function glyph_mint() {
		// submit ✅ // return ❌
		let res = await ColorglyphSDK.glyphMint(
			{
				minter: ME,
				to: undefined,
				colors,
				width: 2,
				id: undefined
			},
			{
				responseType: 'full',
				fee: 1_000_000
			}
		);

		console.log(res);
	}

	async function glyph_get() {
		// TODO switch to use getLedgerEntry

		let glyph = await ColorglyphSDK.glyphGet({
			hash_id: {
				tag: 'Hash',
				values: [Buffer.from(GLYPH, 'hex')]
			} as ColorglyphSDK.HashId
		});

		glyph = glyph.value[1];

		width = glyph.width;

		for (const [color, indexes] of Object.entries(glyph.colors.get(ME))) {
			palette.push(Number(color));
		}

		palette = palette;
	}

	async function offer_post(address: string) {
		// submit ✅ // return ❌
		const sell = {
			tag: 'Glyph',
			values: [Buffer.from(GLYPH, 'hex')]
		} as ColorglyphSDK.OfferType;
		const buy = {
			tag: 'Asset',
			values: [XLM, BigInt(100)]
		} as ColorglyphSDK.OfferType;

		let res = await ColorglyphSDK.offerPost(
			{
				seller: address,
				sell: address === ME ? sell : buy,
				buy: address === ME ? buy : sell
			},
			{ responseType: 'full', fee: 1_000_000 }
		);

		console.log(res);
	}

	async function offers_get() {
		// all ✅
		// TODO switch to use getLedgerEntry
	}

	async function offer_delete() {
		// all ✅
		let res = await ColorglyphSDK.offerDelete(
			{
				seller: ME,
				sell: {
					tag: 'Glyph',
					values: [Buffer.from(GLYPH, 'hex')]
				},
				buy: {
					tag: 'Asset',
					values: [XLM, BigInt(100)]
				}
			},
			{ responseType: 'full', fee: 1_000_000 }
		);

		console.log(res);
	}

	async function glyph_scrape() {
		// all ✅
		let res = await ColorglyphSDK.glyphScrape(
			{
				owner: ME,
				to: undefined,
				hash_id: {
					tag: 'Hash',
					values: [Buffer.from(GLYPH, 'hex')]
				} as ColorglyphSDK.HashId
			},
			{ responseType: 'full', fee: 1_000_000 }
		);

		console.log(res);
	}

	async function super_mint() {
		let id: bigint | undefined = undefined;
		let hash: Buffer | undefined = undefined;
		let w = 16;

		for (const i in new Array(w).fill(0)) {
			let colors = new Map(
				new Array(w).fill(0).map((_, ii) => {
					let index = Number(i) * w + Number(ii);
					let color = Math.floor(((256 ** 3 - 1) / (w ** 2 - 1)) * index);
					return [color, 1000];
				})
			);

			let res = await ColorglyphSDK.colorsMine(
				{
					miner: ME,
					to: undefined,
					colors
				},
				{ responseType: 'full', fee: 1_000_000 }
			);

			console.log(res);
		}

		for (const i in new Array(w).fill(0)) {
			let indexes = new Map<number, number[]>();

			for (const ii in new Array(w).fill(0)) {
				let index = Number(i) * w + Number(ii);
				let color = Math.floor(((256 ** 3 - 1) / (w ** 2 - 1)) * index);

				indexes.set(color, [index]);
			}

			let colors: Map<string, Map<number, number[]>> = new Map();
			colors.set(ME, indexes);

			let res: any = await ColorglyphSDK.glyphMint(
				{
					minter: ME,
					to: undefined,
					colors,
					width: undefined,
					id
				},
				{
					responseType: 'full',
					fee: 1_000_000
				}
			);

			const resXdr: any = xdr['TransactionMeta'].fromXDR(res.resultMetaXdr, 'base64');
			id = BigInt(resXdr.value().sorobanMeta().returnValue().value()[1].value());
		}

		let res = await ColorglyphSDK.glyphMint(
			{
				minter: ME,
				to: undefined,
				colors: undefined,
				width: w,
				id
			},
			{
				responseType: 'full',
				fee: 1_000_000
			}
		);

		const resXdr: any = xdr['TransactionMeta'].fromXDR(res.resultMetaXdr, 'base64');
		hash = resXdr.value().sorobanMeta().returnValue().value()[1].value();

		console.log(hash?.toString('hex'));
		// e59ab42c7a7896441b45f943572b1ce3a4dd94de1d4546a442797133aefb4c56

		let glyph = await ColorglyphSDK.glyphGet({
			hash_id: {
				tag: 'Hash',
				values: [hash]
			} as ColorglyphSDK.HashId
		});

		console.log(glyph);
	}
</script>

<div class="flex flex-col max-w-xs [&>*]:mb-1">
	<button class="bg-black text-white" on:click={() => colors_mine()}>Colors Mine</button>
	<button class="bg-black text-white" on:click={() => colors_transfer()}>Colors Transfer</button>
	<button class="bg-black text-white" on:click={() => color_balance()}>Color Balance</button>

	<button class="bg-black text-white" on:click={() => glyph_mint()}>Glyph Mint</button>
	<button class="bg-black text-white" on:click={() => glyph_get()}>Glyph Get</button>

	<button class="bg-black text-white" on:click={() => offer_post(ME)}>Offer Post Me</button>
	<button class="bg-black text-white" on:click={() => offer_post(THEM)}>Offer Post Them</button>
	<button class="bg-black text-white" on:click={() => offers_get()}>Offers Get</button>
	<button class="bg-black text-white" on:click={() => offer_delete()}>Offer Delete</button>

	<button class="bg-black text-white" on:click={() => glyph_scrape()}>Glyph Scrape</button>

	<button class="bg-red text-white" on:click={() => super_mint()}>Super Mint</button>

	<ul class="flex flex-wrap border" style:width="calc({width} * 16px + 2px)">
		{#each palette as color}
			<li
				style:width="16px"
				style:height="16px"
				style:background-color="#{color.toString(16).padStart(6, '0')}"
			/>
		{/each}

		<!-- <li class="bg-yellow" style:width="16px" style:height="16px"></li>
    <li class="bg-red" style:width="16px" style:height="16px"></li>
    <li class="bg-yellow" style:width="16px" style:height="16px"></li>

    <li class="bg-yellow" style:width="16px" style:height="16px"></li>
    <li class="bg-red" style:width="16px" style:height="16px"></li>
    <li class="bg-yellow" style:width="16px" style:height="16px"></li>
    <li class="bg-red" style:width="16px" style:height="16px"></li>

    <li class="bg-red" style:width="16px" style:height="16px"></li>
    <li class="bg-yellow" style:width="16px" style:height="16px"></li>
    <li class="bg-red" style:width="16px" style:height="16px"></li>
    <li class="bg-yellow" style:width="16px" style:height="16px"></li>

    <li class="bg-yellow" style:width="16px" style:height="16px"></li>
    <li class="bg-red" style:width="16px" style:height="16px"></li>
    <li class="bg-yellow" style:width="16px" style:height="16px"></li>
    <li class="bg-red" style:width="16px" style:height="16px"></li> -->
	</ul>
</div>
