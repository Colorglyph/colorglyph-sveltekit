import { xdr } from 'soroban-client';
import { Buffer } from "buffer";
import { scValStrToJs, scValToJs, addressToScVal, i128ToScVal, strToScVal } from './convert.js';
import { invoke } from './invoke.js';
export * from './constants.js';
export * from './server.js';
export * from './invoke.js';
;
;
export class Ok {
    value;
    constructor(value) {
        this.value = value;
    }
    unwrapErr() {
        throw new Error('No error');
    }
    unwrap() {
        return this.value;
    }
    isOk() {
        return true;
    }
    isErr() {
        return !this.isOk();
    }
}
export class Err {
    error;
    constructor(error) {
        this.error = error;
    }
    unwrapErr() {
        return this.error;
    }
    unwrap() {
        throw new Error(this.error.message);
    }
    isOk() {
        return false;
    }
    isErr() {
        return !this.isOk();
    }
}
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
const regex = /ContractError\((\d+)\)/;
function getError(err) {
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
        return new Err(Errors[i]);
    }
    return undefined;
}
export async function initialize({ token_address, fee_address }, options = {}) {
    return await invoke({
        method: 'initialize',
        args: [((i) => addressToScVal(i))(token_address),
            ((i) => addressToScVal(i))(fee_address)],
        ...options,
        parseResultXdr: () => { },
    });
}
export async function colorsMine({ miner, to, colors }, options = {}) {
    return await invoke({
        method: 'colors_mine',
        args: [((i) => addressToScVal(i))(miner),
            ((i) => (!i) ? xdr.ScVal.scvVoid() : addressToScVal(i))(to),
            ((i) => xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                return new xdr.ScMapEntry({
                    key: ((i) => xdr.ScVal.scvU32(i))(key),
                    val: ((i) => xdr.ScVal.scvU32(i))(value)
                });
            })))(colors)],
        ...options,
        parseResultXdr: () => { },
    });
}
export async function colorsTransfer({ from, to, colors }, options = {}) {
    return await invoke({
        method: 'colors_transfer',
        args: [((i) => addressToScVal(i))(from),
            ((i) => addressToScVal(i))(to),
            ((i) => xdr.ScVal.scvVec(i.map((i) => xdr.ScVal.scvVec([((i) => addressToScVal(i))(i[0]),
                ((i) => xdr.ScVal.scvU32(i))(i[1]),
                ((i) => xdr.ScVal.scvU32(i))(i[2])]))))(colors)],
        ...options,
        parseResultXdr: () => { },
    });
}
export async function colorBalance({ owner, miner, color }, options = {}) {
    return await invoke({
        method: 'color_balance',
        args: [((i) => addressToScVal(i))(owner),
            ((i) => (!i) ? xdr.ScVal.scvVoid() : addressToScVal(i))(miner),
            ((i) => xdr.ScVal.scvU32(i))(color)],
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
        },
    });
}
export async function glyphMint({ minter, to, colors, width }, options = {}) {
    return await invoke({
        method: 'glyph_mint',
        args: [((i) => addressToScVal(i))(minter),
            ((i) => (!i) ? xdr.ScVal.scvVoid() : addressToScVal(i))(to),
            ((i) => xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                return new xdr.ScMapEntry({
                    key: ((i) => addressToScVal(i))(key),
                    val: ((i) => xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                        return new xdr.ScMapEntry({
                            key: ((i) => xdr.ScVal.scvU32(i))(key),
                            val: ((i) => xdr.ScVal.scvVec(i.map((i) => xdr.ScVal.scvU32(i))))(value)
                        });
                    })))(value)
                });
            })))(colors),
            ((i) => (!i) ? xdr.ScVal.scvVoid() : xdr.ScVal.scvU32(i))(width)],
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
        },
    });
}
export async function glyphTransfer({ to, hash_type }, options = {}) {
    return await invoke({
        method: 'glyph_transfer',
        args: [((i) => addressToScVal(i))(to),
            ((i) => HashTypeToXdr(i))(hash_type)],
        ...options,
        parseResultXdr: () => { },
    });
}
export async function glyphScrape({ to, hash_type }, options = {}) {
    return await invoke({
        method: 'glyph_scrape',
        args: [((i) => (!i) ? xdr.ScVal.scvVoid() : addressToScVal(i))(to),
            ((i) => HashTypeToXdr(i))(hash_type)],
        ...options,
        parseResultXdr: () => { },
    });
}
export async function glyphGet({ hash_type }, options = {}) {
    return await invoke({
        method: 'glyph_get',
        args: [((i) => HashTypeToXdr(i))(hash_type)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok(scValStrToJs(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
export async function offerPost({ sell, buy }, options = {}) {
    return await invoke({
        method: 'offer_post',
        args: [((i) => OfferToXdr(i))(sell),
            ((i) => OfferToXdr(i))(buy)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok(scValStrToJs(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
export async function offerDelete({ sell, buy }, options = {}) {
    return await invoke({
        method: 'offer_delete',
        args: [((i) => OfferToXdr(i))(sell),
            ((i) => (!i) ? xdr.ScVal.scvVoid() : OfferToXdr(i))(buy)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok(scValStrToJs(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
export async function offersGet({ sell, buy }, options = {}) {
    return await invoke({
        method: 'offers_get',
        args: [((i) => OfferToXdr(i))(sell),
            ((i) => (!i) ? xdr.ScVal.scvVoid() : OfferToXdr(i))(buy)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok(scValStrToJs(xdr));
            }
            catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                }
                else {
                    throw e;
                }
            }
        },
    });
}
const Errors = [
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" },
    { message: "" }
];
function StorageKeyToXdr(storageKey) {
    if (!storageKey) {
        return xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (storageKey.tag) {
        case "TokenAddress":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("TokenAddress"));
            break;
        case "FeeAddress":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("FeeAddress"));
            break;
        case "Color":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Color"));
            res.push(((i) => addressToScVal(i))(storageKey.values[0]));
            res.push(((i) => addressToScVal(i))(storageKey.values[1]));
            res.push(((i) => xdr.ScVal.scvU32(i))(storageKey.values[2]));
            break;
        case "Colors":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Colors"));
            res.push(((i) => addressToScVal(i))(storageKey.values[0]));
            break;
        case "Glyph":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(((i) => xdr.ScVal.scvBytes(i))(storageKey.values[0]));
            break;
        case "Dust":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Dust"));
            res.push(((i) => addressToScVal(i))(storageKey.values[0]));
            break;
        case "GlyphOwner":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("GlyphOwner"));
            res.push(((i) => xdr.ScVal.scvBytes(i))(storageKey.values[0]));
            break;
        case "GlyphMinter":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("GlyphMinter"));
            res.push(((i) => xdr.ScVal.scvBytes(i))(storageKey.values[0]));
            break;
        case "GlyphOffer":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("GlyphOffer"));
            res.push(((i) => xdr.ScVal.scvBytes(i))(storageKey.values[0]));
            break;
        case "AssetOffer":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("AssetOffer"));
            res.push(((i) => xdr.ScVal.scvBytes(i))(storageKey.values[0]));
            res.push(((i) => addressToScVal(i))(storageKey.values[1]));
            res.push(((i) => i128ToScVal(i))(storageKey.values[2]));
            break;
    }
    return xdr.ScVal.scvVec(res);
}
function StorageKeyFromXdr(base64Xdr) {
    let [tag, values] = strToScVal(base64Xdr).vec().map(scValToJs);
    if (!tag) {
        throw new Error('Missing enum tag when decoding StorageKey from XDR');
    }
    return { tag, values };
}
function HashTypeToXdr(hashType) {
    if (!hashType) {
        return xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (hashType.tag) {
        case "Colors":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Colors"));
            res.push(((i) => addressToScVal(i))(hashType.values[0]));
            break;
        case "Dust":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Dust"));
            res.push(((i) => addressToScVal(i))(hashType.values[0]));
            break;
        case "Glyph":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(((i) => xdr.ScVal.scvBytes(i))(hashType.values[0]));
            break;
    }
    return xdr.ScVal.scvVec(res);
}
function HashTypeFromXdr(base64Xdr) {
    let [tag, values] = strToScVal(base64Xdr).vec().map(scValToJs);
    if (!tag) {
        throw new Error('Missing enum tag when decoding HashType from XDR');
    }
    return { tag, values };
}
function GlyphTypeToXdr(glyphType) {
    if (!glyphType) {
        return xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (glyphType.tag) {
        case "Colors":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Colors"));
            res.push(((i) => xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                return new xdr.ScMapEntry({
                    key: ((i) => addressToScVal(i))(key),
                    val: ((i) => xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                        return new xdr.ScMapEntry({
                            key: ((i) => xdr.ScVal.scvU32(i))(key),
                            val: ((i) => xdr.ScVal.scvVec(i.map((i) => xdr.ScVal.scvU32(i))))(value)
                        });
                    })))(value)
                });
            })))(glyphType.values[0]));
            break;
        case "Glyph":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(((i) => GlyphToXdr(i))(glyphType.values[0]));
            break;
    }
    return xdr.ScVal.scvVec(res);
}
function GlyphTypeFromXdr(base64Xdr) {
    let [tag, values] = strToScVal(base64Xdr).vec().map(scValToJs);
    if (!tag) {
        throw new Error('Missing enum tag when decoding GlyphType from XDR');
    }
    return { tag, values };
}
function GlyphToXdr(glyph) {
    if (!glyph) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("colors"), val: ((i) => xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                return new xdr.ScMapEntry({
                    key: ((i) => addressToScVal(i))(key),
                    val: ((i) => xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                        return new xdr.ScMapEntry({
                            key: ((i) => xdr.ScVal.scvU32(i))(key),
                            val: ((i) => xdr.ScVal.scvVec(i.map((i) => xdr.ScVal.scvU32(i))))(value)
                        });
                    })))(value)
                });
            })))(glyph["colors"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("length"), val: ((i) => xdr.ScVal.scvU32(i))(glyph["length"]) }),
        new xdr.ScMapEntry({ key: ((i) => xdr.ScVal.scvSymbol(i))("width"), val: ((i) => xdr.ScVal.scvU32(i))(glyph["width"]) })
    ];
    return xdr.ScVal.scvMap(arr);
}
function GlyphFromXdr(base64Xdr) {
    let scVal = strToScVal(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        colors: scValToJs(map.get("colors")),
        length: scValToJs(map.get("length")),
        width: scValToJs(map.get("width"))
    };
}
function OfferCreateToXdr(offerCreate) {
    if (!offerCreate) {
        return xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (offerCreate.tag) {
        case "Glyph":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(((i) => xdr.ScVal.scvBytes(i))(offerCreate.values[0]));
            res.push(((i) => OfferToXdr(i))(offerCreate.values[1]));
            break;
        case "Asset":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Asset"));
            res.push(((i) => xdr.ScVal.scvBytes(i))(offerCreate.values[0]));
            res.push(((i) => addressToScVal(i))(offerCreate.values[1]));
            res.push(((i) => addressToScVal(i))(offerCreate.values[2]));
            res.push(((i) => i128ToScVal(i))(offerCreate.values[3]));
            break;
    }
    return xdr.ScVal.scvVec(res);
}
function OfferCreateFromXdr(base64Xdr) {
    let [tag, values] = strToScVal(base64Xdr).vec().map(scValToJs);
    if (!tag) {
        throw new Error('Missing enum tag when decoding OfferCreate from XDR');
    }
    return { tag, values };
}
function OfferToXdr(offer) {
    if (!offer) {
        return xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (offer.tag) {
        case "Glyph":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(((i) => xdr.ScVal.scvBytes(i))(offer.values[0]));
            break;
        case "Asset":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Asset"));
            res.push(((i) => addressToScVal(i))(offer.values[0]));
            res.push(((i) => i128ToScVal(i))(offer.values[1]));
            break;
        case "AssetSell":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("AssetSell"));
            res.push(((i) => addressToScVal(i))(offer.values[0]));
            res.push(((i) => addressToScVal(i))(offer.values[1]));
            res.push(((i) => i128ToScVal(i))(offer.values[2]));
            break;
    }
    return xdr.ScVal.scvVec(res);
}
function OfferFromXdr(base64Xdr) {
    let [tag, values] = strToScVal(base64Xdr).vec().map(scValToJs);
    if (!tag) {
        throw new Error('Missing enum tag when decoding Offer from XDR');
    }
    return { tag, values };
}
