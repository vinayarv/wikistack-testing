const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const marked = require('marked');
const Sequelize = require('sequelize');
 var models = require('../models');
 var page = models.Page;


describe('Page Model', function(){
    describe('URL title', function(){
        var ourPage;
        before(function(done){
            page.sync({force:true}).then(function(){
                done();
            });
        });
       before(function(){
            ourPage = page.build({title: 'JavaScript is cool', content: 'test content', urlTitle: 'JavaScript_is_cool'});
       });

       it('dynamically generates a route from URL Title', function(){
        expect(ourPage.route).to.equal('/wiki/JavaScript_is_cool');
       });
    });

describe('renderedContent', function () {
    var ourPage;
    before(function(done){
        page.sync({force:true}).then(function(){
                done();
        });
    });
    before(function(){
        ourPage = page.build({title: 'JavaScript is cool', content: 'test content', urlTitle: 'JavaScript_is_cool'});
    })
      it('converts the markdown-formatted content into HTML', function(){
            expect(marked(ourPage.content)).to.equal(ourPage.renderedContent);
      });
    });
});

  describe('Class methods', function () {
    var ourPage, yourPage, myPage;
    before(function(done){
        page.sync({force:true}).then(function(){
                done();
        });
    });
    before(function(){
        ourPage = page.create({title: 'JavaScript is cool', content: 'test content', urlTitle: 'JavaScript_is_cool', tags: ['javascript', 'fullstack', 'gracehopper']});
    });
    before(function(){
        yourPage = page.create({title: 'JavaScript', content: 'test1 content', urlTitle: 'JavaScript_is_cool1', tags: ['javascript1', 'fullstack', 'gracehopper']});
    });
    before(function(){
            myPage = page.create({title: 'JavaScript is cool2', content: 'test content2', urlTitle: 'JavaScript_is_cool2', tags: ['javascript2']});
    });

    describe('findByTag', function () {
      it('gets pages with the search tag', function(){
          page.findByTag('fullstack').then(function(output){
             //console.log(output);
            expect(output.length).to.be.equal(2);
          });
      });
      it('does not get pages without the search tag', function(){
          page.findByTag('javascript2').then(function(output){
             //console.log(output);
            expect(output.length).to.be.equal(1);
          });
      });
    });

  });

    describe('Instance methods', function () {
    describe('findSimilar', function () {
      it('never gets itself');
      it('gets other pages with any common tags');
      it('does not get other pages without any common tags');
    });
  });

  describe('Validations', function () {
    var ourPage;
    var checkStatus;
    before(function(done){
        page.sync({force:true}).then(function(){
            done();
        }).catch(function(err){
            console.log(err);
      });
    })
    before(function(){
        ourPage = page.build({title: null, content: null, urlTitle:null, status: 'doggy' });
        checkStatus = page.build({title: 'JavaScript', content: 'test content', urlTitle: 'JavaScript', status: 'doggy'});
    });
    it('errors without title', function(done){
        var errMessage;
        ourPage.save().catch(function(err){
            errMessage = err.message;
            // console.log(errMessage);
            expect(errMessage).to.include('title cannot be null');
            done();
        });
    });

    it('errors without content', function(done){
        var errMessage;
        ourPage.save().catch(function(err){
            errMessage = err.message;
            expect(errMessage).to.be.include("content cannot be null");
            done();
        });
    });
    it('errors given an invalid status', function(done){
        var errMessage;
        checkStatus.save().catch(function(err){
            errMessage = err.message;
            expect(errMessage).to.be.include("invalid input value for enum enum_pages_status");
            done()
        });
    });
  });

