var Election = artifacts.require("./Election.sol");

contract("Election" , function(accounts){

    var electionInstance;
    //To check if the total number of candidates is 1
    it("Initialization.." , function(){
        return Election.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count){
            assert.equal(count,1);
        });
    });

    it("Initialized with correct values" , function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0] , 1, "contains correct id");
            assert.equal(candidate[1] , 'Candidate 1' , "Contains correct name");
            assert.equal(candidate[2] , 0 , "Contains correct vote count");
            return electionInstance.candidates(2);
        });
    });
    it("Start voting.." , function(){
        return Election.deployed().then(function(instance){
            electionInstance=instance;
            candidateId=1;
            return electionInstance.vote(candidateId,{from: accounts[0] });
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, "an event was triggered");
            assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
            assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
            return electionInstance.voters(accounts[0]);
        }).then(function(voted){
            assert(voted,"the voter was marked as voted");
            return electionInstance.candidates(candidateId);
        }).then(function(candidate){
            var voteCount=candidate[2];
            assert.equal(voteCount,1,"increments the candidate's vote count");
        })
    });
    
    it("Voting not more than once", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          candidateId = 1;
          electionInstance.vote(candidateId, { from: accounts[1] });
          return electionInstance.candidates(candidateId);
        }).then(function(candidate) {
          var voteCount = candidate[2];
          assert.equal(voteCount, 1, "accepts first vote");
          // Try to vote again
          return electionInstance.vote(candidateId, { from: accounts[1] });
        }).then(assert.fail).catch(function(error) {
          assert(error.message/*.indexOf('revert') >= 0*/, "error message must contain revert");
          return electionInstance.candidates(1);
        });
    });

});