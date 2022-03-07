const express = require('express')
const folderRouter = express.Router()
const Folder = require('../model/folder') 
//const auth = require("./middleware/auth");

folderRouter.get('/',async(req,res) => {
    try{
        t =  jwt.verify(req.headers['x-access-token'], config.TOKEN_KEY).user_id
        console.log(t)
        const folders = await Folder.find({ownerid:t})
        res.json(folders)
    }catch(err){
        res.send('Error ' + err)
    }
})

folderRouter.get('/:id', async(req,res) => {
    try{
        const folder = await Folder.findById(req.params.id)
        res.json(folder)
    }catch(err){
        res.send('Error ' + err)
    }
})


folderRouter.post('/', async(req,res) => {
    t =  jwt.verify(req.headers['x-access-token'], config.TOKEN_KEY).user_id
    const folder = new Folder({
        name: req.body.name,
        parentfolderid: req.body.parentfolder,
        ownerid: t
    })

    try{
        const folder1 =  await folder.save() 
        res.json(a1)
    }catch(err){
        res.send('Error '+err)
    }
})

folderRouter.delete('/:id',async(req,res)=> {
    try{
        const folder = await Folder.findByIdAndRemove(req.params.id)
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

module.exports = folderRouter