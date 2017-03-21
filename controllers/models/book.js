"use strict";

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let BookSchema = new Schema(
    {
        title : {title : String},
        author : {type : String},
        year : {type : Number},
        pages : {type : Number},
        createdAt : {type : Date}
    },{
        versionKey : false
    }
);

BookSchema.pre('save',next=>{
   let now = new Date();

    if(!this.createdAt){
        this.createdAt = now;
    }

    next();
});

module.exports = mongoose.model('book',BookSchema);