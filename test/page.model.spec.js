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
       before(function(){
         page.sync({force:true});
         ourPage = page.build({title: 'JavaScript is cool', content: 'test content', urlTitle: 'JavaScript_is_cool'});
               
       })
       it('dynamically generates a route from URL Title', function(){
        expect(ourPage.route).to.equal('/wiki/JavaScript_is_cool');
       })
    })

describe('renderedContent', function () {
    var ourPage;
    before(function(){
        page.sync({force:true});
        ourPage = page.build({title: 'JavaScript is cool', content: 'test content', urlTitle: 'JavaScript_is_cool'});
    })
      it('converts the markdown-formatted content into HTML', function(){
            expect(marked(ourPage.content)).to.equal(ourPage.renderedContent);
      });
    });
}); 

  describe('Validations', function () {
    var ourPage;
    before(function(){
        page.sync({force:true});
        ourPage = page.build({title: null, content: null, urlTitle:null, status: null });
    });
    it('errors without title', function(){
        expect(ourPage).to.throw(Sequelize.SequelizeValidationError);
    });
    xit('errors without content');
    xit('errors given an invalid status');
  });

 

 












