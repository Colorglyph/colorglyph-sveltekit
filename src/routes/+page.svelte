<script lang="ts">
	import * as ColorglyphSDK from 'colorglyph-sdk';
	import { Keypair, Networks, Transaction, xdr } from 'soroban-client';

	const ME = 'GABWFENUQAICX3B6RBZQ4ZM3GDGD3WYAO6FHEMF4XGHMI6JZ57VZI5TK';
	const ME_kp = Keypair.fromSecret('SDV7VSVEFSZ6WX56DSAN23HL7DCVB7V3TPFJLXE7AYS3F7SBZSTE4RKQ');
	const THEM = 'GAID7BB5TASKY4JBDBQX2IVD33CUYXUPDS2O5NAVAP277PLMHFE6AO3Y';
	const THEM_sk = Keypair.fromSecret('SBC6V4TL6TS2JHUWSFB6QHNVFYV6VZH3QOAYK5QHRALSPWDVW2MKOBOC');
	const XLM = 'CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT'; // d93f5c7bb0ebc4a9c8f727c5cebc4e41194d38257e1d0d910356b43bfc528813

	let GLYPH: string | undefined =
		'b5b6d122b4cb9d5590bbe118bb9ec57bfefded4427da897595b012dd228a96a4';

	// c12ceed0745e67d82c953bcb4a2d0e7b86ccad96785ee0f270900dccd560dec3
	// "AAAAAgAAAAADYpG0gBAr7D6Icw5lmzDMPdsAd4pyMLy5jsR5Oe/rlDulRQ0AAsQSAAAAOgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGAAAAAAAAAAGAAAAEgAAAAGkUypGrpz2D50aLaZzN0ByBP9i1tAcu4ofCwnmJL+PcwAAAA8AAAAKZ2x5cGhfbWludAAAAAAAEgAAAAAAAAAAA2KRtIAQK+w+iHMOZZswzD3bAHeKcjC8uY7EeTnv65QAAAABAAAAEQAAAAEAAAAAAAAAAwAAABYAAAABAAAAAAAAAAAAAAABpFMqRq6c9g+dGi2mczdAcgT/YtbQHLuKHwsJ5iS/j3MAAAAKZ2x5cGhfbWludAAAAAAABAAAABIAAAAAAAAAAANikbSAECvsPohzDmWbMMw92wB3inIwvLmOxHk57+uUAAAAAQAAABEAAAABAAAAAAAAAAMAAAAWAAAAAAAAAAEAAAAAAAAAAgAAAAYAAAABpFMqRq6c9g+dGi2mczdAcgT/YtbQHLuKHwsJ5iS/j3MAAAAUAAAAAQAAAAAAAAAHKym83qomW1/RkMSCX4rZDuswZP7UJNmb39whwrVOgzIAAAAAAAAABAAAAAYAAAABpFMqRq6c9g+dGi2mczdAcgT/YtbQHLuKHwsJ5iS/j3MAAAAQAAAAAQAAAAIAAAAPAAAABkNvbG9ycwAAAAAAEgAAAAAAAAAAA2KRtIAQK+w+iHMOZZswzD3bAHeKcjC8uY7EeTnv65QAAAABAAAAAAAAAAYAAAABpFMqRq6c9g+dGi2mczdAcgT/YtbQHLuKHwsJ5iS/j3MAAAAQAAAAAQAAAAIAAAAPAAAABUdseXBoAAAAAAAADQAAACC1ttEitMudVZC74Ri7nsV7/v3tRCfaiXWVsBLdIoqWpAAAAAEAAAAAAAAABgAAAAGkUypGrpz2D50aLaZzN0ByBP9i1tAcu4ofCwnmJL+PcwAAABAAAAABAAAAAgAAAA8AAAALR2x5cGhNaW50ZXIAAAAADQAAACC1ttEitMudVZC74Ri7nsV7/v3tRCfaiXWVsBLdIoqWpAAAAAEAAAAAAAAABgAAAAGkUypGrpz2D50aLaZzN0ByBP9i1tAcu4ofCwnmJL+PcwAAABAAAAABAAAAAgAAAA8AAAAKR2x5cGhPd25lcgAAAAAADQAAACC1ttEitMudVZC74Ri7nsV7/v3tRCfaiXWVsBLdIoqWpAAAAAEAAAAAArN7NwAAmqAAADjQAABxpAAAAAAAABYzAAAAATnv65QAAABA3/HfNmCX2KthckqAWNXgjMDTPjxxW7skYXcWN9w/UlzvaAtHy5VvRMQkloa7WLwswrC2hTI+nvdNLUMY8joXBQ=="
	// "AAAAAAAKegoAAAAAAAAAAQAAAAAAAAAYAAAAAGXqp63beZHXLsf5SNPpQy6Tt5iYTYdvuG6fbYB+kbNEAAAAAA=="

	// TODO
	// glyph_mint & offer_post return values are broken https://github.com/stellar/soroban-tools/issues/739

	let width: number = 0;
	let palette: number[] = [];

	class Wallet {
		async isConnected() {
			return true;
		}
		async isAllowed() {
			return true;
		}
		async getUserInfo() {
			return {
				publicKey: ME
			};
		}
		async signTransaction(xdr: string) {
			const transaction = new Transaction(xdr, Networks.FUTURENET);

			transaction.sign(ME_kp);

			return transaction.toXDR();
		}
	}

	const wallet = new Wallet();

	async function super_mint() {
		let hash: Buffer | undefined = undefined;
		let width = 22; // 22 max? (unsure why >= 23 fails)
		let max_mine = 18;
		let max_mint = 19;

		let mineColors = new Map(generateRGBSpectrum(width).map((color) => [color, 1000]));
		mineColors = new Map([...mineColors.entries()].sort((a, b) => a[0] - b[0]));

		let mintIndexes = new Map<number, number[]>();
		generateRGBSpectrum(width).forEach((color, index) => mintIndexes.set(color, [index]));
		mintIndexes = new Map([...mintIndexes.entries()].sort((a, b) => a[0] - b[0]));

		for (let index = 0; index < Math.ceil(width ** 2 / max_mine); index++) {
			let map = Array.from(mineColors).slice(index * max_mine, index * max_mine + max_mine);
			let res = await ColorglyphSDK.colorsMine(
				{
					miner: ME,
					to: undefined,
					colors: new Map(map)
				},
				{
					wallet,
					responseType: 'full',
					fee: 1_000_000
				}
			);

			console.log(index, 'mine', res);
		}

		for (let index = 0; index < Math.ceil(width ** 2 / max_mint); index++) {
			let mintMap = new Map();
			let map = Array.from(mintIndexes).slice(index * max_mint, index * max_mint + max_mint);
			mintMap.set(ME, new Map(map));

			let res: any = await ColorglyphSDK.glyphMint(
				{
					minter: ME,
					to: undefined,
					colors: mintMap,
					width: undefined
				},
				{
					wallet,
					responseType: 'full',
					fee: 1_000_000
				}
			);

			console.log(index, 'mint', res);
		}

		let res: any = await ColorglyphSDK.glyphMint(
			{
				minter: ME,
				to: undefined,
				colors: new Map(),
				width
			},
			{
				wallet,
				responseType: 'full',
				fee: 1_000_000_000
			}
		);

		console.log('mint', res);

		const resXdr: any = xdr['TransactionMeta'].fromXDR(res.resultMetaXdr, 'base64');
		hash = resXdr.value().sorobanMeta().returnValue().value();

		GLYPH = hash?.toString('hex');
		console.log(GLYPH);

		glyph_get();
	}

	function generateRGBSpectrum(steps: number) {
		const colorArray = [];

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
		let res = await ColorglyphSDK.colorBalance({
			owner: ME,
			miner: undefined,
			color: 0
		});

		console.log(res);
	}

	// submit ✅ // return ❌
	async function glyph_mint() {
		let indexes = new Map<number, number[]>();
		indexes.set(0, [0, 1]);
		indexes.set(1, [2, 3]);

		let colors: Map<string, Map<number, number[]>> = new Map();
		colors.set(ME, indexes);

		let res = await ColorglyphSDK.glyphMint(
			{
				minter: ME,
				to: undefined,
				colors,
				width: 2
			},
			{
				responseType: 'full',
				fee: 1_000_000
			}
		);

		console.log(res);
	}

	// TODO switch to use getLedgerEntry
	async function glyph_get() {
		let glyph: any = (await ColorglyphSDK.glyphGet({
			hash_type: {
				tag: 'Glyph',
				values: [Buffer.from(GLYPH, 'hex')]
			} as ColorglyphSDK.HashType
		})) as ColorglyphSDK.Ok<ColorglyphSDK.GlyphType>;

		console.log(glyph);

		glyph = glyph.value[1];

		width = glyph.width;

		palette = [];

		for (const [color, indexes] of Object.entries(glyph.colors.get(ME))) {
			palette.push(Number(color));
		}

		palette = palette;
	}

	// submit ✅ // return ❌
	async function offer_post(address: string) {
		const sell = {
			tag: 'Glyph',
			values: [Buffer.from(GLYPH, 'hex')]
		} as ColorglyphSDK.Offer;
		const buy = {
			tag: 'Asset',
			values: [XLM, BigInt(100)]
		} as ColorglyphSDK.Offer;

		// TODO if sell Asset use AssetSell

		let res = await ColorglyphSDK.offerPost(
			{
				sell: address === ME ? sell : buy,
				buy: address === ME ? buy : sell
			},
			{ responseType: 'full', fee: 1_000_000 }
		);

		console.log(res);
	}

	// TODO switch to use getLedgerEntry
	async function offers_get() {}

	async function offer_delete() {
		let res = await ColorglyphSDK.offerDelete(
			{
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
		let res = await ColorglyphSDK.glyphScrape(
			{
				to: undefined,
				hash_type: {
					tag: 'Glyph',
					values: [Buffer.from(GLYPH, 'hex')]
				} as ColorglyphSDK.HashType
			},
			{ responseType: 'full', fee: 1_000_000 }
		);

		console.log(res);
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
	</ul>
</div>
