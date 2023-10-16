import { ContractSpec, Address } from 'soroban-client';
import { Buffer } from "buffer";
import { invoke } from './invoke.js';
export * from './invoke.js';
export * from './method-options.js';
export { Address };
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
export const networks = {
    futurenet: {
        networkPassphrase: "Test SDF Future Network ; October 2022",
        contractId: "CCBL4VO5IRQHL6F2ALXHBYQCSBE52J6O6RXS4IRUUQZ5MOMR4QPVJ2LQ",
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
export class Contract {
    options;
    spec;
    constructor(options) {
        this.options = options;
        this.spec = new ContractSpec([
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
    initialize = async ({ token_address, fee_address }, options = {}) => {
        return await invoke({
            method: 'initialize',
            args: this.spec.funcArgsToScVals("initialize", { token_address: new Address(token_address), fee_address: new Address(fee_address) }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    };
    colorsMine = async ({ miner, to, colors }, options = {}) => {
        return await invoke({
            method: 'colors_mine',
            args: this.spec.funcArgsToScVals("colors_mine", { miner: new Address(miner), to, colors }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    };
    colorsTransfer = async ({ from, to, colors }, options = {}) => {
        return await invoke({
            method: 'colors_transfer',
            args: this.spec.funcArgsToScVals("colors_transfer", { from: new Address(from), to: new Address(to), colors }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    };
    colorBalance = async ({ owner, miner, color }, options = {}) => {
        return await invoke({
            method: 'color_balance',
            args: this.spec.funcArgsToScVals("color_balance", { owner: new Address(owner), miner, color }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("color_balance", xdr);
            },
        });
    };
    glyphMint = async ({ minter, to, colors, width }, options = {}) => {
        return await invoke({
            method: 'glyph_mint',
            args: this.spec.funcArgsToScVals("glyph_mint", { minter: new Address(minter), to, colors, width }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("glyph_mint", xdr);
            },
        });
    };
    glyphTransfer = async ({ to, hash_type }, options = {}) => {
        return await invoke({
            method: 'glyph_transfer',
            args: this.spec.funcArgsToScVals("glyph_transfer", { to: new Address(to), hash_type }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    };
    glyphScrape = async ({ to, hash_type }, options = {}) => {
        return await invoke({
            method: 'glyph_scrape',
            args: this.spec.funcArgsToScVals("glyph_scrape", { to, hash_type }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    };
    glyphGet = async ({ hash_type }, options = {}) => {
        try {
            return await invoke({
                method: 'glyph_get',
                args: this.spec.funcArgsToScVals("glyph_get", { hash_type }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("glyph_get", xdr));
                },
            });
        }
        catch (e) {
            let err = parseError(e.toString());
            if (err)
                return err;
            throw e;
        }
    };
    offerPost = async ({ sell, buy }, options = {}) => {
        try {
            return await invoke({
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
            let err = parseError(e.toString());
            if (err)
                return err;
            throw e;
        }
    };
    offerDelete = async ({ sell, buy }, options = {}) => {
        try {
            return await invoke({
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
            let err = parseError(e.toString());
            if (err)
                return err;
            throw e;
        }
    };
    offersGet = async ({ sell, buy }, options = {}) => {
        try {
            return await invoke({
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
            let err = parseError(e.toString());
            if (err)
                return err;
            throw e;
        }
    };
}
