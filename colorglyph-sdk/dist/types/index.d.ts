/// <reference types="node" />
import { ContractSpec } from '@stellar/stellar-sdk';
import { Buffer } from "buffer";
import { AssembledTransaction, Ok, Err } from './assembled-tx.js';
import type { u32, i128, Option, Error_ } from './assembled-tx.js';
import type { ClassOptions } from './method-options.js';
export * from './assembled-tx.js';
export * from './method-options.js';
export declare const networks: {
    readonly futurenet: {
        readonly networkPassphrase: "Test SDF Future Network ; October 2022";
        readonly contractId: "CDMGYHGOOT6B47C4UG2RY5C2H34FXA4H6B7I43BSCDS3A7I2FUOFQ563";
    };
};
/**
    
    */
export declare const Errors: {
    1: {
        message: string;
    };
    2: {
        message: string;
    };
    3: {
        message: string;
    };
    4: {
        message: string;
    };
    5: {
        message: string;
    };
    6: {
        message: string;
    };
    7: {
        message: string;
    };
    8: {
        message: string;
    };
};
/**
    
    */
export type StorageKey = {
    tag: "TokenAddress";
    values: void;
} | {
    tag: "FeeAddress";
    values: void;
} | {
    tag: "Color";
    values: readonly [string, string, u32];
} | {
    tag: "Colors";
    values: readonly [string];
} | {
    tag: "Glyph";
    values: readonly [Buffer];
} | {
    tag: "Dust";
    values: readonly [string];
} | {
    tag: "GlyphOwner";
    values: readonly [Buffer];
} | {
    tag: "GlyphMinter";
    values: readonly [Buffer];
} | {
    tag: "GlyphOffer";
    values: readonly [Buffer];
} | {
    tag: "AssetOffer";
    values: readonly [Buffer, string, i128];
};
/**
    
    */
export type HashType = {
    tag: "Colors";
    values: readonly [string];
} | {
    tag: "Dust";
    values: readonly [string];
} | {
    tag: "Glyph";
    values: readonly [Buffer];
};
/**
    
    */
export type GlyphType = {
    tag: "Colors";
    values: readonly [Map<string, Map<u32, Array<u32>>>];
} | {
    tag: "Glyph";
    values: readonly [Glyph];
};
/**
    
    */
export interface Glyph {
    /**
      
      */
    colors: Map<string, Map<u32, Array<u32>>>;
    /**
      
      */
    length: u32;
    /**
      
      */
    width: u32;
}
/**
    
    */
export type OfferCreate = {
    tag: "Glyph";
    values: readonly [Buffer, Offer];
} | {
    tag: "Asset";
    values: readonly [Buffer, string, string, i128];
};
/**
    
    */
export type Offer = {
    tag: "Glyph";
    values: readonly [Buffer];
} | {
    tag: "Asset";
    values: readonly [string, i128];
} | {
    tag: "AssetSell";
    values: readonly [string, string, i128];
};
export declare class Contract {
    readonly options: ClassOptions;
    spec: ContractSpec;
    constructor(options: ClassOptions);
    private readonly parsers;
    private txFromJSON;
    readonly fromJSON: {
        initialize: (json: string) => AssembledTransaction<void>;
        colorsMine: (json: string) => AssembledTransaction<void>;
        colorsTransfer: (json: string) => AssembledTransaction<void>;
        colorBalance: (json: string) => AssembledTransaction<number>;
        glyphMint: (json: string) => AssembledTransaction<Option<Buffer>>;
        glyphTransfer: (json: string) => AssembledTransaction<void>;
        glyphScrape: (json: string) => AssembledTransaction<void>;
        glyphGet: (json: string) => AssembledTransaction<Err<Error_> | Ok<GlyphType, Error_>>;
        offerPost: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        offerDelete: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
        offersGet: (json: string) => AssembledTransaction<Err<Error_> | Ok<void, Error_>>;
    };
    /**
* Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    initialize: ({ token_address, fee_address }: {
        token_address: string;
        fee_address: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<void>>;
    /**
* Construct and simulate a colors_mine transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    colorsMine: ({ source, miner, to, colors }: {
        source: string;
        miner: Option<string>;
        to: Option<string>;
        colors: Map<u32, u32>;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<void>>;
    /**
* Construct and simulate a colors_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    colorsTransfer: ({ from, to, colors }: {
        from: string;
        to: string;
        colors: Array<readonly [string, u32, u32]>;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<void>>;
    /**
* Construct and simulate a color_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    colorBalance: ({ owner, miner, color }: {
        owner: string;
        miner: Option<string>;
        color: u32;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<number>>;
    /**
* Construct and simulate a glyph_mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    glyphMint: ({ minter, to, colors, width }: {
        minter: string;
        to: Option<string>;
        colors: Map<string, Map<u32, Array<u32>>>;
        width: Option<u32>;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Option<Buffer>>>;
    /**
* Construct and simulate a glyph_transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    glyphTransfer: ({ to, hash_type }: {
        to: string;
        hash_type: HashType;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<void>>;
    /**
* Construct and simulate a glyph_scrape transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    glyphScrape: ({ to, hash_type }: {
        to: Option<string>;
        hash_type: HashType;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<void>>;
    /**
* Construct and simulate a glyph_get transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    glyphGet: ({ hash_type }: {
        hash_type: HashType;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<GlyphType, Error_>>>;
    /**
* Construct and simulate a offer_post transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    offerPost: ({ sell, buy }: {
        sell: Offer;
        buy: Offer;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a offer_delete transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    offerDelete: ({ sell, buy }: {
        sell: Offer;
        buy: Option<Offer>;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
    /**
* Construct and simulate a offers_get transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    offersGet: ({ sell, buy }: {
        sell: Offer;
        buy: Option<Offer>;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<Err<Error_> | Ok<void, Error_>>>;
}
