const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, ref: 'user'
    },
    articleId:{
        type: mongoose.Schema.Types.ObjectId, ref: 'article'
    },
    body:{
        type: String,
        required: true
    }
},{
    timestamps: true
})

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment