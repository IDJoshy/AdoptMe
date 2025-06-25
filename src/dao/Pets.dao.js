import petModel from "./models/Pet.js";

export default class Pet {

    get = (params) =>{
        return petModel.find(params).lean();
    }

    getBy = (params) =>{
        return petModel.findOne(params).lean();
    }

    save = (doc) =>{
        return petModel.create(doc);
    }

    update = (id,doc) =>{
        return petModel.findByIdAndUpdate(id, { $set: doc }, { new: true }).lean();
    }

    delete = (id) =>{
        return petModel.findByIdAndDelete(id).lean();
    }

    saveMany = (docs) => {
        return petModel.insertMany(docs);
    }
}