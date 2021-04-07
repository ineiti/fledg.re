# Onboarding and Vetting

An important part of Fledger is the ability to give rewards to slower nodes.
There are of course a couple of problems with this:

1. there might be a high churn for new nodes
2. an attacker might chose a slow group to double-spend
3. nodes must be incentivized to appear as single nodes and not multiple nodes

## Node and Shard Types

To avoid churn bringing down one or more shards, nodes need to prove that they are actually useful
and will be around for some time.
This is done by attributing a reliability index to each node.
Also, there are different types of shards to accomodate different nodes.

### Node Types

In alphabetical order, the nodes are:

- Ant - fresh node, just arriving.
A new node first has to register with a shard, which happens at the epoch time (1 minute).
Once the node is registered, it needs to prove itself during one epoch that it is reliable.
None of the work during this first epoch goes into the consensus of the network.
If an Ant node disappears before the second epoch, nothing is lost.
Later an Ant node might already participate in caching data, though.
- Bee - a node participating in the consensus.
Once an Ant node showed it's around for more than just a short timeframe, the system supposes it will
stay a bit and promote it to a Bee node.
A Bee node participates in the consensus and does work as ordinary nodes.
There is one difference though: to avoid that a shard is stalled by too many Bees leaving,
only up to _f_ from a total of _3f+1_ nodes in a shard can be Bee-nodes.
Also, not all shards accept Bees.
- Crabs - node having proven its reliability
Once a Bee stayed long enough and proved it can catch up with the other nodes, it
is promoted to Crab node.
- Duck - a Crab in a stable shard
The most stable type of node is a Duck.
To get promoted to a Duck node, a Crab node must stay alive long enough.

As described in the OmniLedger paper, all nodes are periodically swapped with each other to
avoid byzantine nodes to accumulate in a shard.
This must be done in a way to swap nodes of similar power, but still allow to mingle 
nodes enough to avoid buildup of faulty nodes.

### Shard Types

Nodes are included in shards in a given chronological order.
The shard-names are also in increasing alphabetical order:

- Queue - a shard that queues up Ant nodes and converts them to
Bee nodes.
A Queue shard is always directed by a Refiner shard.
If too many Bee nodes are present in a Queue shard, then a Queue shard might convert into
a Refiner shard and spawn two new Queue shards.
Once a Bee node has been present in a Queue shard 
- Refiner - starts with only Duck nodes, but replaces them slowly with Crab nodes.
The Refiner shard will constant
The goal of a Refiner shard is to convert Crab nodes to 