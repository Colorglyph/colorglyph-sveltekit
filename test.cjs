
const shajs = require('sha.js')
const SorobanClient = require('soroban-client')
const xdr = SorobanClient.xdr

const pubkey = 'GCBDVRWCTRZENDMYBOLAC3PZBP6NGGSILDZTYAUCJUWUGX27BG2VDPID'
const secret = 'SBQJEN6RVWCB7KUPI6Y4XVBQVHEDQVT2KS2UUIYVQOTWP5EUCNFG6DEJ'
const keypair = SorobanClient.Keypair.fromSecret(secret)
const server = new SorobanClient.Server('https://rpc-futurenet.stellar.org')
const contractId = 'CBX37XXSUW7VMDCCX5OUST2EJCFDQ6L2QC7QLGC272AUSP43CEJEHZQR'
const contract = new SorobanClient.Contract(contractId)
// const glyph = '144a75075eb4901f18e3ab4ad5b5b8cc63d999969a6b8815c5a64b51ae84e32c'
const bodyType = xdr.ContractEntryBodyType.dataEntry()
const durability = xdr.ContractDataDurability.persistent()
const width = 42;

(async () => {
    let bytes = []

    generateRGBSpectrum(width)
    .forEach((color) => {
        let buf = Buffer.alloc(4)
        buf.writeUInt32BE(color);
        bytes.push(...buf.slice(1))
    });

    let buf = Buffer.alloc(4)
    buf.writeUInt32BE(width);
    bytes.push(...buf)

    const glyph = shajs('sha256').update(bytes).digest('hex')

    const contractData = await server.getContractData(contract, new xdr.ScVal.scvLedgerKeyContractInstance(), 'persistent')

    const entry = xdr.LedgerEntryData.fromXDR(contractData.xdr, 'base64')
    const instance = new xdr.ScContractInstance({ executable: entry.contractData().body().value().val() })
    const executable = xdr.ContractExecutable.contractExecutableWasm(instance.executable())
    const hash = executable.wasmHash().instance().executable().wasmHash()

    const sorobanOperation = SorobanClient.Operation.invokeHostFunction({
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

    const sorobanData = new xdr.SorobanTransactionData({
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
        fee: 1_000_000_000,
        networkPassphrase: SorobanClient.Networks.FUTURENET
    })
    .addOperation(sorobanOperation)
    .setSorobanData(sorobanData)
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

function generateRGBSpectrum(steps) {
    const colorArray = [];

    for (let i = 0; i < steps; i++) {
        for (let j = 0; j < steps; j++) {
            const red = 255 - Math.floor((i * 255) / steps);
            const green = 255 - Math.floor((j * 255) / steps);
            const blue = Math.floor((i * j * 255) / (steps * steps));

            const colorValue = red * Math.pow(256, 2) + green * 256 + blue;
            colorArray.push(colorValue);
        }
    }

    return colorArray;
}