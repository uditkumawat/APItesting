"use strict";

process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let chai = require('chai');
let chaiHttp = require('chai-http');

let Book = require('../controllers/models/book.js');
let server = require('../server.js');

let should = chai.should();

chai.use(chaiHttp);

//our parent block

describe('Books',()=>{

    beforeEach((cb)=>{        //before each test we empty the db

        Book.remove({},(err)=>{
           cb();
       })
    });
});

/*
Test the /GET route
 */

describe('/GET book',()=>{

    it('It should GET all the books',(cb)=>{

        chai.request(server).get('/book').end((err,res)=>{

            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);

            cb();
        });
    });
});

/*
Test the /POST route
 */

describe('/POST book',()=>{

    it('it should POST a book ', (done) => {
        let book = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954,
            pages: 1170
        }
        chai.request(server)
            .post('/book')
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Book added');
                res.body.book.should.have.property('title');
                res.body.book.should.have.property('author');
                res.body.book.should.have.property('pages');
                res.body.book.should.have.property('year');
                done();
            });
    });

    it('it should not POST a book without pages field',(cb)=>{

        let book = {
            title : 'The lord of rings',
            author : 'Hello',
            year :1954
        }

        chai.request(server).post('/book').send(book).end((err,res)=>{

            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('pages');
            res.body.errors.pages.should.have.property('kind').eql('required');

            cb();
        });
    });
});



describe('/GET/:id book', () => {
    it('it should GET a book by the given id', (done) => {
        let book = new Book({title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, pages: 1170});
        book.save((err, book) => {
            chai.request(server)
                .get('/book/' + book.id)
                .send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('author');
                    res.body.should.have.property('pages');
                    res.body.should.have.property('year');
                    res.body.should.have.property('_id').eql(book.id);
                    done();
                });
        });

    });
});