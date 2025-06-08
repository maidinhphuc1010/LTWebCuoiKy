import mongoose from 'mongoose'

const deviceSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    department: { type: String, required: true },
    description: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

const Device = mongoose.model('Device', deviceSchema)
export default Device
