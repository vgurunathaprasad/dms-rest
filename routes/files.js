const express = require('express')
const fileRouter = express.Router()
const File = require('../model/file') 
const folder = require('../model/folder')
const jwt = require("jsonwebtoken");

const config = process.env;
//const auth = require("./middleware/auth")

fileRouter.get('/', async(req,res) => {
    try{
        //t = JSON.stringify(jwt.verify(req.headers['x-access-token'], config.TOKEN_KEY))
        t =  jwt.verify(req.headers['x-access-token'], config.TOKEN_KEY).user_id
        console.log(t)
        const files = await File.find({ownerid:t})
        res.json(files)
    }catch(err){
        res.send('Error ' + err)
    }
})

fileRouter.get('/allinorder', async(req,res) => {
    try{
        //t = JSON.stringify(jwt.verify(req.headers['x-access-token'], config.TOKEN_KEY))
        t =  jwt.verify(req.headers['x-access-token'], config.TOKEN_KEY).user_id
        console.log(t)
        obj = {}
        const folders = await folder.find({ownerid:t})
        folders.forEach(async (fol) => {
            f = await File.find({parentfolder:fol._id})
            k = []
            f.forEach(ele => k.push(ele))
            obj[fol.name] = k
        });
        obj["rootfiles"] = await File.find({parentfolder:null})
        console.log(obj)
        res.json(obj)
    }catch(err){
        res.send('Error ' + err)
    }
})

fileRouter.get('/byfolder/:folderid', async(req,res) => {
    try{
        const files = await File.find({parentfolder:req.params.folderid})
        res.json(files)
    }catch(err){
        res.send('Error ' + err)
    }
})

fileRouter.patch('/changecontnet/:id',async(req,res)=> {
    try{
        const file = await File.findById(req.params.id) 
        file.content = req.body.content
        const f1 = await folder.save()
        res.json(f1)   
    }catch(err){
        res.send('Error')
    }

})

fileRouter.get('/:id', async(req,res) => {
    try{
           const file = await File.findById(req.params.id)
           res.json(file)
    }catch(err){
        res.send('Error ' + err)
    }
})


fileRouter.post('/', async(req,res) => {
    t =  jwt.verify(req.headers['x-access-token'], config.TOKEN_KEY).user_id
    const file = new File({
        name: req.body.name,
        content: req.body.content,
        ownerid: t,
        parentfolder: req.body.parentfolder
    })

    try{
        const file1 =  await file.save() 
        res.json(file1)
    }catch(err){
        res.send('Error '+err)
    }
})

fileRouter.patch('/changecontnet/:id',async(req,res)=> {
    try{
        const file = await File.findById(req.params.id) 
        file.content = req.body.content
        const f1 = await file.save()
        res.json(f1)   
    }catch(err){
        res.send('Error')
    }

})

fileRouter.delete('/:id',async(req,res)=> {
    try{
        const file = await Alien.findByIdAndRemove(req.params.id)
        .exec()
        .then(function (doc) {
            res.json(doc)
        }).catch(function (err){
            res.send(err)
        })
    }catch(err){
        res.send('Error')
    }
})

module.exports = fileRouter