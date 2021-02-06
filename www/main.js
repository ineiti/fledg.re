window.onload = function(){
  clicked = false;
  inner = document.getElementById('inner').style;
  quit = document.getElementById('quit').style;
  setTimeout(()=>{
    // link_quit(5);
  }, 1000);
}

function get_elements(){
  return [1,2,3,4,5].map((i) => document.getElementById(`link${i}`));
}

function inner_animation(add){
  inner.animationName = `rotate, ${add}`;
  inner.animationDuration = "20s, 2s";
  inner.animationTimingFunction = "ease-in-out, ease-in";
}

function link_fun(){
  if (clicked) return;
  clicked = true;
  inner_animation('flyaway');
  setTimeout(()=>{document.location = "./fun.html"}, 2000);
}

function link_quit(id){
  if (clicked) return;
  clicked = true;
  inner_animation('shrink');
  setTimeout(()=>{
    inner.display = "none";
    quit.display = "inline";
    quit.animationName = "quit_show";
    document.getElementById(`quit_text_${id}`).style.display = "block";
  }, 2000);
}

function link_random(list){
  let a = new Uint8Array(1);
  window.crypto.getRandomValues(a);
  document.location = list[a[0] % list.length];
}

function link_research(){
  link_random([
    "https://www.algorand.com/",
    "https://dcl.epfl.ch/site/poc-at2_project",
    "https://showcase.c4dt.org/project/DEDIS/omniledger",
    "https://cardano.org/",
    "https://chain.link/",
    "https://lazyledger.org/",
    "https://cardano.org/ouroboros/",
    "https://solana.com/",
    "https://tezos.com/",
    "https://z.cash/",
  ]);
}

function link_foobar(){
  link_random([
    "https://aeternity.com/",
    "https://www.bigchaindb.com/",
    "https://casperlabs.io/",
    "https://concordium.com/",
    "https://www.r3.com/",
    "https://dfinity.org/",
    "https://eos.io/",
    "https://ethereum.org/en/eth2/",
    "https://www.hyperledger.org/use/fabric",
    "https://www.getmonero.org/",
    "https://near.org/",
    "https://ripple.com/",
    "https://sovrin.org/",
    "https://tether.to/",
    "https://waves.tech/",
  ]);
}
