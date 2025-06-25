import userModel from "./models/User.js";


export default class Users {
    
    get = (params) =>{
        return userModel.find(params).lean();
    }

    getBy = (params) =>{
        return userModel.findOne(params).lean();
    }

    save = (doc) =>{
        return userModel.create(doc);
    }

    update = (id,doc) =>{
        return userModel.findByIdAndUpdate(id, { $set: doc }, { new: true }).lean();
    }

    delete = (id) =>{
        return userModel.findByIdAndDelete(id).lean();
    }
    
    saveMany = (docs) => {
        return userModel.insertMany(docs);
    }
}