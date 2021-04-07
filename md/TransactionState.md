# Heavy Transactions / Small Global State

## Further reducing memory

This method needs to send the proof of the latest transaction to the chain, which has the following problems:

* memory consumption while sending a transaction and including it in a block
* CPU consumption while verifying the signatures
* possibility of giving a not up-to-date block by the client, thus forking the account

To remove these problems, the simplest method is to create a merkle-tree of account#/account_hash and include this tree in the block header. However, now the nodes need to store quite a lot of state. Not as much as in current systems, but still a lot of potentially unused accounts.

If the account#/account_hash pairs are stored in a cockoo-filter, the memory can be reduced to around 4 bytes/account for low false positives (10^-7) and 2^32 elements. However, this means that the nodes now need to store 8GB for holding all information.

[Morton](https://github.com/AMDComputeLibraries/morton_filter) filters might be a better storage option by providing an efficient compression of the empty parts of the structure.

# MVP
For the MVP the implementation will be to hold all account#/account_hash pairs in a merkle-tree and store the root in the block header.

# Accounts, FFmana and UTXOs
FFledger's capabilities are gained through FFmana, which is used to 

* execute wasm code
* ask for memory caching of the account
* stake to participate in the library chain

An FFmana account is a special account with a pre-defined WASM code that is stored in the nodes itself. The WASM account has the following methods:

* ingest a UTXO
* put some FFmana on the stack to be used by the next operation
* create an UTXO out of FFmana

# Inter-account communication

Examples of inter-account communication:


We differentiate the following calls:

* send tokens to another account
* invoke a read-method of another account
* invoke a write-method of another account

## Send tokens to another account

Probably the easiest solution is to create an UTXO that can be retrieved by the other account at any time it wants. This avoids the sender having to read the destination account and include it in the transaction.

## Invoke read-method of another account
Supposing that the account of the user is protected by a DARC, then the user must proof that this DARC gives access, given a public key. 

The client can add the DARC-account to his transaction, so that the account-contract-verification can call out to the DARC-account. But this is heavy.

Another possibility is to create a proof that an account would return a value given a request - but then the client would need to know the other account, too.

## Invoke write-method of another account
If the client wants to invoke another account and change it's state, then this is the same as calling a write method on the other account.

The client can again send the other account along with his primary account in the transaction. But then the new account is changed, and the original holder of that account would need to update it. Which is probably what needs to be done anyway.

Another possibility is to create an UTXO with the write request going to that account, and then somebody else could apply this to the account.