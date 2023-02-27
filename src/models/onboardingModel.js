import mongoose from "mongoose"

const onboardingSchema = new mongoose.Schema({
    generalInfo: {
        fullName: { type: String, required: true },
        headline: { type: String, required: true }
    },
    experience: {
        companyName: { type: String, required: true },
        position: { type: String, required: true },
        dateOfJoining: { type: Date, required: true },
        dateOfResign: { type: Date, required: true },
        workDescription: { type: String, required: true },
        usedSkills: { type: String, required: true },
    },
    addProject: {
        projectTitle: { type: String, required: true },
        projectUrl: { type: String, required: true },
        projectDescription: { type: String, required: true },
        projectDuration: { type: Number, required: true }
    },
    addLicenses: {
        name: { type: String, required: true },
        issuingOrganisation: { type: String, required: true },
        certificateLink: { type: String, required: true },
        issueDate: { type: Date, required: true },
    },
    addCourse: {
        name: { type: String, rquired: true },
        issuingOrganisation: { type: String, required: true }
    },
    contactInfo: {
        email: { type: String, required: true },
        phone: { type: Number, rquired: true },
        skypeId: { type: String, rquired: true }
    }

}, { timestamps: true })




export default mongoose.model('Onboarding', onboardingSchema)