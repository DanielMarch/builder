'use strict';

var _ = require('lodash');
var users = global.nss.db.collection('users');
var trees = global.nss.db.collection('trees'); //imports mongodb collection
var Mongo = require('mongodb'); //importing node module
var treeHelper = require('../lib/tree-helper'); //importing file

exports.index = (req, res)=>{
  res.render('game/index', {title: 'Builder'});
};

exports.convert = (req, res)=>{
  var wood = req.body.data;
  var userId = Mongo.ObjectID(req.body.userId);
  var money = wood / 5;
  users.findOne({_id: userId}, (e,user)=>{
    user.cash += money;
    user.wood -= wood;
    users.save(user, (e, count)=>{
      console.log(user);
      res.send(user);
    });
  });
};

exports.chop = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId);

  trees.findOne({_id:treeId}, (e,tree)=>{ //find tree within trees collection
    if(tree.height > 48){
      var wood = tree.height / 2;
      var userID = tree.userId;
      tree.isChopped = true;
      trees.save(tree, (e, count)=>{
        res.render('game/tree', {tree: tree, treeHelper:treeHelper}, (e,html)=>{
          res.send(html);
        });
        users.findOne({_id: userID},(e,u)=>{
          u.wood += wood;
          users.save(u, (error, count)=>{
          });
        });
      });
    }
  });
};

exports.grow = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId); //tree id coming in from PUT
  trees.findOne({_id:treeId}, (e,tree)=>{ //find tree within trees collection
    tree.height += _.random(0, 2);
    tree.isHealthy = _.random(0, 100) !== 69;
    trees.save(tree, (e, count)=>{ //if id ie: tree, is not included, new info is inserted into object, the variable is count or the count of what you updated
      res.render('game/tree', {tree: tree, treeHelper:treeHelper}, (e,html)=>{
        res.send(html);
      });
    });
  });
};

exports.forest = (req, res)=>{
  var userId = Mongo.ObjectID(req.params.userId);

  trees.find({userId:userId}).toArray((e,objs)=>{
    res.render('game/forest', {trees: objs, treeHelper:treeHelper}, (e,html)=>{ //normally when you use res.render, it is sent to the browser. with this function it doesnt go to browser
      res.send(html); //sending html to game/forest, but it is not rendered to the browser
    });
  });
};

exports.seed = (req, res)=>{
  var userId = Mongo.ObjectID(req.body.userId);
  var tree = {};
  tree.height = 0;
  tree.userId = userId;
  tree.isHealthy = true;
  tree.isChopped = false;

  trees.save(tree, (e,obj)=>{
    res.render('game/tree', {tree: obj, treeHelper:treeHelper}, (e,html)=>{
      res.send(html);
    });
  });
};

exports.login = (req, res)=>{
  var user = {};
  user.username = req.body.username;
  user.wood = 0;
  user.cash = 0;

  users.findOne({username:user.username}, (e,fobj)=>{ //finds whether username already exists in teh collection
    if(fobj){ //if the user already exists in the collection, return the user obj
      res.send(fobj);
    }else{ //if the user doesnt exist in the collection, save to collection
      users.save(user, (e,sobj)=>res.send(sobj));
    }
  });
};
