var ops = ["+","-","/","*","<","<=",">",">=","!=","==","^"];
var variables = [];

function toDo(){
    var iterator = 0;
    var stack = new Array();
    var polizTemp = polizString.slice();
    while(iterator < polizTemp.length){
        //polizString[iterator]
        if(polizTemp[iterator]=="\n" || polizTemp[iterator]==":"
        || include(labels,polizTemp[iterator])){
            iterator++;
        }else if(include(idn,polizTemp[iterator])|| include(cons,parseInt(polizTemp[iterator]))){
            stack.push(polizTemp[iterator++]);
        }else if(polizTemp[iterator]=="WR") {
            var id =stack.pop();
            if(variables[id]!=undefined)
                log(id+" = "+variables[id]);
            else{
                log(id+" is undefined");
            }
            iterator++;
        }else if(polizTemp[iterator]=="RD") {
            var id = stack.pop();
            var numb = inpNumb(id);
            if(parseInt(numb)==NaN || numb==undefined){
                alert("Помилка");
                log("Помилка. Не введене значення змінної "+id);
                return;
            }else{
                variables[id]=numb;
                log("Введіть "+id +" : "+numb);
            }
            iterator++;
        }else if(polizTemp[iterator]=="@") {
            var d1 = stack.pop();
            var v1 = (include(idn,d1)?variables[d1]:d1);
            var res = eval(-v1);
            stack.push(res);
            iterator++;
        }else if(include(ops,polizTemp[iterator]) ){
            var d2 = stack.pop() ;
            var d1 = stack.pop();
            var v2 = (include(idn,d2)?variables[d2]:d2);
            var v1 = (include(idn,d1)?variables[d1]:d1);
            if(v1==undefined){
                alert(d1+ " is undefined");
                log(d1+ " is undefined");
                return;
            }
            if(v2==undefined){
                alert(d2+ " is undefined");
                log(d2+ " is undefined");
                return;
            }
            var res;
            if(polizTemp[iterator]=="^"){
                res = Math.pow(v1,v2);
            }else{
                try{
                    res = eval(v1+polizTemp[iterator]+v2);
                }catch(e){
                    alert(e.message);
                    log(e.message);
                    return;
                }
            }
            stack.push(res);
            iterator++;
        }else if(polizTemp[iterator]==":="){
            var val = stack.pop();
            variables[ stack.pop()]=val;
            iterator++;
        }else if(polizTemp[iterator]=="not"){
            stack.push(!stack.pop());
        }else if(polizTemp[iterator]=="and" || polizTemp[iterator]=="or"){
            var v2 =stack.pop();
            var v1 = stack.pop();
            var res;
            if(polizTemp[iterator++]=="and"){
                res = ((v1==true && v2==true)?true:false);
            }else{
                res = ((v1==true || v2==true)?true:false);
            }
            stack.push(res);
        }else if(polizTemp[iterator]=="УПЛ"){
            // console.log(polizTemp);
            if(stack.pop()==false){
                iterator = polizTemp.indexOf(polizTemp[iterator-1],iterator);
            }else{
                iterator++;
            }
        }else if(polizTemp[iterator]=="БП"){
            var index = polizTemp.indexOf(polizTemp[iterator-1]);
            if(index==(iterator-1)){
                iterator = polizTemp.indexOf(polizTemp[iterator-1],iterator);
            }else{
                iterator = index;
            }
        }

    }
}

function inpNumb(id){
    return prompt("Введіть id : "+id, "");
}

function log(text){
    $("#poliz").text($("#poliz").text()+text+"\n");
}
