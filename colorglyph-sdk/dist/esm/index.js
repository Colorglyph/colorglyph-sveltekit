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
export async function glyphMint({ minter, to, colors, width, id }, options = {}) {
    return await invoke({
        method: 'glyph_mint',
        args: [((i) => addressToScVal(i))(minter),
            ((i) => (!i) ? xdr.ScVal.scvVoid() : addressToScVal(i))(to),
            ((i) => (!i) ? xdr.ScVal.scvVoid() : xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
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
            ((i) => (!i) ? xdr.ScVal.scvVoid() : xdr.ScVal.scvU32(i))(width),
            ((i) => (!i) ? xdr.ScVal.scvVoid() : xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(id)],
        ...options,
        parseResultXdr: (xdr) => {
            return HashIdFromXdr(xdr);
        },
    });
}
export async function glyphTransfer({ from, to, hash_id }, options = {}) {
    return await invoke({
        method: 'glyph_transfer',
        args: [((i) => addressToScVal(i))(from),
            ((i) => addressToScVal(i))(to),
            ((i) => HashIdToXdr(i))(hash_id)],
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
        },
    });
}
export async function glyphScrape({ owner, to, hash_id }, options = {}) {
    return await invoke({
        method: 'glyph_scrape',
        args: [((i) => addressToScVal(i))(owner),
            ((i) => (!i) ? xdr.ScVal.scvVoid() : addressToScVal(i))(to),
            ((i) => HashIdToXdr(i))(hash_id)],
        ...options,
        parseResultXdr: (xdr) => {
            return scValStrToJs(xdr);
        },
    });
}
export async function glyphGet({ hash_id }, options = {}) {
    return await invoke({
        method: 'glyph_get',
        args: [((i) => HashIdToXdr(i))(hash_id)],
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
export async function offerPost({ seller, sell, buy }, options = {}) {
    return await invoke({
        method: 'offer_post',
        args: [((i) => addressToScVal(i))(seller),
            ((i) => OfferTypeToXdr(i))(sell),
            ((i) => OfferTypeToXdr(i))(buy)],
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
export async function offerDelete({ seller, sell, buy }, options = {}) {
    return await invoke({
        method: 'offer_delete',
        args: [((i) => addressToScVal(i))(seller),
            ((i) => OfferTypeToXdr(i))(sell),
            ((i) => OfferTypeToXdr(i))(buy)],
        ...options,
        parseResultXdr: () => { },
    });
}
export async function offersGet({ sell, buy }, options = {}) {
    return await invoke({
        method: 'offers_get',
        args: [((i) => OfferTypeToXdr(i))(sell),
            ((i) => OfferTypeToXdr(i))(buy)],
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
        case "Colors":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Colors"));
            res.push(((i) => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(storageKey.values[0]));
            break;
        case "Glyph":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(((i) => xdr.ScVal.scvBytes(i))(storageKey.values[0]));
            break;
        case "GlyphOwner":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("GlyphOwner"));
            res.push(((i) => xdr.ScVal.scvBytes(i))(storageKey.values[0]));
            break;
        case "GlyphMinter":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("GlyphMinter"));
            res.push(((i) => xdr.ScVal.scvBytes(i))(storageKey.values[0]));
            break;
        case "Color":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Color"));
            res.push(((i) => addressToScVal(i))(storageKey.values[0]));
            res.push(((i) => addressToScVal(i))(storageKey.values[1]));
            res.push(((i) => xdr.ScVal.scvU32(i))(storageKey.values[2]));
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
function HashIdToXdr(hashId) {
    if (!hashId) {
        return xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (hashId.tag) {
        case "Id":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Id"));
            res.push(((i) => xdr.ScVal.scvU64(xdr.Uint64.fromString(i.toString())))(hashId.values[0]));
            break;
        case "Hash":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Hash"));
            res.push(((i) => xdr.ScVal.scvBytes(i))(hashId.values[0]));
            break;
    }
    return xdr.ScVal.scvVec(res);
}
function HashIdFromXdr(base64Xdr) {
    let [tag, values] = strToScVal(base64Xdr).vec().map(scValToJs);
    if (!tag) {
        throw new Error('Missing enum tag when decoding HashId from XDR');
    }
    return { tag, values };
}
function GlyphTypeToXdr(glyphType) {
    if (!glyphType) {
        return xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (glyphType.tag) {
        case "Glyph":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(((i) => GlyphToXdr(i))(glyphType.values[0]));
            break;
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
function OfferTypeToXdr(offerType) {
    if (!offerType) {
        return xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (offerType.tag) {
        case "Glyph":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(((i) => xdr.ScVal.scvBytes(i))(offerType.values[0]));
            break;
        case "Asset":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Asset"));
            res.push(((i) => addressToScVal(i))(offerType.values[0]));
            res.push(((i) => i128ToScVal(i))(offerType.values[1]));
            break;
    }
    return xdr.ScVal.scvVec(res);
}
function OfferTypeFromXdr(base64Xdr) {
    let [tag, values] = strToScVal(base64Xdr).vec().map(scValToJs);
    if (!tag) {
        throw new Error('Missing enum tag when decoding OfferType from XDR');
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
            res.push(((i) => xdr.ScVal.scvU32(i))(offer.values[0]));
            res.push(((i) => xdr.ScVal.scvVec(i.map((i) => OfferTypeToXdr(i))))(offer.values[1]));
            res.push(((i) => addressToScVal(i))(offer.values[2]));
            res.push(((i) => xdr.ScVal.scvBytes(i))(offer.values[3]));
            break;
        case "Asset":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Asset"));
            res.push(((i) => xdr.ScVal.scvVec(i.map((i) => addressToScVal(i))))(offer.values[0]));
            res.push(((i) => xdr.ScVal.scvBytes(i))(offer.values[1]));
            res.push(((i) => addressToScVal(i))(offer.values[2]));
            res.push(((i) => i128ToScVal(i))(offer.values[3]));
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
