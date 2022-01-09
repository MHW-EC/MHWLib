
class Career {
    static getAll(){
        return new Promise((resolve, reject)=>{
            resolve(300);
        })
    }
};
module.exports = {
    getAll: Career.getAll
};