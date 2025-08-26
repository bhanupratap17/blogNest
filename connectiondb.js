const mongoose =  require('mongoose');

async function connectionMongoDB(uri){
await mongoose.connect(uri)
.then(()=> console.log("connected successfully")
)
.catch((err) => {
     console.error("MongoDB connection error:", err);
     process.exit(1); 
})
}

module.exports = { connectionMongoDB };