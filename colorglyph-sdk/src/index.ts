import * as SorobanClient from 'soroban-client';
import { xdr } from 'soroban-client';
import { Buffer } from "buffer";
import { scValStrToJs, scValToJs, addressToScVal, u128ToScVal, i128ToScVal, strToScVal } from './convert.js';
import { invoke } from './invoke.js';
import type { ResponseTypes, Wallet } from './method-options.js'

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

export async function initialize<R extends ResponseTypes = undefined>({ token_address, fee_address }: { token_address: Address, fee_address: Address }, options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
    /**
     * A Wallet interface, such as Freighter, that has the methods `isConnected`, `isAllowed`, `getUserInfo`, and `signTransaction`. If not provided, will attempt to import and use Freighter. Example:
     *
     * ```ts
     * import freighter from "@stellar/freighter-api";
     *
     * // later, when calling this function:
     *   wallet: freighter,
     */
    wallet?: Wallet
} = {}) {
    return await invoke({
        method: 'initialize',
        args: [((i) => addressToScVal(i))(token_address),
        ((i) => addressToScVal(i))(fee_address)],
        ...options,
        parseResultXdr: () => { },
    });
}

export async function colorsMine<R extends ResponseTypes = undefined>({ miner, to, colors }: { miner: Address, to: Option<Address>, colors: Map<u32, u32> }, options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
    /**
     * A Wallet interface, such as Freighter, that has the methods `isConnected`, `isAllowed`, `getUserInfo`, and `signTransaction`. If not provided, will attempt to import and use Freighter. Example:
     *
     * ```ts
     * import freighter from "@stellar/freighter-api";
     *
     * // later, when calling this function:
     *   wallet: freighter,
     */
    wallet?: Wallet
} = {}) {
    return await invoke({
        method: 'colors_mine',
        args: [((i) => addressToScVal(i))(miner),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : addressToScVal(i))(to),
        ((i) => xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
            return new xdr.ScMapEntry({
                key: ((i) => xdr.ScVal.scvU32(i))(key),
                val: ((i) => xdr.ScVal.scvU32(i))(value)
            })
        })))(colors)],
        ...options,
        parseResultXdr: () => { },
    });
}

export async function colorsTransfer<R extends ResponseTypes = undefined>({ from, to, colors }: { from: Address, to: Address, colors: Array<[Address, u32, u32]> }, options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
    /**
     * A Wallet interface, such as Freighter, that has the methods `isConnected`, `isAllowed`, `getUserInfo`, and `signTransaction`. If not provided, will attempt to import and use Freighter. Example:
     *
     * ```ts
     * import freighter from "@stellar/freighter-api";
     *
     * // later, when calling this function:
     *   wallet: freighter,
     */
    wallet?: Wallet
} = {}) {
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

export async function colorBalance<R extends ResponseTypes = undefined>({ owner, miner, color }: { owner: Address, miner: Option<Address>, color: u32 }, options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `u32`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
    /**
     * A Wallet interface, such as Freighter, that has the methods `isConnected`, `isAllowed`, `getUserInfo`, and `signTransaction`. If not provided, will attempt to import and use Freighter. Example:
     *
     * ```ts
     * import freighter from "@stellar/freighter-api";
     *
     * // later, when calling this function:
     *   wallet: freighter,
     */
    wallet?: Wallet
} = {}) {
    return await invoke({
        method: 'color_balance',
        args: [((i) => addressToScVal(i))(owner),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : addressToScVal(i))(miner),
        ((i) => xdr.ScVal.scvU32(i))(color)],
        ...options,
        parseResultXdr: (xdr): u32 => {
            return scValStrToJs(xdr);
        },
    });
}

export async function glyphMint<R extends ResponseTypes = undefined>({ minter, to, colors, width }: { minter: Address, to: Option<Address>, colors: Map<Address, Map<u32, Array<u32>>>, width: Option<u32> }, options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `Option<Buffer>`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
    /**
     * A Wallet interface, such as Freighter, that has the methods `isConnected`, `isAllowed`, `getUserInfo`, and `signTransaction`. If not provided, will attempt to import and use Freighter. Example:
     *
     * ```ts
     * import freighter from "@stellar/freighter-api";
     *
     * // later, when calling this function:
     *   wallet: freighter,
     */
    wallet?: Wallet
} = {}) {
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
                    })
                })))(value)
            })
        })))(colors),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : xdr.ScVal.scvU32(i))(width)],
        ...options,
        parseResultXdr: (xdr): Option<Buffer> => {
            return scValStrToJs(xdr);
        },
    });
}

export async function glyphTransfer<R extends ResponseTypes = undefined>({ to, hash_type }: { to: Address, hash_type: HashType }, options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
    /**
     * A Wallet interface, such as Freighter, that has the methods `isConnected`, `isAllowed`, `getUserInfo`, and `signTransaction`. If not provided, will attempt to import and use Freighter. Example:
     *
     * ```ts
     * import freighter from "@stellar/freighter-api";
     *
     * // later, when calling this function:
     *   wallet: freighter,
     */
    wallet?: Wallet
} = {}) {
    return await invoke({
        method: 'glyph_transfer',
        args: [((i) => addressToScVal(i))(to),
        ((i) => HashTypeToXdr(i))(hash_type)],
        ...options,
        parseResultXdr: () => { },
    });
}

export async function glyphScrape<R extends ResponseTypes = undefined>({ to, hash_type }: { to: Option<Address>, hash_type: HashType }, options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
    /**
     * A Wallet interface, such as Freighter, that has the methods `isConnected`, `isAllowed`, `getUserInfo`, and `signTransaction`. If not provided, will attempt to import and use Freighter. Example:
     *
     * ```ts
     * import freighter from "@stellar/freighter-api";
     *
     * // later, when calling this function:
     *   wallet: freighter,
     */
    wallet?: Wallet
} = {}) {
    return await invoke({
        method: 'glyph_scrape',
        args: [((i) => (!i) ? xdr.ScVal.scvVoid() : addressToScVal(i))(to),
        ((i) => HashTypeToXdr(i))(hash_type)],
        ...options,
        parseResultXdr: () => { },
    });
}

export async function glyphGet<R extends ResponseTypes = undefined>({ hash_type }: { hash_type: HashType }, options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `Ok<GlyphType> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
    /**
     * A Wallet interface, such as Freighter, that has the methods `isConnected`, `isAllowed`, `getUserInfo`, and `signTransaction`. If not provided, will attempt to import and use Freighter. Example:
     *
     * ```ts
     * import freighter from "@stellar/freighter-api";
     *
     * // later, when calling this function:
     *   wallet: freighter,
     */
    wallet?: Wallet
} = {}) {
    return await invoke({
        method: 'glyph_get',
        args: [((i) => HashTypeToXdr(i))(hash_type)],
        ...options,
        parseResultXdr: (xdr): Ok<GlyphType> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

export async function offerPost<R extends ResponseTypes = undefined>({ sell, buy }: { sell: Offer, buy: Offer }, options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
    /**
     * A Wallet interface, such as Freighter, that has the methods `isConnected`, `isAllowed`, `getUserInfo`, and `signTransaction`. If not provided, will attempt to import and use Freighter. Example:
     *
     * ```ts
     * import freighter from "@stellar/freighter-api";
     *
     * // later, when calling this function:
     *   wallet: freighter,
     */
    wallet?: Wallet
} = {}) {
    return await invoke({
        method: 'offer_post',
        args: [((i) => OfferToXdr(i))(sell),
        ((i) => OfferToXdr(i))(buy)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

export async function offerDelete<R extends ResponseTypes = undefined>({ sell, buy }: { sell: Offer, buy: Option<Offer> }, options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
    /**
     * A Wallet interface, such as Freighter, that has the methods `isConnected`, `isAllowed`, `getUserInfo`, and `signTransaction`. If not provided, will attempt to import and use Freighter. Example:
     *
     * ```ts
     * import freighter from "@stellar/freighter-api";
     *
     * // later, when calling this function:
     *   wallet: freighter,
     */
    wallet?: Wallet
} = {}) {
    return await invoke({
        method: 'offer_delete',
        args: [((i) => OfferToXdr(i))(sell),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : OfferToXdr(i))(buy)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
                    throw e;
                }
            }
        },
    });
}

export async function offersGet<R extends ResponseTypes = undefined>({ sell, buy }: { sell: Offer, buy: Option<Offer> }, options: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `Ok<void> | Err<Error_> | undefined`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number
    /**
     * A Wallet interface, such as Freighter, that has the methods `isConnected`, `isAllowed`, `getUserInfo`, and `signTransaction`. If not provided, will attempt to import and use Freighter. Example:
     *
     * ```ts
     * import freighter from "@stellar/freighter-api";
     *
     * // later, when calling this function:
     *   wallet: freighter,
     */
    wallet?: Wallet
} = {}) {
    return await invoke({
        method: 'offers_get',
        args: [((i) => OfferToXdr(i))(sell),
        ((i) => (!i) ? xdr.ScVal.scvVoid() : OfferToXdr(i))(buy)],
        ...options,
        parseResultXdr: (xdr): Ok<void> | Err<Error_> | undefined => {
            try {
                return new Ok(scValStrToJs(xdr));
            } catch (e) {
                //@ts-ignore
                let err = getError(e.message);
                if (err) {
                    return err;
                } else {
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
]
export type StorageKey = { tag: "TokenAddress", values: void } | { tag: "FeeAddress", values: void } | { tag: "Color", values: [Address, Address, u32] } | { tag: "Colors", values: [Address] } | { tag: "Glyph", values: [Buffer] } | { tag: "Dust", values: [Address] } | { tag: "GlyphOwner", values: [Buffer] } | { tag: "GlyphMinter", values: [Buffer] } | { tag: "GlyphOffer", values: [Buffer] } | { tag: "AssetOffer", values: [Buffer, Address, i128] };

function StorageKeyToXdr(storageKey?: StorageKey): xdr.ScVal {
    if (!storageKey) {
        return xdr.ScVal.scvVoid();
    }
    let res: xdr.ScVal[] = [];
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

function StorageKeyFromXdr(base64Xdr: string): StorageKey {
    type Tag = StorageKey["tag"];
    type Value = StorageKey["values"];
    let [tag, values] = strToScVal(base64Xdr).vec()!.map(scValToJs) as [Tag, Value];
    if (!tag) {
        throw new Error('Missing enum tag when decoding StorageKey from XDR');
    }
    return { tag, values } as StorageKey;
}

export type HashType = { tag: "Colors", values: [Address] } | { tag: "Dust", values: [Address] } | { tag: "Glyph", values: [Buffer] };

function HashTypeToXdr(hashType?: HashType): xdr.ScVal {
    if (!hashType) {
        return xdr.ScVal.scvVoid();
    }
    let res: xdr.ScVal[] = [];
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

function HashTypeFromXdr(base64Xdr: string): HashType {
    type Tag = HashType["tag"];
    type Value = HashType["values"];
    let [tag, values] = strToScVal(base64Xdr).vec()!.map(scValToJs) as [Tag, Value];
    if (!tag) {
        throw new Error('Missing enum tag when decoding HashType from XDR');
    }
    return { tag, values } as HashType;
}

export type GlyphType = { tag: "Colors", values: [Map<Address, Map<u32, Array<u32>>>] } | { tag: "Glyph", values: [Glyph] };

function GlyphTypeToXdr(glyphType?: GlyphType): xdr.ScVal {
    if (!glyphType) {
        return xdr.ScVal.scvVoid();
    }
    let res: xdr.ScVal[] = [];
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
                        })
                    })))(value)
                })
            })))(glyphType.values[0]));
            break;
        case "Glyph":
            res.push(((i) => xdr.ScVal.scvSymbol(i))("Glyph"));
            res.push(((i) => GlyphToXdr(i))(glyphType.values[0]));
            break;
    }
    return xdr.ScVal.scvVec(res);
}

function GlyphTypeFromXdr(base64Xdr: string): GlyphType {
    type Tag = GlyphType["tag"];
    type Value = GlyphType["values"];
    let [tag, values] = strToScVal(base64Xdr).vec()!.map(scValToJs) as [Tag, Value];
    if (!tag) {
        throw new Error('Missing enum tag when decoding GlyphType from XDR');
    }
    return { tag, values } as GlyphType;
}

export interface Glyph {
    colors: Map<Address, Map<u32, Array<u32>>>;
    length: u32;
    width: u32;
}

function GlyphToXdr(glyph?: Glyph): xdr.ScVal {
    if (!glyph) {
        return xdr.ScVal.scvVoid();
    }
    let arr = [
        new xdr.ScMapEntry({
            key: ((i) => xdr.ScVal.scvSymbol(i))("colors"), val: ((i) => xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                return new xdr.ScMapEntry({
                    key: ((i) => addressToScVal(i))(key),
                    val: ((i) => xdr.ScVal.scvMap(Array.from(i.entries()).map(([key, value]) => {
                        return new xdr.ScMapEntry({
                            key: ((i) => xdr.ScVal.scvU32(i))(key),
                            val: ((i) => xdr.ScVal.scvVec(i.map((i) => xdr.ScVal.scvU32(i))))(value)
                        })
                    })))(value)
                })
            })))(glyph["colors"])
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
        colors: scValToJs(map.get("colors")) as unknown as Map<Address, Map<u32, Array<u32>>>,
        length: scValToJs(map.get("length")) as unknown as u32,
        width: scValToJs(map.get("width")) as unknown as u32
    };
}

export type OfferCreate = { tag: "Glyph", values: [Buffer, Offer] } | { tag: "Asset", values: [Buffer, Address, Address, i128] };

function OfferCreateToXdr(offerCreate?: OfferCreate): xdr.ScVal {
    if (!offerCreate) {
        return xdr.ScVal.scvVoid();
    }
    let res: xdr.ScVal[] = [];
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

function OfferCreateFromXdr(base64Xdr: string): OfferCreate {
    type Tag = OfferCreate["tag"];
    type Value = OfferCreate["values"];
    let [tag, values] = strToScVal(base64Xdr).vec()!.map(scValToJs) as [Tag, Value];
    if (!tag) {
        throw new Error('Missing enum tag when decoding OfferCreate from XDR');
    }
    return { tag, values } as OfferCreate;
}

export type Offer = { tag: "Glyph", values: [Buffer] } | { tag: "Asset", values: [Address, i128] } | { tag: "AssetSell", values: [Address, Address, i128] };

function OfferToXdr(offer?: Offer): xdr.ScVal {
    if (!offer) {
        return xdr.ScVal.scvVoid();
    }
    let res: xdr.ScVal[] = [];
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

function OfferFromXdr(base64Xdr: string): Offer {
    type Tag = Offer["tag"];
    type Value = Offer["values"];
    let [tag, values] = strToScVal(base64Xdr).vec()!.map(scValToJs) as [Tag, Value];
    if (!tag) {
        throw new Error('Missing enum tag when decoding Offer from XDR');
    }
    return { tag, values } as Offer;
}
