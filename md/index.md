
# Fledger

Fast, Fun, Forgetful Ledger, or Fledger puts the fun back in blockchain!

## Principles

<details>
<summary>Bring back the fun - remember when bitcoin was there to change the world?</summary>

<div style="margin-left: 1em;">
I remember the first announcement of bitcoin on slashdot - and will be forever sad I didn't install it on my computer ;) But the basic idea of politically decentralizing decisions is great and brings back the fun of the internet.

Do you remember building your first webpage? Sending your first email? Installing your first webserver?

Well, this project is for you: build something without having to install a lot of infrastructure.
Learn how blockchains work, and what you can do with them.
</div>
</details>

<details>
<summary>Easy setup - no need to configure your node or your own network - just start the docker</summary>

<div style="margin-left: 1em;">
For most of the blockchains out there it is very complicated to run a node and to actually use it. Ethereum needs you to wait a couple of days for a full node to be ready. Bitcoin will never allow you to mine a block (within reasonable assumptions of probability, anyway). Avalanche needs you to set up your own blockchain and pay 2500US$ to stake enough tokens.

Fledger only asks you one of two things thing:

* connect to https://web.fledg.re and start mining
* Run the following on your server:
```bash
wget https://github.com/ineiti/fledger/raw/main/docker-compose.yaml
docker-compose up -d
```

Either will connect to the library chain, get the latest block within seconds, then participate in finding mining transactions to earn Mana.
It will also offer some of your docker power as a service to other participants. Of course, if they use your node, you get more Mana.
No port-opening needed, no TLS setup, no downloading a lot of data - just start it.
</div>
</details>

<details>
<summary>Fast rewards - once your node is running, get direct (small) rewards within minutes</summary>

<div style="margin-left: 1em;">
Ever wanted to use Ethereum? You either need to buy ether, which is very expensive, or use the test-net, which is only half fun. For bitcoin it's even worse.

The goal of Fledger is to make participation easy. If you run your own node, you are guaranteed that within
3 minutes you will get your first Mana to spend on transactions.
</div>
</details>

<details>
<summary>Actually useful - sell and buy memory, HD, CPU, network bandwidth</summary>

<div style="margin-left: 1em;">
Ever tried to do a project on Ethereum? It's too expensive to do anything useful. Except for crypto kitties, of course.

Other blockchain projects, like filecoin, set up a huge environment to serve files. But there are other assets, too. The goal of Fledger is to allow each node to easily share

* CPU/GPU power - what Ethereum is already doing
* Memory (RAM and harddisk/SSD) - like filecoin
* Bandwidth - used for example when hosting webpages
* Trust - using DARCs

And to earn Mana in doing so, which can be used in turn to buy necessary resources.
</div>
</details>
<br>

## Technological

From a technological point of view, use the following goodies described by the Chainiac, Byzcoin, and OmniLedger papers:

<details>
<summary>Every block is final - by using a fast BFT algorithm, no forks can happen</summary>

<div style="margin-left: 1em;">
The [ByzCoin paper](https://actu.epfl.ch/news/byzcoin-an-innovative-solution/) proposed a new method to improve the speed of 
transactions in Bitcoin: instead of having all the nodes compete to be the leader, once a leader is chosen, it takes the n 
latest leaders to create micro blocks that are signed by all leaders. This means that during the micro block creation no forks 
can happen, and all micro blocks are final.

If the acceptance of a new leader is also included in this signature round, then there is no need to wait for a certain number 
of blocks before considering its transactions to be final.

The big downside of this method is the need to know the set of nodes that should sign, and how to securely sign the new blocks 
in a byzantine fault tolerant way. PBFT signing is very expensive, this is why [ByzCoinX](https://eprint.iacr.org/2017/406.pdf) 
has been proposed in OmniLedger as a fast and secure way to sign new blocks.
</div>
</details>

<details>
<summary>Multi-level ForwardLinks - small proofs: no need to look at all block headers to confirm a transaction</summary>

<div style="margin-left: 1em;">
If a block with index _n_ is created in current blockchains, it includes a hash of the header of block _n-1_.
This is the basis of the blockchain.
The problem with this solution is that to have a proof of the correctness of a block, you need all block headers, recalculate 
all the hashes, and verify all the links:

* downloading all headers takes time
* calculating the hash of all the headers takes time

Chainiac introduced forward-links that go from _block n-1_ to _block n_, but also every multiple of _k^i_th block to the
block _n+k^i_. With k = 2, the links would be:

* block-# -> forward-links
* 0 → 1, 2, 4, 8, 16
* 1 → 2
* 2 → 3, 4
* 3 → 4
* 4 → 5, 6, 8

If the latest block is #17, instead of having to download and verify 17 hashes, it is enough to have the hash of block 0, the 
forward-link #0 → #16, and the forward-link #16 → #17.
This is implemented in the current version of [ByzCoin](https://github.com/dedis/cothority/tree/master/byzcoin)
by the DEDIS-lab and allows to reduce the proof of the latest block in a chain with 100'000 blocks to a mere 24 forward-links.
</div>
</details>

<details>
<summary>Sharding - cut the processing power of the nodes in little units so that more nodes means more speed</summary>

<div style="margin-left: 1em;">
One of the best known technique to scale-out a blockchain systems is to create shards.
This means to take the whole set of available nodes, and group them together.
Each group, or shard, works independently of all others, and can increase throughput.
Sharding is difficult for the following reasons:

1. An attacker might concentrate his attack on one shard, which is easier than the whole set of nodes
2. Inter-shard communication is difficult to get right

The OmniLedger paper proposes how to overcome these problems.
It gives the probability of an attacker being able to create a faulty shard, given the shard size and the
total number of nodes.
</div>
</details>
<br>

## Engineering Technology

The following elements are purely engineering stuff, and hopefully not too bad of a choice.
If you're a PhD student and want to work on these ideas, feel free to get in contact with me ;)

<details>
<summary>Adaptable difficulty - let slow nodes participate in the network</summary>

<div style="margin-left: 1em;">
Fledger does not suppose that all nodes are equal.
Some nodes will run in web browsers and are limited in speed and memory availble.
Other nodes will run on a 24/7 available server and will be much faster.
Some nodes might run on old hardware, while others will run on latest hardware.

To accomodate all of these different types of nodes, Fledger uses a hierarchical structure with the fastest
nodes on top.
Nodes are incentivized to join the top by getting more reward than if they would split themselves up and participate
as multiple nodes.
To avoid attacks on the lower groups they are vetted by their parents, and misbehaving nodes or groups
will be banned - or at least their Mana will be removed.

[Onboarding and vetting](Onboarding.md)
</div>
</details>

<details>
<summary>Proof of Useful Work</summary>

<div style="margin-left: 1em;">
This is most arguably one of the weak points of Fledger:
I don't want to use Proof-of-Work, as it's wasteful.
Proof-of-Stake sounds complicated if you want nodes to be able to sign up without financial participation.
Proof-of-Personhood does not really exist, and also doesn't allow somebody to just sign up.
So I came up with Proof-of-useful-work, which must exist _somewhere_, but I couldn't find any links.

The idea is that at the start of each epoch (1 minute), all nodes must race to verify as many transactions
as possible from other shards.
The transactions each node must work on are only known at the start of an epoch.
Also, every node has another set of transactions it needs to process.
The amount of transactions each node managed to verify defines the amount of work this node is able to do.
Faster nodes rise up, while slower nodes go down in the pyramid.

Of course there are a lot of problems with this approach:
* Nodes might use more power just for this PouW round
  * This is why all nodes need to do it at the same time, to avoid some collusion
* Making the batch of transactions only available at the latest moment
  * Probably some BLS signature magic where the threshold signature is not known in advance
  and where the signing nodes cannot predict or influence the signature
* It's still somewhat wasteful
  * The verification of other transactions helps to stabilize the system by disincentivizing
  nodes to cheat, as they will be found out
* Verifying the verification
  * Nodes might just say: "Hey, I verified all these transactions, and they are OK".
  How to make sure the verifications are really OK? 
    * Inserting wrong transactions and verifying that the wrong transactions are caught
    * Binding the transactions somewhat to the node and the nonce used for the PouW round
    * Inserting random transactions where the result is not known in advance, and where
    the verifying node does not know it's a random transaction
</div>
</details>

<details>
<summary>Heavy Transaction / Small Global State - instead of having a huge global state, the client needs to keep track of its own memory</summary>

<div style="margin-left: 1em;">
One of the reasons it takes so long to start a new node with most of the chain is that the new node has to download the whole global state of the chain. This state includes all unused accounts, old contracts that have been deleted, and very small accounts that will never be usable. FFledger uses a small global state to counteract this problem:

Instead of holding the full state of every account or UTXO in the ledger, this information is kept by the client. If a client wants to send in a transaction, she needs to send the following:

* The account-#
* A proof of the block of the latest transaction of the account
* The inclusion-proof of the account in this block
* The full memory of the account - state, smart-contract - to match the current merkle-tree root hash
* The transaction to send to the smart contract (including the signature)

All the nodes will reach consensus on the correctness of the state sent by the client and the new state, which will not be 
stored anywhere. The block will only have the merkle-tree root of all accounts. The inclusion-proofs of the new state can be 
stored in a temporary memory that can be deleted later, as they can be re-created when needed from the information in the block.

[Some more ideas](TransactionState.md)
</div>
</details>

<details>
<summary>Forgetting stuff over time</summary>

<div style="margin-left: 1em;">
Some say that forgetting is one of the main features of the human brain. The possibility to sort memories according to their importance. Others say that our mind does an awful job at this, and forgets what it shouldn't.

Current blockchains keep the state of everything around, for all time. Even though there are some checkpoint features that allow to prune old UTXOs. Fledger proposes to allow forgetting of accounts / UTXOs in multiple steps, by requiring mana for holding the information. The following parts can be chosen by the user:

* Duration of a UTXO - for every new block / every epoch, the UTXOs value decreases, unless it's been integrated in an account. Once the UTXOs value goes to 0, the nodes of the shard can split up the UTXO in their accounts, and the UTXO disappears
* Account - which needs to pay for being hold on the chain. Every block / epoch, some of the accounts mana is distributed to the nodes, depending on how much storage the account uses:
  * Low storage: if the account is fully off-chain, the chain still needs to store the merkle-tree root and the version in the global state. But this is very little memory.
  * High storage: 
</div>
</details>
<br>

## Fledger is NOT

<details>
<summary>DeFi related - the goal of Fledger is not to allow financial transactions fast and securely</summary>

<div style="margin-left: 1em;">
Win and lose money fast, without the protection of the state - not our goal.
</div>
</details>

<details>
<summary>an investment product - Mana will be sold at a stable price for those wanting to profit from the resources of the network</summary>

<div style="margin-left: 1em;">
No HODL - please use it!
</div>
</details>
<br>

## More caveats

1. The author of Fledger dreams of working only on this project - so he allows himself to influence the Mana economy by selling them at a fixed price to pay the development of Fledger
2. The standard distribution of Fledger always includes at least one node of the main developer in the top shard

# Is Fledger for you?
In its current state, Fledger is for you if you:

* love trying out new stuff
* know some rust / typescript
* want to bring out the anarchist in you - but still want consensus on some issues
* have a running server connected 24/7 on the internet or are ready to let your browser do some work

# Minimum Viable Product

The minimum viable product allows nodes to publish a static webpage and let it run on the network.
The roadmap to do this is the following:

1. Network using WebRTC - 70% done - first version runs in Chrome, Safari, Firefox and node
2. Onboarding of new nodes - Specs are done
3. Nodes can offer disk space
4. CLI to put a static page on Fledger and a viewer
5. Add a plugin to Hugo to put the site on Fledger

ETA - End of 2021? Very ambitious. Please join ;)

# Links / Notepad
Things to consider:

* wasm interpreter with gas indication: https://github.com/perlin-network/life
