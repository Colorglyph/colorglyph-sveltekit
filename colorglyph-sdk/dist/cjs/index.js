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
exports.Contract = exports.networks = exports.Err = exports.Ok = exports.Address = void 0;
const SorobanClient = require("soroban-client");
const soroban_client_1 = require("soroban-client");
Object.defineProperty(exports, "Address", { enumerable: true, get: function () { return soroban_client_1.Address; } });
const buffer_1 = require("buffer");
const invoke_js_1 = require("./invoke.js");
__exportStar(require("./invoke.js"), exports);
__exportStar(require("./method-options.js"), exports);
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
const regex = /Error\(Contract, #(\d+)\)/;
function parseError(message) {
    const match = message.match(regex);
    if (!match) {
        return undefined;
    }
    if (Errors === undefined) {
        return undefined;
    }
    let i = parseInt(match[1], 10);
    let err = Errors[i];
    if (err) {
        return new Err(err);
    }
    return undefined;
}
exports.networks = {
    futurenet: {
        networkPassphrase: "Test SDF Future Network ; October 2022",
        contractId: "CBLKUYT7K4RADZLNLIMTZD6FUVX2ZZF6MJVA3R7A2VZCDF4VPVK62DG7",
    }
};
const Errors = {
    1: { message: "" },
    2: { message: "" },
    3: { message: "" },
    4: { message: "" },
    5: { message: "" },
    6: { message: "" },
    7: { message: "" },
    8: { message: "" }
};
class Contract {
    options;
    spec;
    constructor(options) {
        this.options = options;
        this.spec = new soroban_client_1.ContractSpec([
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAANdG9rZW5fYWRkcmVzcwAAAAAAABMAAAAAAAAAC2ZlZV9hZGRyZXNzAAAAABMAAAAA",
            "AAAAAAAAAAAAAAALY29sb3JzX21pbmUAAAAAAwAAAAAAAAAFbWluZXIAAAAAAAATAAAAAAAAAAJ0bwAAAAAD6AAAABMAAAAAAAAABmNvbG9ycwAAAAAD7AAAAAQAAAAEAAAAAA==",
            "AAAAAAAAAAAAAAAPY29sb3JzX3RyYW5zZmVyAAAAAAMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGY29sb3JzAAAAAAPqAAAD7QAAAAMAAAATAAAABAAAAAQAAAAA",
            "AAAAAAAAAAAAAAANY29sb3JfYmFsYW5jZQAAAAAAAAMAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAFbWluZXIAAAAAAAPoAAAAEwAAAAAAAAAFY29sb3IAAAAAAAAEAAAAAQAAAAQ=",
            "AAAAAAAAAAAAAAAKZ2x5cGhfbWludAAAAAAABAAAAAAAAAAGbWludGVyAAAAAAATAAAAAAAAAAJ0bwAAAAAD6AAAABMAAAAAAAAABmNvbG9ycwAAAAAD7AAAABMAAAPsAAAABAAAA+oAAAAEAAAAAAAAAAV3aWR0aAAAAAAAA+gAAAAEAAAAAQAAA+gAAAPuAAAAIA==",
            "AAAAAAAAAAAAAAAOZ2x5cGhfdHJhbnNmZXIAAAAAAAIAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAloYXNoX3R5cGUAAAAAAAfQAAAACEhhc2hUeXBlAAAAAA==",
            "AAAAAAAAAAAAAAAMZ2x5cGhfc2NyYXBlAAAAAgAAAAAAAAACdG8AAAAAA+gAAAATAAAAAAAAAAloYXNoX3R5cGUAAAAAAAfQAAAACEhhc2hUeXBlAAAAAA==",
            "AAAAAAAAAAAAAAAJZ2x5cGhfZ2V0AAAAAAAAAQAAAAAAAAAJaGFzaF90eXBlAAAAAAAH0AAAAAhIYXNoVHlwZQAAAAEAAAPpAAAH0AAAAAlHbHlwaFR5cGUAAAAAAAAD",
            "AAAAAAAAAAAAAAAKb2ZmZXJfcG9zdAAAAAAAAgAAAAAAAAAEc2VsbAAAB9AAAAAFT2ZmZXIAAAAAAAAAAAAAA2J1eQAAAAfQAAAABU9mZmVyAAAAAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
            "AAAAAAAAAAAAAAAMb2ZmZXJfZGVsZXRlAAAAAgAAAAAAAAAEc2VsbAAAB9AAAAAFT2ZmZXIAAAAAAAAAAAAAA2J1eQAAAAPoAAAH0AAAAAVPZmZlcgAAAAAAAAEAAAPpAAAD7QAAAAAAAAAD",
            "AAAAAAAAAAAAAAAKb2ZmZXJzX2dldAAAAAAAAgAAAAAAAAAEc2VsbAAAB9AAAAAFT2ZmZXIAAAAAAAAAAAAAA2J1eQAAAAPoAAAH0AAAAAVPZmZlcgAAAAAAAAEAAAPpAAAD7QAAAAAAAAAD",
            "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAACAAAAAAAAAAITm90Rm91bmQAAAABAAAAAAAAAAhOb3RFbXB0eQAAAAIAAAAAAAAADU5vdEF1dGhvcml6ZWQAAAAAAAADAAAAAAAAAAxOb3RQZXJtaXR0ZWQAAAAEAAAAAAAAAAxNaXNzaW5nV2lkdGgAAAAFAAAAAAAAAAlNaXNzaW5nSWQAAAAAAAAGAAAAAAAAAA5NaXNzaW5nQWRkcmVzcwAAAAAABwAAAAAAAAAKTWlzc2luZ0J1eQAAAAAACA==",
            "AAAAAgAAAAAAAAAAAAAAClN0b3JhZ2VLZXkAAAAAAAoAAAAAAAAAAAAAAAxUb2tlbkFkZHJlc3MAAAAAAAAAAAAAAApGZWVBZGRyZXNzAAAAAAABAAAAAAAAAAVDb2xvcgAAAAAAAAMAAAATAAAAEwAAAAQAAAABAAAAAAAAAAZDb2xvcnMAAAAAAAEAAAATAAAAAQAAAAAAAAAFR2x5cGgAAAAAAAABAAAD7gAAACAAAAABAAAAAAAAAAREdXN0AAAAAQAAABMAAAABAAAAAAAAAApHbHlwaE93bmVyAAAAAAABAAAD7gAAACAAAAABAAAAAAAAAAtHbHlwaE1pbnRlcgAAAAABAAAD7gAAACAAAAABAAAAAAAAAApHbHlwaE9mZmVyAAAAAAABAAAD7gAAACAAAAABAAAAAAAAAApBc3NldE9mZmVyAAAAAAADAAAD7gAAACAAAAATAAAACw==",
            "AAAAAgAAAAAAAAAAAAAACEhhc2hUeXBlAAAAAwAAAAEAAAAAAAAABkNvbG9ycwAAAAAAAQAAABMAAAABAAAAAAAAAAREdXN0AAAAAQAAABMAAAABAAAAAAAAAAVHbHlwaAAAAAAAAAEAAAPuAAAAIA==",
            "AAAAAgAAAAAAAAAAAAAACUdseXBoVHlwZQAAAAAAAAIAAAABAAAAAAAAAAZDb2xvcnMAAAAAAAEAAAPsAAAAEwAAA+wAAAAEAAAD6gAAAAQAAAABAAAAAAAAAAVHbHlwaAAAAAAAAAEAAAfQAAAABUdseXBoAAAA",
            "AAAAAQAAAAAAAAAAAAAABUdseXBoAAAAAAAAAwAAAAAAAAAGY29sb3JzAAAAAAPsAAAAEwAAA+wAAAAEAAAD6gAAAAQAAAAAAAAABmxlbmd0aAAAAAAABAAAAAAAAAAFd2lkdGgAAAAAAAAE",
            "AAAAAgAAAAAAAAAAAAAAC09mZmVyQ3JlYXRlAAAAAAIAAAABAAAAAAAAAAVHbHlwaAAAAAAAAAIAAAPuAAAAIAAAB9AAAAAFT2ZmZXIAAAAAAAABAAAAAAAAAAVBc3NldAAAAAAAAAQAAAPuAAAAIAAAABMAAAATAAAACw==",
            "AAAAAgAAAAAAAAAAAAAABU9mZmVyAAAAAAAAAwAAAAEAAAAAAAAABUdseXBoAAAAAAAAAQAAA+4AAAAgAAAAAQAAAAAAAAAFQXNzZXQAAAAAAAACAAAAEwAAAAsAAAABAAAAAAAAAAlBc3NldFNlbGwAAAAAAAADAAAAEwAAABMAAAAL"
        ]);
    }
    async initialize({ token_address, fee_address }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'initialize',
            args: this.spec.funcArgsToScVals("initialize", { token_address, fee_address }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async colorsMine({ miner, to, colors }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'colors_mine',
            args: this.spec.funcArgsToScVals("colors_mine", { miner, to, colors }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async colorsTransfer({ from, to, colors }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'colors_transfer',
            args: this.spec.funcArgsToScVals("colors_transfer", { from, to, colors }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async colorBalance({ owner, miner, color }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'color_balance',
            args: this.spec.funcArgsToScVals("color_balance", { owner, miner, color }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("color_balance", xdr);
            },
        });
    }
    async glyphMint({ minter, to, colors, width }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'glyph_mint',
            args: this.spec.funcArgsToScVals("glyph_mint", { minter, to, colors, width }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("glyph_mint", xdr);
            },
        });
    }
    async glyphTransfer({ to, hash_type }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'glyph_transfer',
            args: this.spec.funcArgsToScVals("glyph_transfer", { to, hash_type }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async glyphScrape({ to, hash_type }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'glyph_scrape',
            args: this.spec.funcArgsToScVals("glyph_scrape", { to, hash_type }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async glyphGet({ hash_type }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'glyph_get',
                args: this.spec.funcArgsToScVals("glyph_get", { hash_type }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    xdr = typeof xdr === 'string' ? SorobanClient.xdr.ScVal.fromXDR(xdr, 'base64') : xdr;
                    console.log(xdr.toXDR('base64'));
                    return new Ok(SorobanClient.scValToNative(xdr));
                    // return new Ok(this.spec.funcResToNative("glyph_get", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async offerPost({ sell, buy }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'offer_post',
                args: this.spec.funcArgsToScVals("offer_post", { sell, buy }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("offer_post", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async offerDelete({ sell, buy }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'offer_delete',
                args: this.spec.funcArgsToScVals("offer_delete", { sell, buy }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("offer_delete", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async offersGet({ sell, buy }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'offers_get',
                args: this.spec.funcArgsToScVals("offers_get", { sell, buy }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("offers_get", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
}
exports.Contract = Contract;
