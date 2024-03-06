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
exports.Contract = exports.Errors = exports.networks = void 0;
const stellar_sdk_1 = require("@stellar/stellar-sdk");
const buffer_1 = require("buffer");
const assembled_tx_js_1 = require("./assembled-tx.js");
__exportStar(require("./assembled-tx.js"), exports);
__exportStar(require("./method-options.js"), exports);
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || buffer_1.Buffer;
}
exports.networks = {
    standalone: {
        networkPassphrase: "Standalone Network ; February 2017",
        contractId: "CBHJTG65F3KBVKOEOZTPUIH47JK54WWTHOKIYRLJ64DVLZCC4ZYU6W5U",
    }
};
/**
    
    */
exports.Errors = {
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
        this.spec = new stellar_sdk_1.ContractSpec([
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAwAAAAAAAAANb3duZXJfYWRkcmVzcwAAAAAAABMAAAAAAAAADXRva2VuX2FkZHJlc3MAAAAAAAATAAAAAAAAAAtmZWVfYWRkcmVzcwAAAAATAAAAAA==",
            "AAAAAAAAAAAAAAAGdXBkYXRlAAAAAAAHAAAAAAAAAA1vd25lcl9hZGRyZXNzAAAAAAAD6AAAABMAAAAAAAAADXRva2VuX2FkZHJlc3MAAAAAAAPoAAAAEwAAAAAAAAALZmVlX2FkZHJlc3MAAAAD6AAAABMAAAAAAAAAEm1heF9lbnRyeV9saWZldGltZQAAAAAD6AAAAAQAAAAAAAAAEW1heF9wYXltZW50X2NvdW50AAAAAAAD6AAAAAQAAAAAAAAAE21pbnRlcl9yb3lhbHR5X3JhdGUAAAAD6AAAAAsAAAAAAAAAEm1pbmVyX3JveWFsdHlfcmF0ZQAAAAAD6AAAAAsAAAAA",
            "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAARoYXNoAAAD7gAAACAAAAAA",
            "AAAAAAAAAAAAAAALY29sb3JzX21pbmUAAAAABAAAAAAAAAAGc291cmNlAAAAAAATAAAAAAAAAAZjb2xvcnMAAAAAA+wAAAAEAAAABAAAAAAAAAAFbWluZXIAAAAAAAPoAAAAEwAAAAAAAAACdG8AAAAAA+gAAAATAAAAAA==",
            "AAAAAAAAAAAAAAAPY29sb3JzX3RyYW5zZmVyAAAAAAMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGY29sb3JzAAAAAAPqAAAD7QAAAAMAAAATAAAABAAAAAQAAAAA",
            "AAAAAAAAAAAAAAANY29sb3JfYmFsYW5jZQAAAAAAAAMAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAFY29sb3IAAAAAAAAEAAAAAAAAAAVtaW5lcgAAAAAAA+gAAAATAAAAAQAAAAQ=",
            "AAAAAAAAAAAAAAAKZ2x5cGhfbWludAAAAAAABAAAAAAAAAAGbWludGVyAAAAAAATAAAAAAAAAAJ0bwAAAAAD6AAAABMAAAAAAAAABmNvbG9ycwAAAAAD7AAAABMAAAPsAAAABAAAA+oAAAAEAAAAAAAAAAV3aWR0aAAAAAAAA+gAAAAEAAAAAQAAA+gAAAPuAAAAIA==",
            "AAAAAAAAAAAAAAAOZ2x5cGhfdHJhbnNmZXIAAAAAAAIAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAloYXNoX3R5cGUAAAAAAAfQAAAACEhhc2hUeXBlAAAAAA==",
            "AAAAAAAAAAAAAAAMZ2x5cGhfc2NyYXBlAAAAAgAAAAAAAAACdG8AAAAAA+gAAAATAAAAAAAAAAloYXNoX3R5cGUAAAAAAAfQAAAACEhhc2hUeXBlAAAAAA==",
            "AAAAAAAAAAAAAAAJZ2x5cGhfZ2V0AAAAAAAAAQAAAAAAAAAJaGFzaF90eXBlAAAAAAAH0AAAAAhIYXNoVHlwZQAAAAEAAAPpAAAH0AAAAAlHbHlwaFR5cGUAAAAAAAAD",
            "AAAAAAAAAAAAAAAKb2ZmZXJfcG9zdAAAAAAAAgAAAAAAAAAEc2VsbAAAB9AAAAAFT2ZmZXIAAAAAAAAAAAAAA2J1eQAAAAfQAAAABU9mZmVyAAAAAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
            "AAAAAAAAAAAAAAAMb2ZmZXJfZGVsZXRlAAAAAgAAAAAAAAAEc2VsbAAAB9AAAAAFT2ZmZXIAAAAAAAAAAAAAA2J1eQAAAAPoAAAH0AAAAAVPZmZlcgAAAAAAAAEAAAPpAAAD7QAAAAAAAAAD",
            "AAAAAAAAAAAAAAAKb2ZmZXJzX2dldAAAAAAAAgAAAAAAAAAEc2VsbAAAB9AAAAAFT2ZmZXIAAAAAAAAAAAAAA2J1eQAAAAPoAAAH0AAAAAVPZmZlcgAAAAAAAAEAAAPpAAAD7QAAAAAAAAAD",
            "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAACAAAAAAAAAAITm90Rm91bmQAAAABAAAAAAAAAAhOb3RFbXB0eQAAAAIAAAAAAAAADU5vdEF1dGhvcml6ZWQAAAAAAAADAAAAAAAAAAxOb3RQZXJtaXR0ZWQAAAAEAAAAAAAAAAxNaXNzaW5nV2lkdGgAAAAFAAAAAAAAAAlNaXNzaW5nSWQAAAAAAAAGAAAAAAAAAA5NaXNzaW5nQWRkcmVzcwAAAAAABwAAAAAAAAAKTWlzc2luZ0J1eQAAAAAACA==",
            "AAAAAgAAAAAAAAAAAAAAClN0b3JhZ2VLZXkAAAAAAA4AAAAAAAAAAAAAAAxPd25lckFkZHJlc3MAAAAAAAAAAAAAAAxUb2tlbkFkZHJlc3MAAAAAAAAAAAAAAApGZWVBZGRyZXNzAAAAAAAAAAAAAAAAABBNYXhFbnRyeUxpZmV0aW1lAAAAAAAAAAAAAAAPTWF4UGF5bWVudENvdW50AAAAAAAAAAAAAAAAEU1pbnRlclJveWFsdHlSYXRlAAAAAAAAAAAAAAAAAAAQTWluZXJSb3lhbHR5UmF0ZQAAAAEAAAAAAAAABUNvbG9yAAAAAAAAAwAAABMAAAATAAAABAAAAAEAAAAAAAAABkNvbG9ycwAAAAAAAQAAABMAAAABAAAAAAAAAAVHbHlwaAAAAAAAAAEAAAPuAAAAIAAAAAEAAAAAAAAACkdseXBoT3duZXIAAAAAAAEAAAPuAAAAIAAAAAEAAAAAAAAAC0dseXBoTWludGVyAAAAAAEAAAPuAAAAIAAAAAEAAAAAAAAACkdseXBoT2ZmZXIAAAAAAAEAAAPuAAAAIAAAAAEAAAAAAAAACkFzc2V0T2ZmZXIAAAAAAAMAAAPuAAAAIAAAABMAAAAL",
            "AAAAAgAAAAAAAAAAAAAACEhhc2hUeXBlAAAAAgAAAAEAAAAAAAAABkNvbG9ycwAAAAAAAQAAABMAAAABAAAAAAAAAAVHbHlwaAAAAAAAAAEAAAPuAAAAIA==",
            "AAAAAgAAAAAAAAAAAAAACUdseXBoVHlwZQAAAAAAAAIAAAABAAAAAAAAAAZDb2xvcnMAAAAAAAEAAAPsAAAAEwAAA+wAAAAEAAAD6gAAAAQAAAABAAAAAAAAAAVHbHlwaAAAAAAAAAEAAAfQAAAABUdseXBoAAAA",
            "AAAAAQAAAAAAAAAAAAAABUdseXBoAAAAAAAAAwAAAAAAAAAGY29sb3JzAAAAAAPsAAAAEwAAA+wAAAAEAAAD6gAAAAQAAAAAAAAABmxlbmd0aAAAAAAABAAAAAAAAAAFd2lkdGgAAAAAAAAE",
            "AAAAAgAAAAAAAAAAAAAAC09mZmVyQ3JlYXRlAAAAAAIAAAABAAAAAAAAAAVHbHlwaAAAAAAAAAIAAAPuAAAAIAAAB9AAAAAFT2ZmZXIAAAAAAAABAAAAAAAAAAVBc3NldAAAAAAAAAQAAAPuAAAAIAAAABMAAAATAAAACw==",
            "AAAAAgAAAAAAAAAAAAAABU9mZmVyAAAAAAAAAwAAAAEAAAAAAAAABUdseXBoAAAAAAAAAQAAA+4AAAAgAAAAAQAAAAAAAAAFQXNzZXQAAAAAAAACAAAAEwAAAAsAAAABAAAAAAAAAAlBc3NldFNlbGwAAAAAAAADAAAAEwAAABMAAAAL"
        ]);
    }
    parsers = {
        initialize: () => { },
        update: () => { },
        upgrade: () => { },
        colorsMine: () => { },
        colorsTransfer: () => { },
        colorBalance: (result) => this.spec.funcResToNative("color_balance", result),
        glyphMint: (result) => this.spec.funcResToNative("glyph_mint", result),
        glyphTransfer: () => { },
        glyphScrape: () => { },
        glyphGet: (result) => {
            if (result instanceof assembled_tx_js_1.Err)
                return result;
            return new assembled_tx_js_1.Ok(this.spec.funcResToNative("glyph_get", result));
        },
        offerPost: (result) => {
            if (result instanceof assembled_tx_js_1.Err)
                return result;
            return new assembled_tx_js_1.Ok(this.spec.funcResToNative("offer_post", result));
        },
        offerDelete: (result) => {
            if (result instanceof assembled_tx_js_1.Err)
                return result;
            return new assembled_tx_js_1.Ok(this.spec.funcResToNative("offer_delete", result));
        },
        offersGet: (result) => {
            if (result instanceof assembled_tx_js_1.Err)
                return result;
            return new assembled_tx_js_1.Ok(this.spec.funcResToNative("offers_get", result));
        }
    };
    txFromJSON = (json) => {
        const { method, ...tx } = JSON.parse(json);
        return assembled_tx_js_1.AssembledTransaction.fromJSON({
            ...this.options,
            method,
            parseResultXdr: this.parsers[method],
        }, tx);
    };
    fromJSON = {
        initialize: (this.txFromJSON),
        update: (this.txFromJSON),
        upgrade: (this.txFromJSON),
        colorsMine: (this.txFromJSON),
        colorsTransfer: (this.txFromJSON),
        colorBalance: (this.txFromJSON),
        glyphMint: (this.txFromJSON),
        glyphTransfer: (this.txFromJSON),
        glyphScrape: (this.txFromJSON),
        glyphGet: (this.txFromJSON),
        offerPost: (this.txFromJSON),
        offerDelete: (this.txFromJSON),
        offersGet: (this.txFromJSON)
    };
    /**
* Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    initialize = async ({ owner_address, token_address, fee_address }, options = {}) => {
        return await assembled_tx_js_1.AssembledTransaction.fromSimulation({
            method: 'initialize',
            args: this.spec.funcArgsToScVals("initialize", { owner_address: new stellar_sdk_1.Address(owner_address), token_address: new stellar_sdk_1.Address(token_address), fee_address: new stellar_sdk_1.Address(fee_address) }),
            ...options,
            ...this.options,
            errorTypes: exports.Errors,
            parseResultXdr: this.parsers['initialize'],
        });
    };
    /**
* Construct and simulate a update transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    update = async ({ owner_address, token_address, fee_address, max_entry_lifetime, max_payment_count, minter_royalty_rate, miner_royalty_rate }, options = {}) => {
        return await assembled_tx_js_1.AssembledTransaction.fromSimulation({
            method: 'update',
            args: this.spec.funcArgsToScVals("update", { owner_address, token_address, fee_address, max_entry_lifetime, max_payment_count, minter_royalty_rate, miner_royalty_rate }),
            ...options,
            ...this.options,
            errorTypes: exports.Errors,
            parseResultXdr: this.parsers['update'],
        });
    };
    /**
* Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    upgrade = async ({ hash }, options = {}) => {
        return await assembled_tx_js_1.AssembledTransaction.fromSimulation({
            method: 'upgrade',
            args: this.spec.funcArgsToScVals("upgrade", { hash }),
            ...options,
            ...this.options,
            errorTypes: exports.Errors,
            parseResultXdr: this.parsers['upgrade'],
        });
    };
    /**
* Construct and simulate a colors_mine transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    colorsMine = async ({ source, colors, miner, to }, options = {}) => {
        return await assembled_tx_js_1.AssembledTransaction.fromSimulation({
            method: 'colors_mine',
            args: this.spec.funcArgsToScVals("colors_mine", { source: new stellar_sdk_1.Address(source), colors, miner, to }),
            ...options,
            ...this.options,
            errorTypes: exports.Errors,
            parseResultXdr: this.parsers['colorsMine'],
        });
    };
    /**
* Construct and simulate a colors_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    colorsTransfer = async ({ from, to, colors }, options = {}) => {
        return await assembled_tx_js_1.AssembledTransaction.fromSimulation({
            method: 'colors_transfer',
            args: this.spec.funcArgsToScVals("colors_transfer", { from: new stellar_sdk_1.Address(from), to: new stellar_sdk_1.Address(to), colors }),
            ...options,
            ...this.options,
            errorTypes: exports.Errors,
            parseResultXdr: this.parsers['colorsTransfer'],
        });
    };
    /**
* Construct and simulate a color_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    colorBalance = async ({ owner, color, miner }, options = {}) => {
        return await assembled_tx_js_1.AssembledTransaction.fromSimulation({
            method: 'color_balance',
            args: this.spec.funcArgsToScVals("color_balance", { owner: new stellar_sdk_1.Address(owner), color, miner }),
            ...options,
            ...this.options,
            errorTypes: exports.Errors,
            parseResultXdr: this.parsers['colorBalance'],
        });
    };
    /**
* Construct and simulate a glyph_mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    glyphMint = async ({ minter, to, colors, width }, options = {}) => {
        return await assembled_tx_js_1.AssembledTransaction.fromSimulation({
            method: 'glyph_mint',
            args: this.spec.funcArgsToScVals("glyph_mint", { minter: new stellar_sdk_1.Address(minter), to, colors, width }),
            ...options,
            ...this.options,
            errorTypes: exports.Errors,
            parseResultXdr: this.parsers['glyphMint'],
        });
    };
    /**
* Construct and simulate a glyph_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    glyphTransfer = async ({ to, hash_type }, options = {}) => {
        return await assembled_tx_js_1.AssembledTransaction.fromSimulation({
            method: 'glyph_transfer',
            args: this.spec.funcArgsToScVals("glyph_transfer", { to: new stellar_sdk_1.Address(to), hash_type }),
            ...options,
            ...this.options,
            errorTypes: exports.Errors,
            parseResultXdr: this.parsers['glyphTransfer'],
        });
    };
    /**
* Construct and simulate a glyph_scrape transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    glyphScrape = async ({ to, hash_type }, options = {}) => {
        return await assembled_tx_js_1.AssembledTransaction.fromSimulation({
            method: 'glyph_scrape',
            args: this.spec.funcArgsToScVals("glyph_scrape", { to, hash_type }),
            ...options,
            ...this.options,
            errorTypes: exports.Errors,
            parseResultXdr: this.parsers['glyphScrape'],
        });
    };
    /**
* Construct and simulate a glyph_get transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    glyphGet = async ({ hash_type }, options = {}) => {
        return await assembled_tx_js_1.AssembledTransaction.fromSimulation({
            method: 'glyph_get',
            args: this.spec.funcArgsToScVals("glyph_get", { hash_type }),
            ...options,
            ...this.options,
            errorTypes: exports.Errors,
            parseResultXdr: this.parsers['glyphGet'],
        });
    };
    /**
* Construct and simulate a offer_post transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    offerPost = async ({ sell, buy }, options = {}) => {
        return await assembled_tx_js_1.AssembledTransaction.fromSimulation({
            method: 'offer_post',
            args: this.spec.funcArgsToScVals("offer_post", { sell, buy }),
            ...options,
            ...this.options,
            errorTypes: exports.Errors,
            parseResultXdr: this.parsers['offerPost'],
        });
    };
    /**
* Construct and simulate a offer_delete transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    offerDelete = async ({ sell, buy }, options = {}) => {
        return await assembled_tx_js_1.AssembledTransaction.fromSimulation({
            method: 'offer_delete',
            args: this.spec.funcArgsToScVals("offer_delete", { sell, buy }),
            ...options,
            ...this.options,
            errorTypes: exports.Errors,
            parseResultXdr: this.parsers['offerDelete'],
        });
    };
    /**
* Construct and simulate a offers_get transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    offersGet = async ({ sell, buy }, options = {}) => {
        return await assembled_tx_js_1.AssembledTransaction.fromSimulation({
            method: 'offers_get',
            args: this.spec.funcArgsToScVals("offers_get", { sell, buy }),
            ...options,
            ...this.options,
            errorTypes: exports.Errors,
            parseResultXdr: this.parsers['offersGet'],
        });
    };
}
exports.Contract = Contract;
