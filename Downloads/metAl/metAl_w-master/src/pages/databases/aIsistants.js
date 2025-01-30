const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const AIssistantSchema = new mongoose.Schema(
  {
    provideNo: { type: ObjectId, ref: "AIserviceprovider", required: true },
    imageSrc: { type: String }, // Assuming the path will be stored here
    name: { type: String },
    username: { type: String, required: true },
    businessNo: { type: String },
  },
  { collection: "AIssistants" }
);

const AIssistant = mongoose.model("AIssistant", AIssistantSchema);
module.exports = AIssistant;
