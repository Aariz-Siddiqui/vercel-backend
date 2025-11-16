const mongoose = require("mongoose");
const URI = "mongodb+srv://ariz:kinged20@cluster0.nnzafvq.mongodb.net/mern_admin?retryWrites=true&w=majority&appName=Cluster0";
const connectdb = async()=>{
try {
   await mongoose.connect(URI); 
   console.log("connection to database is successfull");
} catch (error) {
    console.error("Failed to connect with the database");
    process.exit(0);
}
};

module.exports = connectdb;