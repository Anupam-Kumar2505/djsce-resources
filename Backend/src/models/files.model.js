import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

export default File;
