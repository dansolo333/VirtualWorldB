/*
/// Module: transfer_coin
module transfer_coin::transfer_coin {

}
*/
module sui_transfer::Transfer {

    use sui::coin::{Coin};
    use sui::account::{Account};
    use sui::transfer::{Transfer};

    /// Transfers the specified amount of SUI coins from the sender to the recipient.
    public entry fun transfer_sui(
        sender: &signer,
        recipient: address,
        amount: u64
    ) {
        let sender_address = signer::address_of(sender);
        let coin = Coin::withdraw<SUI>(sender, amount);

        Transfer::transfer(coin, recipient);

        // Optionally, log the transfer for your app's logic
        // Event::emit(TransferEvent { sender: sender_address, recipient, amount });
    }
}
