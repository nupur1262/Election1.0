App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    App.web3Provider = web3.currentProvider;
    web3 = new Web3(web3.currentProvider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)


        // Reload when a new vote is recorded
        App.render();
      });
    });
  },
  //render: function() {}
};

function openLink(){
  window.open("index1.html");
};


function set_val(inputF) {
  var inputF = document.getElementById("Button2").value;
  App.contracts.Election.deployed().then(function(instance)
  {
    return instance.set_value(inputF);
  });then(function(result) {
    // Wait for votes to update
    console.log("correct");
  }).catch(function(err) {
    console.error(err);
  });

};
$(function() {
  $(window).load(function() {
    App.init();
  });
});
