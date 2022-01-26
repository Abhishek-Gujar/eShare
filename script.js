const File = require("./models/file");
const fs = require("fs");
const connectDB = require("./config/db");
connectDB();


async function expiration(){
    const expireDate = new Date(Date.now() - (1000*60*60*24));
    const files = File.find({createdAt: {$lt: expireDate}});
    if(files.length){
        for(const file of files){
            try{
                fs.unlinkSync(file.path);
                await file.remove();
                console.log("Successfully deleted the file");
            } catch(err){
                console.log("Error occured while deleting");
            }
        }
    }
}

expiration().then(()=>{
    process.exit();
});