<script lang="ts">
	import * as ColorglyphSDK from 'colorglyph-sdk';
	import { Keypair, Networks, Transaction, xdr } from 'soroban-client';

	const ME = 'GD3YTR6H7EXYRUJTLPM23LBMESA2JOY32KNPUXMYDUOI5LILD4MWLDIZ';
	const ME_kp = Keypair.fromSecret('SDKSSSOWMTO43IQP6V54OC2L42I6PFMVWHMXWRWLK6KYIPYANXQGP4MK');
	const THEM = 'GAID7BB5TASKY4JBDBQX2IVD33CUYXUPDS2O5NAVAP277PLMHFE6AO3Y';
	const THEM_sk = Keypair.fromSecret('SBC6V4TL6TS2JHUWSFB6QHNVFYV6VZH3QOAYK5QHRALSPWDVW2MKOBOC');
	const XLM = 'CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT'; // d93f5c7bb0ebc4a9c8f727c5cebc4e41194d38257e1d0d910356b43bfc528813

	let GLYPH: string | undefined =
		'f11875748c9ff1acf8d010d6d0bf88e8aa612d47f85daef4a45c6f179fbbbbe1';

	// TODO
	// glyph_mint & offer_post return values are broken https://github.com/stellar/soroban-tools/issues/739

	let width: number = 32;
	let palette: number[] = [];

	// palette = generateRGBSpectrum(width)

	// console.log(palette);

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

	function generateRGBSpectrum(steps: number) {
		const colorArray = [];

		for (let i = 0; i < steps; i++) {
			for (let j = 0; j < steps; j++) {
				const red = 255 - Math.floor((i * 255) / steps);
				const green = 255 - Math.floor((j * 255) / steps);
				const blue = Math.floor((i * j * 255) / (steps * steps));

				const colorValue = red * Math.pow(256, 2) + green * 256 + blue;
				colorArray.push(colorValue);
			}
		}

		return colorArray;
	}

	async function super_mint() {
		let max_mine = 18;
		let max_mint = 19;

		let mintIndexes = new Map<number, number[]>();
		let mineColors = new Map(generateRGBSpectrum(width).map((color, index) => {
			mintIndexes.set(color, [index])
			return [color, 1000]
		}));
		mineColors = new Map([...mineColors.entries()].sort((a, b) => a[0] - b[0]));
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
				responseType: 'simulated',
				fee: 1_000_000_000,
			}
		);

		console.log('mint', res);

		// const resXdr: any = xdr['TransactionMeta'].fromXDR(res.resultMetaXdr, 'base64');
		// const hash = resXdr.value().sorobanMeta().returnValue().value()?.toString('hex');

		// console.log(hash);

		// glyph_get();
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

		palette = new Array(glyph.length).fill(256**3-1);

		for (const [color, indexes] of Object.entries(glyph.colors.get(ME))) {
			for (const index of indexes as number[]) {
				palette.splice(index, 1, Number(color))	
			}
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
