<script lang="ts">
	import { generateRGBSpectrum } from '$lib/utils';
	import { Contract } from 'colorglyph-sdk';
	import type { Ok, HashType, GlyphType, Offer } from 'colorglyph-sdk';
	import { Keypair, Networks, Transaction } from 'soroban-client';

	const ME = 'GBGP5SD75TDB2ZL7JDJEFPSWDBEQRDJ4757ZXL57TOOQJSMWROT5JYKD'; // 'GDBDQ55RL3RJ3566YJGAVOTKF7XORMHGTHH72XCALBSTJM6IPUJHGRIZ' // 'GCBDVRWCTRZENDMYBOLAC3PZBP6NGGSILDZTYAUCJUWUGX27BG2VDPID';
	const ME_kp = Keypair.fromSecret('SAE27A5S6U32MAQBEB6GD4YAJFGGSSFINKB5QO64ZW32NBBMBYESNKN2'); // Keypair.fromSecret('SDCZMHTIDUWC4KA2MPQPTDZV2BCGKUBI6XI5BDISC4R2MR5T6QKVVVAB') // Keypair.fromSecret('SBQJEN6RVWCB7KUPI6Y4XVBQVHEDQVT2KS2UUIYVQOTWP5EUCNFG6DEJ');
	const THEM = 'GAID7BB5TASKY4JBDBQX2IVD33CUYXUPDS2O5NAVAP277PLMHFE6AO3Y';
	const THEM_kp = Keypair.fromSecret('SBC6V4TL6TS2JHUWSFB6QHNVFYV6VZH3QOAYK5QHRALSPWDVW2MKOBOC');
	const CONTRACTID = 'CC76ION4DC4ZOWOZINFTTTJR5VCVUB3UECVMHJ2RK4AUMUESTTXTDWQC' // 'CDSXSN5OWU4UHJLHZKWTZZSACTJSWTIQO3PZZLCKTNE5QOT3LFKIH2KG',
	const XLM = 'CDMLFMKMMD7MWZP3FKUBZPVHTUEDLSX4BYGYKH4GCESXYHS3IHQ4EIG4'; // 'CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT';

	let GLYPH: string = 'd58094fd3791508e4af6a2b2e278dea70c3fd6a0fa8db5ba47f07058cb7b87a3';

	// TODO
	// glyph_mint & offer_post return values are broken https://github.com/stellar/soroban-tools/issues/739

	let width: number = 4 // (40 max)
	let palette: number[] = []

	// palette = generateRGBSpectrum(width)

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
			const transaction = new Transaction(xdr, Networks.FUTURENET)

			transaction.sign(ME_kp);

			return transaction.toXDR();
		}
	}

	const ColorglyphSDK = new Contract({
		contractId: CONTRACTID,
		networkPassphrase: Networks.FUTURENET,
		rpcUrl: 'https://rpc-futurenet.stellar.org',
		wallet: new Wallet()
	});

	async function super_mint() {
		// because write count is limited to 20
		// let max_mine = 18;
		// let max_mint = 19;
		// because events are limited to 2 KB
		let max_mine = 10
		let max_mint = 10

		let mintIndexes = new Map<number, number[]>();
		let mineColors = new Map(generateRGBSpectrum(width).map((color, index) => {
			mintIndexes.set(color, [index])
			return [color, 10]
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
					responseType: 'full',
					fee: 10_000_000
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
					responseType: 'full',
					fee: 10_000_000
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
				// responseType: 'simulated',
				responseType: 'full',
				fee: 10_000_000,
			}
		);

		console.log('mint', res);

		const hash = res.resultMetaXdr.value().sorobanMeta().returnValue().value()?.toString('hex');

		GLYPH = hash
		console.log(hash);

		glyph_get();
	}

	async function colors_mine() {
		let res = await ColorglyphSDK.colorsMine(
			{
				miner: ME,
				to: undefined,
				colors: new Map(new Array(2).fill(0).map((_, i) => [i, 1000]))
			},
			{ 
				// responseType: 'full', 
				fee: 1_000_000 
			}
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
			{ 
				// responseType: 'full', 
				fee: 1_000_000 
			}
		);

		console.log(res);
	}

	// TODO switch to use getLedgerEntry
	async function color_balance() {
		let res = await ColorglyphSDK.colorBalance({
			owner: ME,
			miner: undefined,
			color: 0
		});

		console.log(res);
	}

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
				// responseType: 'full', // TODO allow omitting this but currently gettin an error https://github.com/stellar/js-soroban-client/issues/162
				fee: 1_000_000
			}
		);

		console.log(res);

		const hash = res?.toString('hex')

		GLYPH = hash
		console.log(hash);

		glyph_get();
	}

	// TODO
	async function glyph_transfer() {

	}

	// TODO switch to use getLedgerEntry
	async function glyph_get(key = ME) {
		let glyph: any = (await ColorglyphSDK.glyphGet({
			hash_type: {
				tag: 'Glyph',
				values: [Buffer.from(GLYPH, 'hex')]
			} as HashType
		})) as Ok<GlyphType>;

		console.log(glyph)

		glyph = glyph.value.values[0];

		width = glyph.width;

		palette = new Array(glyph.length).fill(256 ** 3 - 1);

		for (const [_account, colors] of glyph.colors.entries()) {
			for (const [color, indexes] of colors) {
				for (const index of indexes as number[]) {
					palette.splice(index, 1, Number(color))	
				}
			}
		}

		palette = palette;
	}

	async function offer_post(address: string) {
		const sell = {
			tag: 'Glyph',
			values: [Buffer.from(GLYPH, 'hex')]
		} as Offer;
		const buy = {
			tag: 'Asset',
			values: [XLM, BigInt(100)]
		} as Offer;

		let res = await ColorglyphSDK.offerPost(
			{
				sell: address === ME ? sell : {
					tag: 'AssetSell',
					values: [THEM, XLM, BigInt(100)]
				} as Offer,
				buy: address === ME ? buy : sell
			},
			{ 
				// responseType: 'full', 
				fee: 1_000_000 
			}
		);

		console.log(res);
	}

	// TODO switch to use getLedgerEntry
	async function offers_get() {
		let res = await ColorglyphSDK.offersGet(
			{
				// sell: {
				// 	tag: 'AssetSell',
				// 	values: [THEM, XLM, BigInt(100)]
				// } as Offer,
				// buy: {
				// 	tag: 'Glyph',
				// 	values: [Buffer.from(GLYPH, 'hex')]
				// } as Offer

				sell: {
					tag: 'Glyph',
					values: [Buffer.from(GLYPH, 'hex')]
				} as Offer,
				buy: undefined
			},
			{ 
				// responseType: 'full', 
				fee: 1_000_000 
			}
		);

		console.log(res);
	}

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
			{ 
				// responseType: 'full', 
				fee: 1_000_000 
			}
		);

		console.log(res);
	}

	// TODO Not getting the error I would expect when trying to scrape a glyph the signer doesn't own
		// AAAAAAAHFd7/////AAAAAQAAAAAAAAAY/////gAAAAA=
		// invokeHostFunctionTrapped
	async function glyph_scrape() {
		let res = await ColorglyphSDK.glyphScrape(
			{
				to: undefined,
				hash_type: {
					tag: 'Glyph',
					values: [Buffer.from(GLYPH, 'hex')]
				} as HashType
			},
			{ 
				// responseType: 'full', 
				fee: 1_000_000 
			}
		);

		console.log(res);
	}
</script>

<div class="flex flex-col max-w-xs [&>*]:mb-1">
	<input type="text" bind:value={GLYPH}>
	<button class="bg-black text-white" on:click={() => colors_mine()}>Colors Mine</button>
	<button class="bg-black text-white" on:click={() => colors_transfer()}>Colors Transfer</button>
	<button class="bg-black text-white" on:click={() => color_balance()}>Color Balance</button>

	<button class="bg-black text-white" on:click={() => glyph_mint()}>Glyph Mint</button>
	<button class="bg-black text-white" on:click={() => glyph_get(ME)}>Glyph Get</button>

	<button class="bg-black text-white" on:click={() => offer_post(ME)}>Offer Post Me</button>
	<button class="bg-black text-white" on:click={() => offer_post(THEM)}>Offer Post Them</button>
	<button class="bg-black text-white" on:click={() => offers_get()}>Offers Get</button>
	<button class="bg-black text-white" on:click={() => offer_delete()}>Offer Delete</button>

	<button class="bg-black text-white" on:click={() => glyph_scrape()}>Glyph Scrape</button>

	<button class="bg-red-500 text-white" on:click={() => super_mint()}>Super Mint</button>

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
