import {
  Address,
  Cell,
  Contract,
  ContractProvider,
  SendMode,
  Sender,
  beginCell,
} from "@ton/core"

export class SuperPaymentWallet implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new SuperPaymentWallet(address)
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
      value,
    })
  }

  async getSuperPaymentWalletDeposit(
    provider: ContractProvider
  ): Promise<number> {
    const res = await provider.get("get_deposit", [])
    return res.stack.readNumber()
  }
}
