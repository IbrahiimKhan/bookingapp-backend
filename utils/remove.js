const fs = require("fs")
const removeSync =async (directoryPath, fileName) => {  
    try {
      fs.unlinkSync(directoryPath +"\\" +fileName);
  
      console.log("deleted")
    } catch (err) {
      console.log("error",err)
    }
  };
  
  module.exports = removeSync