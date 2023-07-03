import * as SorobanClient from 'soroban-client';
import { xdr } from 'soroban-client';
import { Buffer } from "buffer";
import { scValStrToJs, scValToJs, addressToScVal, u128ToScVal, i128ToScVal, strToScVal } from './convert.js';
import { invoke, InvokeArgs } from './invoke.js';

export * from './convert.js'
export * from './constants.js'
export * from './server.js'
export * from './invoke.js'

export type u32 = number;
export type i32 = number;
export type u64 = bigint;
export type i64 = bigint;
export type u128 = bigint;
export type i128 = bigint;
export type u256 = bigint;
export type i256 = bigint;
export type Address = string;
export type Option<T> = T | undefined;
export type Typepoint = bigint;
export type Duration = bigint;

/// Error interface containing the error message
export interface Error_ { message: string };

export interface Result<T, E = Error_> {
    unwrap(): T,
    unwrapErr(): E,
    isOk(): boolean,
    isErr(): boolean,
};

export class Ok<T> implements Result<T> {
    constructor(readonly value: T) { }
    unwrapErr(): Error_ {
        throw new Error('No error');
    }
    unwrap(): T {
        return this.value;
    }

    isOk(): boolean {
        return true;
    }

    isErr(): boolean {
        return !this.isOk()
    }
}

export class Err<T> implements Result<T> {
    constructor(readonly error: Error_) { }
    unwrapErr(): Error_ {
        return this.error;
    }
    unwrap(): never {
        throw new Error(this.error.message);
    }

    isOk(): boolean {
        return false;
    }

    isErr(): boolean {
        return !this.isOk()
    }
}

if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}

const regex = /ContractError\((\d+)\)/;

function getError(err: string): Err<Error_> | undefined {
    const match = err.match(regex);
    if (!match) {
        return undefined;
    }
    if (Errors == undefined) {
        return undefined;
    }
    // @ts-ignore
    let i = parseInt(match[1], 10);
    if (i < Errors.length) {
        return new Err(Errors[i]!);
    }
    return undefined;
}

export async function initialize({ token_id, fee_address }: { token_id: Address, fee_address: Address }, { signAndSend, fee }: { signAndSend?: boolean, fee?: number } = { signAndSend: false, fee: 100 }): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'initialize',
        args: [((i) => addressToScVal(i))(token_id),
        ((i) => addressToScVal(i))(fee_address)],
    };

    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return;
}

export async function colors_mine({ miner, to, colors }: { miner: Address, to: Option<Address>, colors: Array<[u32, u32]> }, { signAndSend, fee }: { signAndSend?: boolean, fee?: number } = { signAndSend: false, fee: 100 }): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'colors_mine',
        args: [((i) => addressToScVal(i))(miner),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : addressToScVal(i))(to),
        ((i) => xdr.ScVal.scvVec(i.map((i) => xdr.ScVal.scvVec([
            ((i) => xdr.ScVal.scvU32(i))(i[0]),
            ((i) => xdr.ScVal.scvU32(i))(i[1])
        ]))))(colors)],
    };

    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return;
}

export async function colors_transfer({ from, to, colors }: { from: Address, to: Address, colors: Array<MinerColorAmount> }, { signAndSend, fee }: { signAndSend?: boolean, fee?: number } = { signAndSend: false, fee: 100 }): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'colors_transfer',
        args: [
            ((i) => addressToScVal(i))(from),
            ((i) => addressToScVal(i))(to),
            ((i) => xdr.ScVal.scvVec(i.map((i) => MinerColorAmountToXdr(i))))(colors)
        ],
    };

    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return;
}

export async function color_balance({ owner, miner, color }: { owner: Address, miner: Option<Address>, color: u32 }, { signAndSend, fee }: { signAndSend?: boolean, fee?: number } = { signAndSend: false, fee: 100 }): Promise<u32> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'color_balance',
        args: [((i) => addressToScVal(i))(owner),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : addressToScVal(i))(miner),
        ((i) => xdr.ScVal.scvU32(i))(color)],
    };

    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValStrToJs(response.xdr) as u32;
}

export async function glyph_mint({ minter, to, colors, width }: { minter: Address, to: Option<Address>, colors: Array<[Address, Array<[u32, Array<u32>]>]>, width: u32 }, { signAndSend, fee }: { signAndSend?: boolean, fee?: number } = { signAndSend: false, fee: 100 }): Promise<Buffer> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'glyph_mint',
        args: [((i) => addressToScVal(i))(minter),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : addressToScVal(i))(to),
        ((i) => xdr.ScVal.scvVec(i.map((i) => xdr.ScVal.scvVec([
            ((i) => addressToScVal(i))(i[0]),
            ((i) => xdr.ScVal.scvVec(i.map((i) => xdr.ScVal.scvVec([
                ((i) => xdr.ScVal.scvU32(i))(i[0]),
                ((i) => xdr.ScVal.scvVec(i.map((i) => xdr.ScVal.scvU32(i))))(i[1])
            ]))))(i[1])
        ]))))(colors),
        ((i) => xdr.ScVal.scvU32(i))(width)],
    };

    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return scValStrToJs(response.xdr) as Buffer;
}

export async function glyph_get({ hash }: { hash: Buffer }, { signAndSend, fee }: { signAndSend?: boolean, fee?: number } = { signAndSend: false, fee: 100 }): Promise<Result<Glyph>> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'glyph_get',
        args: [((i) => xdr.ScVal.scvBytes(i))(hash)],
    };

    try {

        // @ts-ignore Type does exist
        const response = await invoke(invokeArgs);
        return new Ok(scValStrToJs(response.xdr) as Glyph);
    } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
            return err;
        } else {
            throw e;
        }
    }
}

export async function glyph_scrape({ owner, to, hash }: { owner: Address, to: Option<Address>, hash: Buffer }, { signAndSend, fee }: { signAndSend?: boolean, fee?: number } = { signAndSend: false, fee: 100 }): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'glyph_scrape',
        args: [
            ((i) => addressToScVal(i))(owner),
            ((i) => (!i) ? xdr.ScVal.scvVoid() : addressToScVal(i))(to),
            ((i) => xdr.ScVal.scvBytes(i))(hash)
        ],
    };

    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return;
}

export async function offer_post({ seller, sell, buy }: { seller: Address, sell: OfferType, buy: OfferType }, { signAndSend, fee }: { signAndSend?: boolean, fee?: number } = { signAndSend: false, fee: 100 }): Promise<Result<void>> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'offer_post',
        args: [
            ((i) => addressToScVal(i))(seller),
            ((i) => OfferTypeToXdr(i))(sell),
            ((i) => OfferTypeToXdr(i))(buy)
        ],
    };

    try {

        // @ts-ignore Type does exist
        const response = await invoke(invokeArgs);
        return new Ok(scValStrToJs(response.xdr) as void);
    } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
            return err;
        } else {
            throw e;
        }
    }
}

export async function offers_get({ sell, buy }: { sell: OfferType, buy: OfferType }, { signAndSend, fee }: { signAndSend?: boolean, fee?: number } = { signAndSend: false, fee: 100 }): Promise<Result<Offer>> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'offers_get',
        args: [
            ((i) => OfferTypeToXdr(i))(sell),
            ((i) => OfferTypeToXdr(i))(buy)
        ],
    };

    try {

        // @ts-ignore Type does exist
        const response = await invoke(invokeArgs);
        return new Ok(scValStrToJs(response.xdr) as Offer);
    } catch (e) {
        //@ts-ignore
        let err = getError(e.message);
        if (err) {
            return err;
        } else {
            throw e;
        }
    }
}

export async function offer_delete({ seller, sell, buy }: { seller: Address, sell: OfferType, buy: OfferType }, { signAndSend, fee }: { signAndSend?: boolean, fee?: number } = { signAndSend: false, fee: 100 }): Promise<void> {
    let invokeArgs: InvokeArgs = {
        signAndSend,
        fee,
        method: 'offer_delete',
        args: [
            ((i) => addressToScVal(i))(seller),
            ((i) => OfferTypeToXdr(i))(sell),
            ((i) => OfferTypeToXdr(i))(buy)
        ],
    };

    // @ts-ignore Type does exist
    const response = await invoke(invokeArgs);
    return;
}

const Errors = [
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" }
]
export type StorageKey = { tag: "None", values: void } | { tag: "InitToken", values: void } | { tag: "InitFee", values: void } | { tag: "Glyph", values: [Buffer] } | { tag: "GlyphOwner", values: [Buffer] } | { tag: "GlyphMinter", values: [Buffer] } | { tag: "GlyphOffer", values: [Buffer] } | { tag: "AssetOffer", values: [AssetOffer] };

function StorageKeyToXdr(storageKey?: StorageKey): xdr.ScVal {
    if (!storageKey) {
        return xdr.ScVal.scvVoid();
    }
    let res: xdr.ScVal[] = [];
    switch (storageKey.tag) {
        case "None":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("None"));
            break;
        case "InitToken":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("InitToken"));
            break;
        case "InitFee":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("InitFee"));
            break;
        case "Glyph":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(...((i) => [
                ((i) => xdr.ScVal.scvBytes(i))(i[0])
            ])(storageKey.values));
            break;
        case "GlyphOwner":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("GlyphOwner"));
            res.push(...((i) => [
                ((i) => xdr.ScVal.scvBytes(i))(i[0])
            ])(storageKey.values));
            break;
        case "GlyphMinter":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("GlyphMinter"));
            res.push(...((i) => [
                ((i) => xdr.ScVal.scvBytes(i))(i[0])
            ])(storageKey.values));
            break;
        case "GlyphOffer":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("GlyphOffer"));
            res.push(...((i) => [
                ((i) => xdr.ScVal.scvBytes(i))(i[0])
            ])(storageKey.values));
            break;
        case "AssetOffer":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("AssetOffer"));
            res.push(...((i) => [
                ((i) => AssetOfferToXdr(i))(i[0])
            ])(storageKey.values));
            break;
    }
    return xdr.ScVal.scvVec(res);
}

function StorageKeyFromXdr(base64Xdr: string): StorageKey {
    type Tag = StorageKey["tag"];
    type Value = StorageKey["values"];
    let [tag, values] = strToScVal(base64Xdr).vec()!.map(scValToJs) as [Tag, Value];
    if (!tag) {
        throw new Error('Missing enum tag when decoding StorageKey from XDR');
    }
    return { tag, values } as StorageKey;
}

export interface MinerColorAmount {
    0: Address;
    1: u32;
    2: u32;
}

function MinerColorAmountToXdr(minerColorAmount?: MinerColorAmount): xdr.ScVal {
    if (!minerColorAmount) {
        return xdr.ScVal.scvVoid();
    }
    // let arr = [
    //     new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("0"), val: ((i) => addressToScVal(i))(minerColorAmount["0"]) }),
    //     new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("1"), val: ((i) => xdr.ScVal.scvU32(i))(minerColorAmount["1"]) }),
    //     new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("2"), val: ((i) => xdr.ScVal.scvU32(i))(minerColorAmount["2"]) })
    // ];
    // return xdr.ScVal.scvMap(arr);
    return xdr.ScVal.scvVec([
        ((i) => addressToScVal(i))(minerColorAmount["0"]),
        ((i) => xdr.ScVal.scvU32(i))(minerColorAmount["1"]),
        ((i) => xdr.ScVal.scvU32(i))(minerColorAmount["2"])
    ])
}


function MinerColorAmountFromXdr(base64Xdr: string): MinerColorAmount {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        0: scValToJs(map.get("0")) as unknown as Address,
        1: scValToJs(map.get("1")) as unknown as u32,
        2: scValToJs(map.get("2")) as unknown as u32
    };
}

export interface MinerOwnerColor {
    0: Address;
    1: Address;
    2: u32;
}

function MinerOwnerColorToXdr(minerOwnerColor?: MinerOwnerColor): xdr.ScVal {
    if (!minerOwnerColor) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("0"), val: ((i) => addressToScVal(i))(minerOwnerColor["0"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("1"), val: ((i) => addressToScVal(i))(minerOwnerColor["1"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("2"), val: ((i) => xdr.ScVal.scvU32(i))(minerOwnerColor["2"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}


function MinerOwnerColorFromXdr(base64Xdr: string): MinerOwnerColor {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        0: scValToJs(map.get("0")) as unknown as Address,
        1: scValToJs(map.get("1")) as unknown as Address,
        2: scValToJs(map.get("2")) as unknown as u32
    };
}

export interface Glyph {
    colors: Array<[Address, Array<[u32, Array<u32>]>]>;
    length: u32;
    width: u32;
}

function GlyphToXdr(glyph?: Glyph): xdr.ScVal {
    if (!glyph) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({
            key: ((i) => xdr.ScVal.scvSymbol(i))("colors"), val: ((i) => xdr.ScVal.scvVec(i.map((i) => xdr.ScVal.scvVec([
                ((i) => addressToScVal(i))(i[0]),
                ((i) => xdr.ScVal.scvVec(i.map((i) => xdr.ScVal.scvVec([
                    ((i) => xdr.ScVal.scvU32(i))(i[0]),
                    ((i) => xdr.ScVal.scvVec(i.map((i) => xdr.ScVal.scvU32(i))))(i[1])
                ]))))(i[1])
            ]))))(glyph["colors"])
        }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("length"), val: ((i) => xdr.ScVal.scvU32(i))(glyph["length"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("width"), val: ((i) => xdr.ScVal.scvU32(i))(glyph["width"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}


function GlyphFromXdr(base64Xdr: string): Glyph {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        colors: scValToJs(map.get("colors")) as unknown as Array<[Address, Array<[u32, Array<u32>]>]>,
        length: scValToJs(map.get("length")) as unknown as u32,
        width: scValToJs(map.get("width")) as unknown as u32
    };
}

export type OfferType = { tag: "Glyph", values: [Buffer] } | { tag: "Asset", values: [AssetAmount] };

function OfferTypeToXdr(offerType?: OfferType): xdr.ScVal {
    if (!offerType) {
        return xdr.ScVal.scvVoid();
    }
    let res: xdr.ScVal[] = [];
    switch (offerType.tag) {
        case "Glyph":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(...((i) => [
                ((i) => xdr.ScVal.scvBytes(i))(i[0])
            ])(offerType.values));
            break;
        case "Asset":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Asset"));
            res.push(...((i) => [
                ((i) => AssetAmountToXdr(i))(i[0])
            ])(offerType.values));
            break;
    }
    return xdr.ScVal.scvVec(res);
}

function OfferTypeFromXdr(base64Xdr: string): OfferType {
    type Tag = OfferType["tag"];
    type Value = OfferType["values"];
    let [tag, values] = strToScVal(base64Xdr).vec()!.map(scValToJs) as [Tag, Value];
    if (!tag) {
        throw new Error('Missing enum tag when decoding OfferType from XDR');
    }
    return { tag, values } as OfferType;
}

export type Offer = { tag: "Glyph", values: [GlyphOfferArg] } | { tag: "Asset", values: [AssetOfferArg] };

function OfferToXdr(offer?: Offer): xdr.ScVal {
    if (!offer) {
        return xdr.ScVal.scvVoid();
    }
    let res: xdr.ScVal[] = [];
    switch (offer.tag) {
        case "Glyph":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(...((i) => [
                ((i) => GlyphOfferArgToXdr(i))(i[0])
            ])(offer.values));
            break;
        case "Asset":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Asset"));
            res.push(...((i) => [
                ((i) => AssetOfferArgToXdr(i))(i[0])
            ])(offer.values));
            break;
    }
    return xdr.ScVal.scvVec(res);
}

function OfferFromXdr(base64Xdr: string): Offer {
    type Tag = Offer["tag"];
    type Value = Offer["values"];
    let [tag, values] = strToScVal(base64Xdr).vec()!.map(scValToJs) as [Tag, Value];
    if (!tag) {
        throw new Error('Missing enum tag when decoding Offer from XDR');
    }
    return { tag, values } as Offer;
}

export interface GlyphOfferArg {
    0: u32;
    1: Array<OfferType>;
    2: Address;
    3: Buffer;
}

function GlyphOfferArgToXdr(glyphOfferArg?: GlyphOfferArg): xdr.ScVal {
    if (!glyphOfferArg) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("0"), val: ((i) => xdr.ScVal.scvU32(i))(glyphOfferArg["0"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("1"), val: ((i) => xdr.ScVal.scvVec(i.map((i) => OfferTypeToXdr(i))))(glyphOfferArg["1"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("2"), val: ((i) => addressToScVal(i))(glyphOfferArg["2"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("3"), val: ((i) => xdr.ScVal.scvBytes(i))(glyphOfferArg["3"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}


function GlyphOfferArgFromXdr(base64Xdr: string): GlyphOfferArg {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        0: scValToJs(map.get("0")) as unknown as u32,
        1: scValToJs(map.get("1")) as unknown as Array<OfferType>,
        2: scValToJs(map.get("2")) as unknown as Address,
        3: scValToJs(map.get("3")) as unknown as Buffer
    };
}

export interface AssetOfferArg {
    0: Array<Address>;
    1: AssetOffer;
}

function AssetOfferArgToXdr(assetOfferArg?: AssetOfferArg): xdr.ScVal {
    if (!assetOfferArg) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("0"), val: ((i) => xdr.ScVal.scvVec(i.map((i) => addressToScVal(i))))(assetOfferArg["0"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("1"), val: ((i) => AssetOfferToXdr(i))(assetOfferArg["1"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}


function AssetOfferArgFromXdr(base64Xdr: string): AssetOfferArg {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        0: scValToJs(map.get("0")) as unknown as Array<Address>,
        1: scValToJs(map.get("1")) as unknown as AssetOffer
    };
}

export interface AssetOffer {
    0: Buffer;
    1: Address;
    2: i128;
}

function AssetOfferToXdr(assetOffer?: AssetOffer): xdr.ScVal {
    if (!assetOffer) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("0"), val: ((i) => xdr.ScVal.scvBytes(i))(assetOffer["0"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("1"), val: ((i) => addressToScVal(i))(assetOffer["1"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("2"), val: ((i) => i128ToScVal(i))(assetOffer["2"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}


function AssetOfferFromXdr(base64Xdr: string): AssetOffer {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        0: scValToJs(map.get("0")) as unknown as Buffer,
        1: scValToJs(map.get("1")) as unknown as Address,
        2: scValToJs(map.get("2")) as unknown as i128
    };
}

export interface AssetAmount {
    0: Address;
    1: i128;
}

function AssetAmountToXdr(assetAmount?: AssetAmount): xdr.ScVal {
    if (!assetAmount) {
        return xdr.ScVal.scvVoid();
    }
    // let arr = [
    //     new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("0"), val: ((i) => addressToScVal(i))(assetAmount["0"]) }),
    //     new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("1"), val: ((i) => i128ToScVal(i))(assetAmount["1"]) })
    // ];
    // return xdr.ScVal.scvMap(arr);
    return xdr.ScVal.scvVec([
        ((i) => addressToScVal(i))(assetAmount["0"]),
        ((i) => i128ToScVal(i))(assetAmount["1"])
    ]);
}


function AssetAmountFromXdr(base64Xdr: string): AssetAmount {
    let scVal = strToScVal(base64Xdr);
    let obj: [string, any][] = scVal.map()!.map(e => [e.key().str() as string, e.val()]);
    let map = new Map<string, any>(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        0: scValToJs(map.get("0")) as unknown as Address,
        1: scValToJs(map.get("1")) as unknown as i128
    };
}
