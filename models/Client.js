import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({

    clientName: {
        type: String,
        required: [true, "Please provide client name"],
        maxlength: 100,
      },

    ContactNo: {
        type: String,
        required: [true, "Please provide contact number"],
        maxlength: 20,
      },

    address: {
        type: String,
        required: [true, "Please provide address"],
        maxlength: 300,
      },
    
    fasNo: {
        type: String,
        required: [true, "Please provide FAS NO"],
        maxlength: 20,
    },

    status: {
        type: String,
        enum:['active', 'inactive', 'pending'],
        default: 'pending',
        required: [true, "Please provide status"],
        maxlength: 10,
    },


    alertMonth: {
        type: String,
        enum:['January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'],
    
        maxlength: 20,
    },

    description: {
        type: String,
        maxlength: 2000,
    },

    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    }

}, { timestamps: true})

export default mongoose.model('Client', ClientSchema)