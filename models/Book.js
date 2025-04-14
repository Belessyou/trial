const schema = new Schema({ title: {type: String, required: true},
author: String,
year: Number,
genre: Number,
quantity: Number,
createdBy: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'user',
    required: true,
}
});

schema.path('_id'); // ObjectId { ... }