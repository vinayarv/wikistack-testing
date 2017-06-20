const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);

describe('2+2 =4', function(){
  xit('2+2 =4', function(){
    expect(2+2).to.equal(4);
  })
})

describe("Testing asynchronous code", function(){
  describe("setTimeOut", function(){
    xit('wait 1 second', function(done){
      var startTime = Date.now();
      setTimeout(function(){
        var duration =  Date.now() - startTime;
        expect(duration).to.be.closeTo(1000, 50);
        done();
      },1000);

    })
  })
});


describe('Test forEach', function(){
  xit('Spy on forEach', function(){
      var arr = [1,2,3,4,5];
      var logger = function(i){
        console.log(i);
      }
    logger = chai.spy(logger);
    arr.forEach(logger);
    expect(logger).to.have.been.called(arr.length);
  });
});
