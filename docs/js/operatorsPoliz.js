var operations = {
    "(" : 0,
    "[" : 0,
    "if": 0,
    "do":0,
    "while":0,
    "enddo":1,
    "endif": 1,
    ")" : 1,
    "]" : 1,
    ":=" : 2,
     "or": 3,
    "and": 4,
    "not": 5,
     "<": 6,
     ">": 6,
    "<=": 6,
    ">=": 6,
    '==': 6,
    '!=': 6,
    "+" : 7,
    "-" : 7,
    "@" : 8,
    "/" : 8,
    "*" : 8,
    "^" : 9

};

var allOperations = ["(","+","-",")","*","/",":=","or","and","not", "<", ">","<=",">=","==",'!=',"[","]","^"];

function mathAndLogOps(input){
    var stack = new Array();//для операций
    var polizString = new Array();
        for (var i = 0; i < input.length; i++) {
            if(input[i].toUpperCase() != input[i].toLowerCase() || Number.isInteger(+input[i])){//its letter or Number
                polizString.push(input[i]);
            }else if(input[i]=="-" && (i==0 || (allOperations.indexOf(input[i-1])>-1) && input[i-1]!="(" && input[i-1]!=")")){//если унарный
                stack.push("@");
            }else{//its operator
                    if(stack.length==0){
                        stack.push(input[i]);
                    }else if(input[i]=="("){
                        stack.push(input[i]);
                    }else if(input[i]==")"){
                        while(stack[stack.length-1]!="("){
                            polizString.push(stack.pop());
                        }
                        stack.pop();
                    }else{
                        if(operations[stack[stack.length - 1]] >= operations[input[i]]){
                            polizString.push(stack.pop());
                            i--;
                        }else {
                            stack.push(input[i]);
                        }
                    }
            }
        }
        while(stack.length != 0){
            polizString.push(stack.pop());
        }
        $("#poliz").val($("#poliz").val()+polizString.join(""));
    // calc(polizString);
}


function readAndWriteOps(input){
    var stack = new Array();//для операций
    var polizString = new Array();
    if(input[0]=="read" || input[0]=="write"){
        stack.push(input[0]);
        for (var i = 3; i < input.length; i++) {
            if(input[i].toUpperCase() != input[i].toLowerCase() || Number.isInteger(+input[i])){//its letter or Number
                polizString.push(input[i]);
            }else if(input[i]=="," && (stack.indexOf("read")>-1 || stack.indexOf("write")>-1))
                polizString.push("RD");
                else if (input[i]==")") {
                    polizString.push("RD");
                    stack.pop();
                }
        }
        $("#poliz").val($("#poliz").val()+polizString.join(""));
    }
}

function ifOps(input){
    var forBody = ["write","read","do","if"];
    var stack = new Array();//для операций
    var polizString = new Array();
    if(input[0]=="if"){
        stack.push(input[0]);
        for (var i = 1; i < input.length; i++) {
            if(forBody.indexOf(input[i])>-1){
                while(stack.length != 1){
                    polizString.push(stack.pop());
                }
                stack.push("mi");
                polizString.push("mi+1 УПЛ mi");
            }else if(input[i]=="-" && allOperations.indexOf(input[i-1])>-1){//если унарный
                stack.push("@");
            }else if((input[i].toUpperCase() != input[i].toLowerCase() || Number.isInteger(+input[i]))&& input[i+1]!=":="){//its letter or Number
                polizString.push(input[i]);
            }else{//its operator
                if(input[i]=="("){
                        stack.push(input[i]);
                }else if(input[i]==")"){
                    while(stack[stack.length-1]!="("){
                        polizString.push(stack.pop());
                    }
                    stack.pop();
                }else{
                    if(operations[stack[stack.length - 1]] >= operations[input[i]]){
                        polizString.push(stack.pop());
                        i--;
                    }else {
                        stack.push(input[i]);
                    }
                }
            }

        }
    }
    $("#poliz").val($("#poliz").val()+polizString.join(""));
}
var labels = new Array();
var polizString = new Array();

function allPoliz(input){
    var mCounter = 1;
    var forBody = ["write","read","do","if"];
    var stack = new Array();//для операций

        for (var i = 0; i < input.length; i++) {
            var findIf = findInStack(stack,"if",0,2);
            var findDo = findInStack(stack,"do",0,2);
            if(input[i]=="else"){
                console.log(stack[stack.length-1].substr(0, 2));
                while(stack[stack.length-1].substr(0, 2)!="if")
                    polizString.push(stack.pop());
                stack[stack.length-1]+=" m"+mCounter++;
                labels.push("m"+(mCounter-1));
                //[m+Mcounter БП mi:]
                polizString.push(stack[stack.length-1].split(" ")[2]);
                polizString.push("БП");
                polizString.push(stack[stack.length-1].split(" ")[1]);
                polizString.push(":");
            }else if(input[i]=="endif"){
                while(stack[stack.length-1].substr(0, 2)!="if")
                    polizString.push(stack.pop());
                    polizString.push(stack[stack.length-1].split(" ")[2]);
                    polizString.push(":");
                    stack.pop();
            }else if(input[i]=="enddo"){
                while(stack[stack.length-1].substr(0, 2)!="do")
                    polizString.push(stack.pop());
                polizString.push(stack[stack.length-1].split(" ")[1]);
                polizString.push("БП");
                polizString.push(stack[stack.length-1].split(" ")[2]);
                polizString.push(":");
                stack.pop();
            }else if(input[i]=="-" && allOperations.indexOf(input[i-1])>-1){//если унарный
                stack.push("@");
            }else if(allOperations.indexOf(input[i]) > -1){//Math or Log
                if(input[i]=="("){
                    if(stack.indexOf("read")==-1 && stack.indexOf("write")==-1)
                        stack.push(input[i]);
                }else if(input[i]=="["){
                    stack.push(input[i]);
                }else if(input[i]==")" || input[i]=="]"){
                    if(stack[stack.length - 1] == "write"|| stack[stack.length - 1] == "read"){
                        if(stack[stack.length-1]=="read")
                            polizString.push("RD");
                        else{
                            polizString.push("WR");
                        }
                    }else{
                        while(stack[stack.length-1]!="(" && stack[stack.length-1]!="["){
                            polizString.push(stack.pop());
                        }
                    }
                    stack.pop();
                }else{
                    if(operations[stack[stack.length - 1]] >= operations[input[i]]){
                        polizString.push(stack.pop());
                        i--;
                    }else {
                        stack.push(input[i]);
                    }
                }
            }else if(input[i]==";"){
                var findIf = findInStack(stack,"if",0,2);
                var findDo = findInStack(stack,"do",0,2);
                if(stack[stack.length-1]=="read" || stack[stack.length-1]=="write"){
                    stack.pop();
                    polizString.push("\n");
                }else if(findIf.find && findDo.find){
                    if(findIf.index > findDo.index){
                        while(stack[stack.length-1].substr(0,2)!="if"){
                            polizString.push(stack.pop());
                        }
                    }else{
                        while(stack[stack.length-1].substr(0,2)!="do"){
                            polizString.push(stack.pop());
                        }
                    }
                }else if(findIf.find){
                    while(stack[stack.length-1].substr(0,2)!="if"){
                        polizString.push(stack.pop());
                    }
                }else if(findDo.find){
                    while(stack[stack.length-1].substr(0,2)!="do"){
                        polizString.push(stack.pop());
                    }
                }else{
                    while(stack.length != 0){
                        polizString.push(stack.pop());
                    }
                }
                polizString.push("\n");
            }else if(findIf.find &&(
                ((input[i].toUpperCase() != input[i].toLowerCase() || Number.isInteger(+input[i]) )
                && input[i+1]==":=" &&(findDo.find==false || (findDo.find && findIf.index>findDo.index))) ||
                (forBody.indexOf(input[i])>-1 && (findDo.find==false || (findDo.find && findIf.index>findDo.index)))
            )){
                    // if((findIf.find && findDo.find && findIf.index > findDo.index) || (findIf.find && findDo.find==false) ){
                    while(stack[stack.length-1].substr(0,2)!="if"){
                        polizString.push(stack.pop());
                    }
                    if(stack[stack.length-1].split(" ").length==1){
                        polizString.push("m"+mCounter);
                        polizString.push("УПЛ");
                        stack[stack.length-1] +=" m"+(mCounter++);
                        labels.push("m"+(mCounter-1));

                    }
                    if(input[i]=="write" || input[i]=="read"){
                        stack.push(input[i]);
                        i = i + 2;
                    }else if(input[i]=="do"){
                        polizString.push("m"+mCounter);
                        polizString.push(":");
                        stack.push("do m"+mCounter++);
                        labels.push("m"+(mCounter-1));
                        i = i + 1;
                    }else if(input[i]=="if"){
                        stack.push(input[i]);
                    }else if(input[i+1]==":="){
                        polizString.push(input[i]);
                    }
            }else if(findDo.find &&(
                ((input[i].toUpperCase() != input[i].toLowerCase() || Number.isInteger(+input[i]) )
                && input[i+1]==":=" &&(findIf.find==false || (findIf.find && findIf.index<findDo.index))) ||
                (forBody.indexOf(input[i])>-1 && (findIf.find==false || (findIf.find && findIf.index<findDo.index)))
            )){
                    while(stack[stack.length-1].substr(0,2)!="do"){
                        polizString.push(stack.pop());
                    }
                    if(stack[stack.length-1].split(" ").length!=3){
                        polizString.push("m"+mCounter);
                        polizString.push("УПЛ");
                        stack[stack.length-1] +=" m"+(mCounter++);
                        labels.push("m"+(mCounter-1));
                    }
                    if(input[i]=="write" || input[i]=="read"){
                        stack.push(input[i]);
                        i = i + 2;
                    }else if(input[i]=="do"){
                        polizString.push("m"+mCounter);
                        polizString.push(":");
                        stack.push("do m"+mCounter++);
                        labels.push("m"+(mCounter-1));
                        i = i + 1;
                    }else if(input[i]=="if"){
                        stack.push(input[i]);
                    }else if(input[i+1]==":="){
                        polizString.push(input[i]);
                    }

            }else if(input[i]=="write" || input[i]=="read"){
                 stack.push(input[i]);
                 i = i + 2;
             }else if (input[i]=="," && (stack[stack.length-1]=="read" || stack[stack.length-1]=="write")){
                if(stack[stack.length-1]=="read")
                    polizString.push("RD");
                else{
                    polizString.push("WR");
                }
            }else if(input[i]=="if"){
                stack.push(input[i]);
            }else if(input[i]=="do"){
                polizString.push("m"+mCounter);
                polizString.push(":");
                stack.push("do m"+mCounter++);
                labels.push("m"+(mCounter-1));
                i = i + 1;
            }else if(input[i]=="end"){
                while(stack.length!=0){
                    polizString.push(stack.pop());
                }
            }else if((input[i].toUpperCase() != input[i].toLowerCase() || Number.isInteger(+input[i])) && forBody.indexOf(input[i])==-1){//its letter or Number
                polizString.push(input[i]);
            }

        }
        console.log("labels ", labels);
        console.log("polizString ", polizString);
        $("#result").val($("#result").val()+"\n\n"+polizString.join(" "));
        var lines = $('#result').val().split('\n');
        for(var k = 0; k< lines.length;k++){
            if(lines[k][0]==" "){
                lines[k] = lines[k].slice(1);
            }
        }
        $('#result').val(lines.join("\n"));

}

function findInStack(stack,value,from,to){
    for(var i = stack.length-1;i>=0;i--){
        if (stack[i].substr(from,to)==value)
            return {"find":true,"index":i};
    }
    return {"find":false};
}
