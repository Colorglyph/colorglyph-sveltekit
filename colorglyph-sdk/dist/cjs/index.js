"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.offersGet = exports.offerDelete = exports.offerPost = exports.glyphGet = exports.glyphScrape = exports.glyphTransfer = exports.glyphMint = exports.colorBalance = exports.colorsTransfer = exports.colorsMine = exports.initialize = exports.Err = exports.Ok = void 0;
const soroban_client_1 = require("soroban-client");
const buffer_1 = require("buffer");
const convert_js_1 = require("./convert.js");
const invoke_js_1 = require("./invoke.js");
__exportStar(require("./constants.js"), exports);
__exportStar(require("./server.js"), exports);
__exportStar(require("./invoke.js"), exports);
;
;
class Ok {
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
exports.Ok = Ok;
class Err {
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
exports.Err = Err;
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || buffer_1.Buffer;
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
async function initialize({ token_address, fee_address }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'initialize',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(token_address),
            ((i) => (0, convert_js_1.addressToScVal)(i))(fee_address)],
        ...options,
        parseResultXdr: () => { },
    });
}
exports.initialize = initialize;
async function colorsMine({ miner, to, colors }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'colors_mine',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(miner),
            ((i) => (!i) ? soroban_client_1.xdr.ScVal.scvVoid() : (0, convert_js_1.addressToScVal)(i))(to),
            ((i) => soroban_client_1.xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                return new soroban_client_1.xdr.ScMapEntry({
                    key: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(key),
                    val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(value)
                });
            })))(colors)],
        ...options,
        parseResultXdr: () => { },
    });
}
exports.colorsMine = colorsMine;
async function colorsTransfer({ from, to, colors }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'colors_transfer',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(from),
            ((i) => (0, convert_js_1.addressToScVal)(i))(to),
            ((i) => soroban_client_1.xdr.ScVal.scvVec(i.map((i) => soroban_client_1.xdr.ScVal.scvVec([((i) => (0, convert_js_1.addressToScVal)(i))(i[0]),
                ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(i[1]),
                ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(i[2])]))))(colors)],
        ...options,
        parseResultXdr: () => { },
    });
}
exports.colorsTransfer = colorsTransfer;
async function colorBalance({ owner, miner, color }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'color_balance',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(owner),
            ((i) => (!i) ? soroban_client_1.xdr.ScVal.scvVoid() : (0, convert_js_1.addressToScVal)(i))(miner),
            ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(color)],
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.colorBalance = colorBalance;
async function glyphMint({ minter, to, colors, width, id }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'glyph_mint',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(minter),
            ((i) => (!i) ? soroban_client_1.xdr.ScVal.scvVoid() : (0, convert_js_1.addressToScVal)(i))(to),
            ((i) => (!i) ? soroban_client_1.xdr.ScVal.scvVoid() : soroban_client_1.xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                return new soroban_client_1.xdr.ScMapEntry({
                    key: ((i) => (0, convert_js_1.addressToScVal)(i))(key),
                    val: ((i) => soroban_client_1.xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                        return new soroban_client_1.xdr.ScMapEntry({
                            key: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(key),
                            val: ((i) => soroban_client_1.xdr.ScVal.scvVec(i.map((i) => soroban_client_1.xdr.ScVal.scvU32(i))))(value)
                        });
                    })))(value)
                });
            })))(colors),
            ((i) => (!i) ? soroban_client_1.xdr.ScVal.scvVoid() : soroban_client_1.xdr.ScVal.scvU32(i))(width),
            ((i) => (!i) ? soroban_client_1.xdr.ScVal.scvVoid() : soroban_client_1.xdr.ScVal.scvU64(soroban_client_1.xdr.Uint64.fromString(i.toString())))(id)],
        ...options,
        parseResultXdr: (xdr) => {
            return HashIdFromXdr(xdr);
        },
    });
}
exports.glyphMint = glyphMint;
async function glyphTransfer({ from, to, hash_id }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'glyph_transfer',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(from),
            ((i) => (0, convert_js_1.addressToScVal)(i))(to),
            ((i) => HashIdToXdr(i))(hash_id)],
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.glyphTransfer = glyphTransfer;
async function glyphScrape({ owner, to, hash_id }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'glyph_scrape',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(owner),
            ((i) => (!i) ? soroban_client_1.xdr.ScVal.scvVoid() : (0, convert_js_1.addressToScVal)(i))(to),
            ((i) => HashIdToXdr(i))(hash_id)],
        ...options,
        parseResultXdr: (xdr) => {
            return (0, convert_js_1.scValStrToJs)(xdr);
        },
    });
}
exports.glyphScrape = glyphScrape;
async function glyphGet({ hash_id }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'glyph_get',
        args: [((i) => HashIdToXdr(i))(hash_id)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
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
exports.glyphGet = glyphGet;
async function offerPost({ seller, sell, buy }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'offer_post',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(seller),
            ((i) => OfferTypeToXdr(i))(sell),
            ((i) => OfferTypeToXdr(i))(buy)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
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
exports.offerPost = offerPost;
async function offerDelete({ seller, sell, buy }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'offer_delete',
        args: [((i) => (0, convert_js_1.addressToScVal)(i))(seller),
            ((i) => OfferTypeToXdr(i))(sell),
            ((i) => OfferTypeToXdr(i))(buy)],
        ...options,
        parseResultXdr: () => { },
    });
}
exports.offerDelete = offerDelete;
async function offersGet({ sell, buy }, options = {}) {
    return await (0, invoke_js_1.invoke)({
        method: 'offers_get',
        args: [((i) => OfferTypeToXdr(i))(sell),
            ((i) => OfferTypeToXdr(i))(buy)],
        ...options,
        parseResultXdr: (xdr) => {
            try {
                return new Ok((0, convert_js_1.scValStrToJs)(xdr));
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
exports.offersGet = offersGet;
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
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (storageKey.tag) {
        case "TokenAddress":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("TokenAddress"));
            break;
        case "FeeAddress":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("FeeAddress"));
            break;
        case "Colors":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Colors"));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvU64(soroban_client_1.xdr.Uint64.fromString(i.toString())))(storageKey.values[0]));
            break;
        case "Glyph":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(storageKey.values[0]));
            break;
        case "GlyphOwner":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("GlyphOwner"));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(storageKey.values[0]));
            break;
        case "GlyphMinter":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("GlyphMinter"));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(storageKey.values[0]));
            break;
        case "Color":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Color"));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(storageKey.values[0]));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(storageKey.values[1]));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvU32(i))(storageKey.values[2]));
            break;
        case "GlyphOffer":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("GlyphOffer"));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(storageKey.values[0]));
            break;
        case "AssetOffer":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("AssetOffer"));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(storageKey.values[0]));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(storageKey.values[1]));
            res.push(((i) => (0, convert_js_1.i128ToScVal)(i))(storageKey.values[2]));
            break;
    }
    return soroban_client_1.xdr.ScVal.scvVec(res);
}
function StorageKeyFromXdr(base64Xdr) {
    let [tag, values] = (0, convert_js_1.strToScVal)(base64Xdr).vec().map(convert_js_1.scValToJs);
    if (!tag) {
        throw new Error('Missing enum tag when decoding StorageKey from XDR');
    }
    return { tag, values };
}
function HashIdToXdr(hashId) {
    if (!hashId) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (hashId.tag) {
        case "Id":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Id"));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvU64(soroban_client_1.xdr.Uint64.fromString(i.toString())))(hashId.values[0]));
            break;
        case "Hash":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Hash"));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(hashId.values[0]));
            break;
    }
    return soroban_client_1.xdr.ScVal.scvVec(res);
}
function HashIdFromXdr(base64Xdr) {
    let [tag, values] = (0, convert_js_1.strToScVal)(base64Xdr).vec().map(convert_js_1.scValToJs);
    if (!tag) {
        throw new Error('Missing enum tag when decoding HashId from XDR');
    }
    return { tag, values };
}
function GlyphTypeToXdr(glyphType) {
    if (!glyphType) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (glyphType.tag) {
        case "Glyph":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(((i) => GlyphToXdr(i))(glyphType.values[0]));
            break;
        case "Colors":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Colors"));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                return new soroban_client_1.xdr.ScMapEntry({
                    key: ((i) => (0, convert_js_1.addressToScVal)(i))(key),
                    val: ((i) => soroban_client_1.xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                        return new soroban_client_1.xdr.ScMapEntry({
                            key: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(key),
                            val: ((i) => soroban_client_1.xdr.ScVal.scvVec(i.map((i) => soroban_client_1.xdr.ScVal.scvU32(i))))(value)
                        });
                    })))(value)
                });
            })))(glyphType.values[0]));
            break;
    }
    return soroban_client_1.xdr.ScVal.scvVec(res);
}
function GlyphTypeFromXdr(base64Xdr) {
    let [tag, values] = (0, convert_js_1.strToScVal)(base64Xdr).vec().map(convert_js_1.scValToJs);
    if (!tag) {
        throw new Error('Missing enum tag when decoding GlyphType from XDR');
    }
    return { tag, values };
}
function GlyphToXdr(glyph) {
    if (!glyph) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let arr = [
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("colors"), val: ((i) => soroban_client_1.xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                return new soroban_client_1.xdr.ScMapEntry({
                    key: ((i) => (0, convert_js_1.addressToScVal)(i))(key),
                    val: ((i) => soroban_client_1.xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                        return new soroban_client_1.xdr.ScMapEntry({
                            key: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(key),
                            val: ((i) => soroban_client_1.xdr.ScVal.scvVec(i.map((i) => soroban_client_1.xdr.ScVal.scvU32(i))))(value)
                        });
                    })))(value)
                });
            })))(glyph["colors"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("length"), val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(glyph["length"]) }),
        new soroban_client_1.xdr.ScMapEntry({ key: ((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("width"), val: ((i) => soroban_client_1.xdr.ScVal.scvU32(i))(glyph["width"]) })
    ];
    return soroban_client_1.xdr.ScVal.scvMap(arr);
}
function GlyphFromXdr(base64Xdr) {
    let scVal = (0, convert_js_1.strToScVal)(base64Xdr);
    let obj = scVal.map().map(e => [e.key().str(), e.val()]);
    let map = new Map(obj);
    if (!obj) {
        throw new Error('Invalid XDR');
    }
    return {
        colors: (0, convert_js_1.scValToJs)(map.get("colors")),
        length: (0, convert_js_1.scValToJs)(map.get("length")),
        width: (0, convert_js_1.scValToJs)(map.get("width"))
    };
}
function OfferTypeToXdr(offerType) {
    if (!offerType) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (offerType.tag) {
        case "Glyph":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(offerType.values[0]));
            break;
        case "Asset":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Asset"));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(offerType.values[0]));
            res.push(((i) => (0, convert_js_1.i128ToScVal)(i))(offerType.values[1]));
            break;
    }
    return soroban_client_1.xdr.ScVal.scvVec(res);
}
function OfferTypeFromXdr(base64Xdr) {
    let [tag, values] = (0, convert_js_1.strToScVal)(base64Xdr).vec().map(convert_js_1.scValToJs);
    if (!tag) {
        throw new Error('Missing enum tag when decoding OfferType from XDR');
    }
    return { tag, values };
}
function OfferToXdr(offer) {
    if (!offer) {
        return soroban_client_1.xdr.ScVal.scvVoid();
    }
    let res = [];
    switch (offer.tag) {
        case "Glyph":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvU32(i))(offer.values[0]));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvVec(i.map((i) => OfferTypeToXdr(i))))(offer.values[1]));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(offer.values[2]));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(offer.values[3]));
            break;
        case "Asset":
            res.push(((i) => soroban_client_1.xdr.ScVal.scvSymbol(i))("Asset"));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvVec(i.map((i) => (0, convert_js_1.addressToScVal)(i))))(offer.values[0]));
            res.push(((i) => soroban_client_1.xdr.ScVal.scvBytes(i))(offer.values[1]));
            res.push(((i) => (0, convert_js_1.addressToScVal)(i))(offer.values[2]));
            res.push(((i) => (0, convert_js_1.i128ToScVal)(i))(offer.values[3]));
            break;
    }
    return soroban_client_1.xdr.ScVal.scvVec(res);
}
function OfferFromXdr(base64Xdr) {
    let [tag, values] = (0, convert_js_1.strToScVal)(base64Xdr).vec().map(convert_js_1.scValToJs);
    if (!tag) {
        throw new Error('Missing enum tag when decoding Offer from XDR');
    }
    return { tag, values };
}
