import mongoose from 'mongoose'

export const WorkLog = mongoose.model('WorkLog', {
    description: { required: true, type: String, default: 'Administration' },
    hours: { required: true, type: Number, default: 0 },
    rate: { required: true, type: Number, default: 30 },
    billed: { required: true, type: Boolean, default: false },
    timestamp: { required: true, type: Date, default: () => new Date() },
    stashed: {required: true, type: Boolean, default: () => false}
})