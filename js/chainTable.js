var code =
`program cacl
var ,i, sum:integer
begin
    sum:=0;
    read(,i);
    do while i<5 and i>=0
        write(,i);
        sum:=sum+i;
        i:=i+1
    enddo;
    i:=(sum+5)/5+3^2;
    write(,sum);
    sum:=-sum;
    if i==12
        write(,sum);
    	do while [i<15]
            if i==14
                sum:=sum+1;
                write(,sum)
            else
                write(,i)
            endif;
            i:=i+1
    	enddo
    else
        write(,i)
    endif
end`;

function inputCode(){
    $("#inputCode").html(code);
}

function createChainTable(){
    var stack = new Array();
    var poliz = new Array();
    stack.push({"row":0, "value":"#"});
    var startBasis = 0;
    var endBasis = 0;
    var FLAG = false;
    var FlagDivide;
    var left;

    var tbl     = document.createElement("table");
    var tblBody = document.createElement("tbody");
    addRow(tblBody,"Кроки","Стек","Відношення","Вхідний ланцюжок","Поліз" );
    outputLaTable.push({value:"#", row: "end"});

    for (var i = 0; i < outputLaTable.length; i++) {
        console.log("ITERATION ", i);
        var row = findElementRow(tableArray, stack[stack.length-1].value);
        var column = findElementColumn(tableArray, outputLaTable[i].value);
        var symbol;
        console.log("Compare left ",stack[stack.length-1].value);
        console.log("Compare right ", outputLaTable[i].value);
        console.log("ROW ", row);
        console.log("COLUMN ", column);
        if(outputLaTable[i].value == "#"){
            $("#result").val("Successful");
            // return;
        }
        if(row == -1 && column == -1){
            if(include(idn, stack[stack.length-1].value) && include(cons, Number(outputLaTable[i].value))){
                symbol = tableArray[findElementRow(tableArray, "id")][findElementRow(tableArray, "cons")];
                console.log("ID and CONS");
            }else if(include(idn, stack[stack.length-1].value) && include(idn, outputLaTable[i].value)){
                symbol = tableArray[findElementRow(tableArray, "id")][findElementRow(tableArray, "id")];
                console.log("ID and ID");
            }else if(include(cons, Number(stack[stack.length-1].value)) && include(idn, outputLaTable[i].value)){
                symbol = tableArray[findElementRow(tableArray, "cons")][findElementRow(tableArray, "id")];
                console.log("CONS and IDN");
            }else if(include(cons, Number(stack[stack.length-1].value)) && include(cons, Number(outputLaTable[i].value))){
                symbol = tableArray[findElementRow(tableArray, "cons")][findElementRow(tableArray, "cons")];
                console.log("CONS and CONS");
            }
        }else if(row == -1 || column == -1){
            if(row == -1){
                console.log("ROW = -1");
                if(include(idn, stack[stack.length-1].value)){
                    symbol = tableArray[findElementRow(tableArray, "id")][column];
                    console.log("ID");
                }
                else if(include(cons, Number(stack[stack.length-1].value))){
                    symbol = tableArray[findElementRow(tableArray, "cons")][column];
                    console.log("CONS");
                }
                else {
                    if(i != outputLaTable.length-1)
                        $("#result").val($("#result").val()+"ПОМИЛКА: немає співпадінь в рядку "+outputLaTable[i].row);
                    console.log("ERROR");
                    return;
                }
            }else if(column == -1){
                console.log("COLUMN = -1 ", outputLaTable[i].value);
                if(include(idn, outputLaTable[i].value)){
                   symbol = tableArray[row][findElementColumn(tableArray, "id")];
                   console.log("COLUMN - 1 and ID");
               }else if(include(cons, Number(outputLaTable[i].value))){
                   symbol = tableArray[row][findElementColumn(tableArray, "cons")];
                   console.log("COLUMN - 1 and cons");
               }else{
                   console.log("HEY");
                   $("#result").val($("#result").val()+"ПОМИЛКА: немає співпадінь в рядку "+outputLaTable[i].row);
                   return;
               }
            }
        }else{
            console.log("ROW and COLUMN != 1");
            symbol = tableArray[row][column];
        }
        //знайшли відношення між останнім елементом стеку і outputLaTable[i]
        if(symbol==undefined){
            $("#result").val($("#result").val()+"ПОМИЛКА: немає співпадінь в рядку "+outputLaTable[i].row);
            return;
        }
        console.log("MY SYMBOL is ", symbol);

        if(outputLaTable[i].value==":="){
            FLAG = true;
            left = outputLaTable[i-1].value;
        }
        if(outputLaTable[i].value==";" && FLAG == true){
            FLAG = false;
            FlagDivide = i;
        }

        //обработать полученный полиз и очистить полиз
        if(i-1 ==FlagDivide){
            //вызывать функцию для подсчета выражения
            // var t = calcExpressions(left,poliz);
            // if(t == -1)
            //     return;
            poliz = new Array();
            left = "";
        }

        var idnConsFlag = false;
        // if id or const = add to poliz
        if(FLAG){
            if(include(idn, outputLaTable[i].value)){
                poliz.push(outputLaTable[i].value);
                idnConsFlag = true;
            }
            if(include(cons, Number(outputLaTable[i].value))){
                poliz.push(Number(outputLaTable[i].value));
                idnConsFlag = true;
            }
        }

        if(symbol == "<"){
            stack.push(outputLaTable[i]);
            if(idnConsFlag)
                addRow(tblBody,i,printArray(stack),symbol,printArray(outputLaTable.slice(i)),poliz);
            else
                addRow(tblBody,i,printArray(stack),symbol,printArray(outputLaTable.slice(i)),"");

            tbl.appendChild(tblBody);
        }else if(symbol == "="){
            stack.push(outputLaTable[i]);
            if(idnConsFlag)
                addRow(tblBody,i,printArray(stack),symbol,printArray(outputLaTable.slice(i)),poliz);
            else
                addRow(tblBody,i,printArray(stack),symbol,printArray(outputLaTable.slice(i)),"");

            tbl.appendChild(tblBody);
        }else{
            startBasis = findStartBasic(tableArray,stack);
            console.log("startBasis ",startBasis);
            endBasis = stack.length-1;
            console.log("endBasis ", endBasis);
            var rightString = "";
            for (var j = startBasis; j <= endBasis; j++) {
                if(findElementRow(tableArray,stack[j].value ) == -1){//проверяю входящий символ на idn or cons
                    if(include(idn, stack[j].value))
                       rightString += "id ";
                   else if(include(cons, Number(stack[j].value)))
                        rightString += "cons ";
                        else{
                            $("#result").val($("#result").val()+"ПОМИЛКА: немає співпадінь в рядку "+outputLaTable[i].row);
                            return;
                        }
                }else{
                    rightString += stack[j].value+" ";
                }
            }
            if(rightString[rightString.length - 1] == " "){
                rightString = rightString.substr(0,rightString.length - 1);
            }
            console.log("my string ", rightString);
            //ищем совпадение по правой части
            for (var j = 0; j < forInterest.length; j++) {
                if (forInterest[j]["right"].join(" ") == rightString){
                    console.log("СРАВНИТЬ");
                    console.log(forInterest[j]["right"].join(" ")," + ", rightString, "  =", forInterest[j]["right"].join(" ") == rightString);
                    console.log("Found left  = ", forInterest[j].left);
                    console.log("Stack before ", printArray(stack));
                    console.log("startBasis ", startBasis);
                    var stackLength = stack.length - 1;

                    tbl.appendChild(tblBody);
                    var toPoliz = false;
                    if (forInterest[j]["right"].join(" ") == "- <терм1>"){
                        poliz.push("@");
                        toPoliz = true;
                    }
                    if (forInterest[j]["right"].join(" ") == "<выр> - <терм1>"){
                        poliz.push("-");
                        toPoliz = true;
                    }
                    if (forInterest[j]["right"].join(" ") == "<выр> + <терм1>"){
                        poliz.push("+");
                        toPoliz = true;
                    }
                    if (forInterest[j]["right"].join(" ") == "<терм> * <множ>"){
                        poliz.push("*");
                        toPoliz = true;
                    }
                    if (forInterest[j]["right"].join(" ") == "<терм> / <множ>"){
                        poliz.push("/");
                        toPoliz = true;
                    }

                    if(idnConsFlag || toPoliz)
                        addRow(tblBody,i,printArray(stack),symbol,printArray(outputLaTable.slice(i)),poliz);
                    else
                        addRow(tblBody,i,printArray(stack),symbol,printArray(outputLaTable.slice(i)),"");//????????????

                    for (var k = stackLength; k >= startBasis; k--) {
                        stack.pop();
                        console.log("k ",k, printArray(stack));
                    }

                    stack.push({"value": forInterest[j].left, "row":outputLaTable[i].row });
                    // if(idnConsFlag || toPoliz)
                    //     addRow(tblBody,i,printArray(stack),symbol,printArray(outputLaTable.slice(i)),poliz.join(""));//????????????
                    // else
                    //     addRow(tblBody,i,printArray(stack),symbol,printArray(outputLaTable.slice(i)),"");//????????????
                    // tbl.appendChild(tblBody);

                    i--;
                    break;
                }
                if(j ==  forInterest.length - 1){
                    var div = document.getElementById('chainAnalysis');
                    div.appendChild(tbl);
                    tbl.setAttribute("border", "1");
                    $("#result").val($("#result").val()+"ПОМИЛКА: немає співпадінь в рядку "+outputLaTable[i].row);
                    console.log("ПОМИЛКА: немає співпадінь в в рядку ");
                    return;
                }
            }
        }
    }

console.log(poliz);
    var div = document.getElementById('chainAnalysis');
    div.appendChild(tbl);
    tbl.setAttribute("border", "1");

    return true;
}

function addRow(){
    var row = document.createElement("tr");

    for(var i = 1;i<arguments.length;i++){
        var cell = document.createElement("td");
        var cellText = document.createTextNode(arguments[i]);
        cell.appendChild(cellText);
        row.appendChild(cell);
    }
    arguments[0].appendChild(row);
}

function printArray(array){
    var temp = "";
    for (var i = 0; i < array.length; i++) {
        temp+= array[i].value+" ";
    }
    return temp;
}

function findStartBasic(tableArray,stack){
    for (var i = stack.length-1; i > 0; i--) {
        var row = findElementRow(tableArray, stack[i-1].value);
        var column = findElementColumn(tableArray, stack[i].value);
        var symbol;
        console.log("row ", row, stack[i-1].value);
        console.log("column ", column, stack[i].value);
        if(row == -1 && column == -1){
            console.log("-1 -1");
            console.log("include(idn, stack[i].value ", include(idn, stack[i].value));
            console.log("include(cons,  stack[i].value ", include(cons, stack[i].value));
            console.log("include(idn, stack[i-1].value", include(idn, stack[i-1].value));
            console.log("include(idn, stack[i-1].value ", include(cons, stack[i-1].value));
            if(include(idn, stack[i-1].value) && include(cons, stack[i].value)){
                symbol = tableArray[findElementRow(tableArray, "id")][findElementRow(tableArray, "cons")];
                console.log("ID and CONS");
            }else if(include(cons, stack[i-1].value) && include(ind, stack[i].value)){
                symbol = tableArray[findElementRow(tableArray, "cons")][findElementRow(tableArray, "id")];
                console.log("CONS and IDN");
            }
        }else if(row == -1 || column == -1){
            if(row == -1){
                if(include(idn,stack[i-1].value))
                    symbol = tableArray[findElementRow(tableArray, "id")][column];
                else if(include(cons, Number(stack[i-1].value)))
                    symbol = tableArray[findElementRow(tableArray, "cons")][column];
                else {
                    $("#result").val($("#result").val()+"ПОМИЛКА: немає співпадінь в рядку "+outputLaTable[i].row);
                    return;
                }
            }else if(column == -1){
                if(include(idn, stack[i].value))
                   symbol = tableArray[row][findElementColumn(tableArray, "id")];
               else if(include(cons, Number(stack[i].value)))
                   symbol = tableArray[row][findElementColumn(tableArray, "cons")];
               else{
                   $("#result").val($("#result").val()+"ПОМИЛКА: немає співпадінь в рядку "+outputLaTable[i].row);
                   return;
               }
           }else{
               $("#result").val($("#result").val()+"ПОМИЛКА: немає співпадінь в рядку "+outputLaTable[i].row);
               return;
           }
        }else{
            symbol = tableArray[row][column];
        }
        console.log("Symbol in start basis ", symbol);
        //знайшли відношення між останнім елементом стеку і outputLaTable[i]
        if(symbol=="<"){
            return i;
        }
    }
}
