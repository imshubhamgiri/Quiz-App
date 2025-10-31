import mongoose from "mongoose";

const performaceEnum = ['excellent', 'good', 'average', 'Needs Work'];

const ResultSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    // score: { type: Number, required: true },
    // totalQuestions: { type: Number, required: true },
    // correctAnswers: { type: Number, required: true },
    // wrongAnswers: { type: Number, required: true },
    // percentage: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    technology: {
        type: String,
        required: true,
        trim: true,
        enum: ['html', 'css', 'javascript', 'react', 'nodejs', 'java', 'mongodb', 'cpp', 'python', 'bootstrap']
    },


    level: { type: String, required: true, enum: ['basic', 'intermediate', 'advanced'] },
    totalquestion: { type: Number, required: true, min: 0 },
    correctanswers: { type: Number, required: true, min: 0, default: 0 },
    wrong: { type: Number, required: true, min: 0, default: 0 },
    score: { type: Number, required: true, min: 0, default: 0 },
    performance: { type: String, enum: performaceEnum, default: 'Needs work' },
    // date: { type: Date, default: Date.now }



},{
    timestamps: true
});

//compute score and performance function
ResultSchema.pre('save' , function (next) {
    const totalQuestions = Number(this.totalquestion) || 0;
    const correctAnswers = Number(this.correctanswers) || 0;
    const wrongAnswers = Number(this.wronganswers) || 0;

    // Calculate score (assuming each question carries equal marks)
    // const scorePerQuestion = 100 / totalQuestions;
    // this.score = correctAnswers * scorePerQuestion;
    // next();
    this.score = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

     // Determine performance level
    if (this.score >= 80) {
        this.performance = 'excellent';
    } else if (this.score >= 60) {
        this.performance = 'good';
    } else if (this.score >= 40) {
        this.performance = 'average';
    } else {
        this.performance = 'Needs Work';
    }

    if((this.wrong=== undefined || this.wrong === null) && totalQuestions){
        this.wrong = Math.max(0 , totalQuestions - correctAnswers);
    }

    next();

});

// ResultSchema.methods.computeScoreAndPerformance = function () {
//     const totalQuestions = this.totalquestion;
//     const correctAnswers = this.correctanswers;
//     const wrongAnswers = this.wronganswers;

//     // Calculate score (assuming each question carries equal marks)
//     const scorePerQuestion = 100 / totalQuestions;
//     this.score = correctAnswers * scorePerQuestion;

//     // Determine performance level
//     if (this.score >= 80) {
//         this.performance = 'excellent';
//     } else if (this.score >= 60) {
//         this.performance = 'good';
//     } else if (this.score >= 40) {
//         this.performance = 'average';
//     } else {
//         this.performance = 'Needs Work';
//     }
// }

const Result = mongoose.model.Result || mongoose.model("Result", ResultSchema);

export default Result;
