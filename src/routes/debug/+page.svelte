<script lang="ts">
	import {
		CONTRACT_ID,
		XLM_ID,
		generateRGBSpectrum,
		getGlyphHash,
		isFuture,
		isLocal,
		isTest,
	} from "$lib/utils";
	import { Client } from "colorglyph-sdk";
	import type { Offer } from "colorglyph-sdk";
	import { Keypair, Networks, Transaction } from "@stellar/stellar-sdk";

	const ME_kp = Keypair.fromSecret(
		"SAE27A5S6U32MAQBEB6GD4YAJFGGSSFINKB5QO64ZW32NBBMBYESNKN2", // GBGP5SD75TDB2ZL7JDJEFPSWDBEQRDJ4757ZXL57TOOQJSMWROT5JYKD
	);
	const ME = ME_kp.publicKey();
	const THEM_kp = Keypair.fromSecret(
		"SBC6V4TL6TS2JHUWSFB6QHNVFYV6VZH3QOAYK5QHRALSPWDVW2MKOBOC", // GAID7BB5TASKY4JBDBQX2IVD33CUYXUPDS2O5NAVAP277PLMHFE6AO3Y
	);
	const THEM = THEM_kp.publicKey();

	let GLYPH: string | undefined =
		"9eb925d1fe9970fc0e2e93ad1b4c8c1e92136600f9aac84b89dda44814d188cb";

	// TODO
	// glyph_mint & offer_post return values are broken https://github.com/stellar/soroban-tools/issues/739

	let width: number = 16; // (40 max)
	let palette: number[] = [];

	// palette = generateRGBSpectrum(width)

	const ColorglyphSDK = new Client({
		publicKey: ME,
		contractId: CONTRACT_ID,
		networkPassphrase: isLocal
			? Networks.STANDALONE
			: isFuture
				? Networks.FUTURENET
				: isTest
					? Networks.TESTNET
					: Networks.PUBLIC,
		rpcUrl: isLocal
			? "http://localhost:8000/soroban/rpc"
			: isFuture
				? "https://rpc-futurenet.stellar.org"
				: isTest
					? "https://soroban-testnet.stellar.org"
					: "https://mainnet.stellar.validationcloud.io/v1/l2ADLNFEi0TT0loic8mjHnUmq5gmVQxT8a7iaWZqYUc",
		async signTransaction(xdr: string) {
			const transaction = new Transaction(
				xdr,
				isLocal
					? Networks.STANDALONE
					: isFuture
						? Networks.FUTURENET
						: isTest
							? Networks.TESTNET
							: Networks.PUBLIC,
			);

			transaction.sign(ME_kp);

			return transaction.toXDR();
		},
	});

	async function super_mint() {
		let secondsToWait = 30;

		// because write count is limited to 20
		let max_mine = 23;
		let max_mint = 23;

		let colors = generateRGBSpectrum(width);
		let hash = await getGlyphHash(colors, width);
		let mintIndexes = new Map<number, number[]>();
		let mineColors = new Map(
			colors.map((color, index) => {
				mintIndexes.set(color, [index]);
				return [color, 10];
			}),
		);
		mineColors = new Map(
			[...mineColors.entries()].sort((a, b) => a[0] - b[0]),
		);
		mintIndexes = new Map(
			[...mintIndexes.entries()].sort((a, b) => a[0] - b[0]),
		);

		for (let index = 0; index < Math.ceil(width ** 2 / max_mine); index++) {
			let map = Array.from(mineColors).slice(
				index * max_mine,
				index * max_mine + max_mine,
			);
			let tx = await ColorglyphSDK.colors_mine({
				source: ME,
				miner: undefined,
				to: undefined,
				colors: new Map(map),
			});

			let { result: res } = await tx.signAndSend();

			console.log(index, "mine", res);
		}

		for (let index = 0; index < Math.ceil(width ** 2 / max_mint); index++) {
			let mintMap = new Map();
			let map = Array.from(mintIndexes).slice(
				index * max_mint,
				index * max_mint + max_mint,
			);
			mintMap.set(ME, new Map(map));

			let tx = await ColorglyphSDK.glyph_mint({
				hash,
				minter: ME,
				to: undefined,
				colors: mintMap,
				width: undefined,
			});

			let { result: res } = await tx.signAndSend();

			console.log(index, "mint", res);
		}

		let tx = await ColorglyphSDK.glyph_mint({
			hash,
			minter: ME,
			to: undefined,
			colors: new Map(),
			width,
		});

		let { result: res } = await tx.signAndSend();

		console.log("mint", res);

		// const hash = res?.toString('hex');

		GLYPH = hash.toString("hex");
		console.log(GLYPH);

		glyph_get();
	}

	async function colors_mine() {
		let tx = await ColorglyphSDK.colors_mine({
			source: ME,
			miner: undefined,
			to: undefined,
			colors: new Map(new Array(2).fill(0).map((_, i) => [i, 1000])),
		});

		let { result: res } = await tx.signAndSend();

		console.log(res);
	}

	async function colors_transfer() {
		let tx = await ColorglyphSDK.colors_transfer({
			from: ME,
			to: THEM,
			colors: [
				[ME, 0, 1],
				[ME, 1, 1],
			],
		});

		let { result: res } = await tx.signAndSend();

		console.log(res);
	}

	// TODO switch to use getLedgerEntry
	async function color_balance() {
		let { result: res } = await ColorglyphSDK.color_balance({
			owner: ME,
			miner: undefined,
			color: 0,
		});

		console.log(res);
	}

	async function glyph_mint() {
		let indexes = new Map<number, number[]>();
		indexes.set(0, [0, 1]);
		indexes.set(1, [2, 3]);

		let colors: Map<string, Map<number, number[]>> = new Map();
		colors.set(ME, indexes);

		let hash = await getGlyphHash([0, 0, 1, 1], 2);
		let tx = await ColorglyphSDK.glyph_mint({
			hash,
			minter: ME,
			to: undefined,
			colors,
			width: 2,
		});

		let { result: res } = await tx.signAndSend();

		console.log(res);

		GLYPH = hash.toString("hex");
		console.log(GLYPH);

		glyph_get();
	}

	// TODO
	async function glyph_transfer() {}

	// TODO switch to use getLedgerEntry
	async function glyph_get(key = ME) {
		let { result: res } = await ColorglyphSDK.glyph_get({
			hash: Buffer.from(GLYPH!, "hex"),
		});

		const glyph = res.unwrap();

		console.log(glyph);

		width = glyph.width || width;

		palette = new Array(glyph.length || width * width).fill(256 ** 3 - 1);

		for (const [_account, colors] of glyph.colors) {
			for (const [color, indexes] of colors) {
				for (const index of indexes as number[]) {
					palette.splice(index, 1, Number(color));
				}
			}
		}

		palette = palette;

		console.log(palette);
	}

	async function offer_post(address: string) {
		const sell = {
			tag: "Glyph",
			values: [Buffer.from(GLYPH!, "hex")],
		} as Offer;

		let tx = await ColorglyphSDK.offer_post({
			sell:
				address === ME
					? sell
					: {
							tag: "AssetSell",
							values: [THEM, XLM_ID, BigInt(100)],
						},
			buy:
				address === ME
					? {
							tag: "Asset",
							values: [XLM_ID, BigInt(100)],
						}
					: sell,
		});

		let { result: res } = await tx.signAndSend();

		console.log(res);
	}

	// TODO switch to use getLedgerEntry
	async function offers_get() {
		let { result: res } = await ColorglyphSDK.offers_get({
			// sell: {
			// 	tag: 'AssetSell',
			// 	values: [THEM, XLM, BigInt(100)]
			// },
			// buy: {
			// 	tag: 'Glyph',
			// 	values: [Buffer.from(GLYPH!, 'hex')]
			// },
			sell: {
				tag: "Glyph",
				values: [Buffer.from(GLYPH!, "hex")],
			},
			// buy: {
			// 	tag: "Asset",
			// 	values: [XLM_ID, BigInt(100)],
			// }
			buy: undefined,
		});

		console.log(res);
	}

	async function offer_delete() {
		let tx = await ColorglyphSDK.offer_delete({
			sell: {
				tag: "Glyph",
				values: [Buffer.from(GLYPH!, "hex")],
			},
			buy: {
				tag: "Asset",
				values: [XLM_ID, BigInt(100)],
			},
		});

		let { result: res } = await tx.signAndSend();

		console.log(res);
	}

	// TODO Not getting the error I would expect when trying to scrape a glyph the signer doesn't own
	// AAAAAAAHFd7/////AAAAAQAAAAAAAAAY/////gAAAAA=
	// invokeHostFunctionTrapped
	async function glyph_scrape() {
		let tx = await ColorglyphSDK.glyph_scrape({
			to: undefined,
			hash: Buffer.from(GLYPH!, "hex"),
		});

		let { result: res } = await tx.signAndSend();

		console.log(res);
	}
</script>

<div class="flex flex-col max-w-xs [&>*]:mb-1">
	<input type="text" bind:value={GLYPH} />
	<button class="bg-black text-white" on:click={() => colors_mine()}
		>Colors Mine</button
	>
	<button class="bg-black text-white" on:click={() => colors_transfer()}
		>Colors Transfer</button
	>
	<button class="bg-black text-white" on:click={() => color_balance()}
		>Color Balance</button
	>

	<button class="bg-black text-white" on:click={() => glyph_mint()}
		>Glyph Mint</button
	>
	<button class="bg-black text-white" on:click={() => glyph_get(ME)}
		>Glyph Get</button
	>

	<button class="bg-black text-white" on:click={() => offer_post(ME)}
		>Offer Post Me</button
	>
	<button class="bg-black text-white" on:click={() => offer_post(THEM)}
		>Offer Post Them</button
	>
	<button class="bg-black text-white" on:click={() => offers_get()}
		>Offers Get</button
	>
	<button class="bg-black text-white" on:click={() => offer_delete()}
		>Offer Delete</button
	>

	<button class="bg-black text-white" on:click={() => glyph_scrape()}
		>Glyph Scrape</button
	>

	<button class="bg-red-500 text-white" on:click={() => super_mint()}
		>Super Mint</button
	>

	<ul
		class="flex flex-wrap border border-black"
		style:width="calc({width} * 16px + 2px)"
	>
		{#each palette as color}
			<li
				style:width="16px"
				style:height="16px"
				style:background-color="#{color.toString(16).padStart(6, "0")}"
			/>
		{/each}
	</ul>
</div>
