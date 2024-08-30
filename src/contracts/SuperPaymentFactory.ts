import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from "@ton/core"

export type SuperPaymentFactoryConfig = {
  totalDeposits: number
  adminAddress: Address
  coAdminAddress: Address
  superPaymentWalletCode: Cell
}

export function superPaymentFactoryConfigToCell(
  config: SuperPaymentFactoryConfig
): Cell {
  return beginCell()
    .storeCoins(config.totalDeposits)
    .storeAddress(config.adminAddress)
    .storeAddress(config.coAdminAddress)
    .storeRef(config.superPaymentWalletCode)
    .endCell()
}

export class SuperPaymentFactory implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new SuperPaymentFactory(address)
  }

  static createFromConfig(
    config: SuperPaymentFactoryConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = superPaymentFactoryConfigToCell(config)
    const init = { code, data }
    return new SuperPaymentFactory(contractAddress(workchain, init), init)
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    })
  }

  async sendDeposit(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    options: { depositAmount: bigint }
  ) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(1, 32) // op code
        .storeUint(10, 64) // query id
        .storeCoins(options.depositAmount)
        .endCell(),
    })
  }

  async sendWithdrawTon(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    options: { amount: bigint }
  ) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(2, 32)
        .storeUint(20, 64)
        .storeCoins(options.amount)
        .endCell(),
    })
  }

  async sendChangeAdmin(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    options: { newAdmin: Address }
  ) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(3, 32)
        .storeUint(30, 64)
        .storeAddress(options.newAdmin)
        .endCell(),
    })
  }

  async sendCoChangeAdmin(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    options: { newCoAdmin: Address }
  ) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(4, 32)
        .storeUint(40, 64)
        .storeAddress(options.newCoAdmin)
        .endCell(),
    })
  }

  async getSuperPaymentUserWalletAddress(
    provider: ContractProvider,
    ownerAddress: Address
  ): Promise<Address> {
    const res = await provider.get("get_user_super_wallet_address", [
      {
        type: "slice",
        cell: beginCell().storeAddress(ownerAddress).endCell(),
      },
    ])

    return res.stack.readAddress()
  }

  async getSuperPaymentFactoryData(provider: ContractProvider) {
    const res = await provider.get("get_super_payment_factory_data", [])

    return {
      totalDeposits: res.stack.readNumber(),
      adminAddress: res.stack.readAddress(),
      coAdminAddress: res.stack.readAddress(),
      superPaymentWalletCode: res.stack.readCell(),
    }
  }
}
