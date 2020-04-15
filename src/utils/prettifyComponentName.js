module.exports=function(inputName){
    let newName="";
    inputName.split("").forEach((letter,index)=>{
        if(index===0){
            newName=letter.toUpperCase();
        }
        else if(letter===" "){
            return newName;
        }
        else if(inputName[index-1]===" "){
            newName=newName+letter.toUpperCase();
        }
        else{
            newName=newName+letter;
        }
    });
    return newName
}