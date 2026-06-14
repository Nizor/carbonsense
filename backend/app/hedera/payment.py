from hedera import (
    Client,
    AccountId,
    TransactionId,
    AccountBalanceQuery
)


def verify_payment(tx_id: str):

    try:
        client = Client.for_testnet()

        tx = TransactionId.fromString(tx_id)

        receipt = tx.getReceipt(client)

        if receipt.status.toString() == "SUCCESS":
            return True

        return False

    except Exception:
        return False