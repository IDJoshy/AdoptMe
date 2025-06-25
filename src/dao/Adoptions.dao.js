import adoptionModel from "./models/Adoption.js";

export default class Adoption {

    get = (params) =>{
        return adoptionModel.find(params).lean();
    }

    getBy = (params) =>{
        return adoptionModel.findOne(params).lean();
    }

    save = (doc) =>{
        return adoptionModel.create(doc);
    }

    update = (id,doc) =>{
        return adoptionModel.findByIdAndUpdate(id, { $set: doc }, { new: true }).lean();
    }
    
    delete = (id) =>{
        return adoptionModel.findByIdAndDelete(id);
    }
}