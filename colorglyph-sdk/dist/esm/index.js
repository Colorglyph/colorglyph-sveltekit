import { ContractSpec, Address } from '@stellar/stellar-sdk';
import { Buffer } from "buffer";
import { AssembledTransaction, Ok, Err } from './assembled-tx.js';
export * from './assembled-tx.js';
export * from './method-options.js';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    futurenet: {
        networkPassphrase: "Test SDF Future Network ; October 2022",
        contractId: "CDMGYHGOOT6B47C4UG2RY5C2H34FXA4H6B7I43BSCDS3A7I2FUOFQ563",
    }
};
/**
    
    */
export const Errors = {
    1: { message: "" },
    2: { message: "" },
    3: { message: "" },
    4: { message: "" },
    5: { message: "" },
    6: { message: "" },
    7: { message: "" },
    8: { message: "" }
};
export class Contract {
    options;
    spec;
    constructor(options) {
        this.options = options;
        this.spec = new ContractSpec([
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAANdG9rZW5fYWRkcmVzcwAAAAAAABMAAAAAAAAAC2ZlZV9hZGRyZXNzAAAAABMAAAAA",
            "AAAAAAAAAAAAAAALY29sb3JzX21pbmUAAAAABAAAAAAAAAAGc291cmNlAAAAAAATAAAAAAAAAAVtaW5lcgAAAAAAA+gAAAATAAAAAAAAAAJ0bwAAAAAD6AAAABMAAAAAAAAABmNvbG9ycwAAAAAD7AAAAAQAAAAEAAAAAA==",
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
    parsers = {
        initialize: () => { },
        colorsMine: () => { },
        colorsTransfer: () => { },
        colorBalance: (result) => this.spec.funcResToNative("color_balance", result),
        glyphMint: (result) => this.spec.funcResToNative("glyph_mint", result),
        glyphTransfer: () => { },
        glyphScrape: () => { },
        glyphGet: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("glyph_get", result));
        },
        offerPost: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("offer_post", result));
        },
        offerDelete: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("offer_delete", result));
        },
        offersGet: (result) => {
            if (result instanceof Err)
                return result;
            return new Ok(this.spec.funcResToNative("offers_get", result));
        }
    };
    txFromJSON = (json) => {
        const { method, ...tx } = JSON.parse(json);
        return AssembledTransaction.fromJSON({
            ...this.options,
            method,
            parseResultXdr: this.parsers[method],
        }, tx);
    };
    fromJSON = {
        initialize: (this.txFromJSON),
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
    initialize = async ({ token_address, fee_address }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'initialize',
            args: this.spec.funcArgsToScVals("initialize", { token_address: new Address(token_address), fee_address: new Address(fee_address) }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['initialize'],
        });
    };
    /**
* Construct and simulate a colors_mine transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    colorsMine = async ({ source, miner, to, colors }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'colors_mine',
            args: this.spec.funcArgsToScVals("colors_mine", { source: new Address(source), miner, to, colors }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['colorsMine'],
        });
    };
    /**
* Construct and simulate a colors_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    colorsTransfer = async ({ from, to, colors }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'colors_transfer',
            args: this.spec.funcArgsToScVals("colors_transfer", { from: new Address(from), to: new Address(to), colors }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['colorsTransfer'],
        });
    };
    /**
* Construct and simulate a color_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    colorBalance = async ({ owner, miner, color }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'color_balance',
            args: this.spec.funcArgsToScVals("color_balance", { owner: new Address(owner), miner, color }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['colorBalance'],
        });
    };
    /**
* Construct and simulate a glyph_mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    glyphMint = async ({ minter, to, colors, width }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'glyph_mint',
            args: this.spec.funcArgsToScVals("glyph_mint", { minter: new Address(minter), to, colors, width }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['glyphMint'],
        });
    };
    /**
* Construct and simulate a glyph_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    glyphTransfer = async ({ to, hash_type }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'glyph_transfer',
            args: this.spec.funcArgsToScVals("glyph_transfer", { to: new Address(to), hash_type }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['glyphTransfer'],
        });
    };
    /**
* Construct and simulate a glyph_scrape transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    glyphScrape = async ({ to, hash_type }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'glyph_scrape',
            args: this.spec.funcArgsToScVals("glyph_scrape", { to, hash_type }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['glyphScrape'],
        });
    };
    /**
* Construct and simulate a glyph_get transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    glyphGet = async ({ hash_type }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'glyph_get',
            args: this.spec.funcArgsToScVals("glyph_get", { hash_type }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['glyphGet'],
        });
    };
    /**
* Construct and simulate a offer_post transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    offerPost = async ({ sell, buy }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'offer_post',
            args: this.spec.funcArgsToScVals("offer_post", { sell, buy }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['offerPost'],
        });
    };
    /**
* Construct and simulate a offer_delete transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    offerDelete = async ({ sell, buy }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'offer_delete',
            args: this.spec.funcArgsToScVals("offer_delete", { sell, buy }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['offerDelete'],
        });
    };
    /**
* Construct and simulate a offers_get transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    offersGet = async ({ sell, buy }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'offers_get',
            args: this.spec.funcArgsToScVals("offers_get", { sell, buy }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['offersGet'],
        });
    };
}
