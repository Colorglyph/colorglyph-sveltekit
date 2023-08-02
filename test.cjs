const SorobanClient = require('soroban-client')
const xdr = SorobanClient.xdr

const pubkey = 'GD3YTR6H7EXYRUJTLPM23LBMESA2JOY32KNPUXMYDUOI5LILD4MWLDIZ' //'GALR7P2KNUOEGK6OIOZTYCX2R2BMGNLQLHW2T5J6QEBHOKIE7H3DOK4R'
const secret = 'SDKSSSOWMTO43IQP6V54OC2L42I6PFMVWHMXWRWLK6KYIPYANXQGP4MK' // 'SDSYOV3QSO4LOOAIDQ6PYKTCINWVODIO6JLD6CG4BC3M4DQ7I75IR6PM'
const keypair = SorobanClient.Keypair.fromSecret(secret)
const server = new SorobanClient.Server('https://rpc-futurenet.stellar.org')
const contractId = 'CADKVUHIBZBFX4BIWLNOGWQMCJZKYWDHUJIE55MNIX5NDJKOBJHTDDOM'
const contract = new SorobanClient.Contract(contractId)
const glyph = 'f11875748c9ff1acf8d010d6d0bf88e8aa612d47f85daef4a45c6f179fbbbbe1'
const bodyType = xdr.ContractEntryBodyType.dataEntry()
const durability = xdr.ContractDataDurability.persistent()
const fee = 1_000_000_000;
const width = 32;

(async () => {
    const contractData = await server.getContractData(contract, new xdr.ScVal.scvLedgerKeyContractInstance(), 'persistent')

    const entry = xdr.LedgerEntryData.fromXDR(contractData.xdr, 'base64')
    const instance = new xdr.ScContractInstance({ executable: entry.contractData().body().value().val() })
    const executable = xdr.ContractExecutable.contractExecutableWasm(instance.executable())
    const hash = executable.wasmHash().instance().executable().wasmHash()

    const sorobanTransactionData = new xdr.SorobanTransactionData({
        resources: new xdr.SorobanResources({
            footprint: new xdr.LedgerFootprint({
                readOnly: [
                    xdr.LedgerKey.contractData(
                        new xdr.LedgerKeyContractData({
                            contract: contract.address().toScAddress(),
                            key: new xdr.ScVal.scvLedgerKeyContractInstance(),
                            durability,
                            bodyType
                        })
                    ),
                    xdr.LedgerKey.contractCode(
                        new xdr.LedgerKeyContractCode({
                            hash,
                            bodyType
                        })
                    ),
                ],
                readWrite: [
                    xdr.LedgerKey.contractData(
                        new xdr.LedgerKeyContractData({
                            contract: contract.address().toScAddress(),
                            key: xdr.ScVal.scvVec([
                                xdr.ScVal.scvSymbol('Colors'),
                                SorobanClient.Address.fromString(pubkey).toScVal()
                            ]),
                            durability,
                            bodyType
                        })
                    ),
                    xdr.LedgerKey.contractData(
                        new xdr.LedgerKeyContractData({
                            contract: contract.address().toScAddress(),
                            key: xdr.ScVal.scvVec([
                                xdr.ScVal.scvSymbol('Glyph'),
                                xdr.ScVal.scvBytes(Buffer.from(glyph, 'hex'))
                            ]),
                            durability,
                            bodyType
                        })
                    ),
                    xdr.LedgerKey.contractData(
                        new xdr.LedgerKeyContractData({
                            contract: contract.address().toScAddress(),
                            key: xdr.ScVal.scvVec([
                                xdr.ScVal.scvSymbol('GlyphMinter'),
                                xdr.ScVal.scvBytes(Buffer.from(glyph, 'hex'))
                            ]),
                            durability,
                            bodyType
                        })
                    ),
                    xdr.LedgerKey.contractData(
                        new xdr.LedgerKeyContractData({
                            contract: contract.address().toScAddress(),
                            key: xdr.ScVal.scvVec([
                                xdr.ScVal.scvSymbol('GlyphOwner'),
                                xdr.ScVal.scvBytes(Buffer.from(glyph, 'hex'))
                            ]),
                            durability,
                            bodyType
                        })
                    ),
                ]
            }),
            instructions: 100_000_000,
            readBytes: 204_800,
            writeBytes: 102_400,
            extendedMetaDataSizeBytes: 204_800
        }),
        refundableFee: xdr.Int64.fromString('204800'),
        ext: new xdr.ExtensionPoint(0)
    });

    const account = await server.getAccount(pubkey);
    const transaction = new SorobanClient.TransactionBuilder(account, {
        fee,
        networkPassphrase: SorobanClient.Networks.FUTURENET
    })
    .addOperation(
        SorobanClient.Operation.invokeHostFunction({
            func: new xdr.HostFunction.hostFunctionTypeInvokeContract([
                new SorobanClient.Address(contractId).toScVal(),
                xdr.ScVal.scvSymbol("glyph_mint"),
                SorobanClient.Address.fromString(pubkey).toScVal(),
                xdr.ScVal.scvVoid(),
                xdr.ScVal.scvMap([]),
                xdr.ScVal.scvU32(width),
            ]),
            auth: [
                new xdr.SorobanAuthorizationEntry({
                    credentials: new xdr.SorobanCredentials.sorobanCredentialsSourceAccount(),
                    rootInvocation: new xdr.SorobanAuthorizedInvocation({
                        function: xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
                            new xdr.SorobanAuthorizedContractFunction({
                                contractAddress: contract.address().toScAddress(),
                                functionName: "glyph_mint",
                                args: [
                                    SorobanClient.Address.fromString(pubkey).toScVal(),
                                    xdr.ScVal.scvVoid(),
                                    xdr.ScVal.scvMap([]),
                                    xdr.ScVal.scvU32(width),
                                ],
                            })
                        ),
                        subInvocations: [],
                    }),
                })
            ]
        })
    )
    .setSorobanData(sorobanTransactionData)
    .setTimeout(0)
    .build();

    transaction.sign(keypair)

    // console.log(transaction.toEnvelope().toXDR('base64'));

    // return 

    const res = await server.sendTransaction(transaction);
    const resHash = res.hash

    console.log(res);

    if (res.status === 'ERROR' || res.status === 'FAILED')
        return

    const interval = setInterval(async () => {
        const res = await server.getTransaction(resHash)

        if (
            res.status === 'SUCCESS'
            || res.status === 'ERROR'
            || res.status === 'FAILED'
        ) clearInterval(interval)

        console.log(res)
    }, 500)
})()