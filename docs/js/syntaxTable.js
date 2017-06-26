var allItems = new Array();
var leftPart = new Array();
var rightPart = new Array();

var toObject = new Array();
var tableArray;
var forInterest;

var source =
`<программа> ::= program id var <сп.объяв1> begin <сп.опер1> end
<сп.объяв1> ::= <сп.объяв>
<сп.объяв> ::= <объяв>
<сп.объяв> ::= <сп.объяв> ; <объяв>
<объяв> ::= <сп.ид1> : integer
<сп.ид1> ::= <сп.ид>
<сп.ид> ::= , id
<сп.ид> ::= <сп.ид> , id
<сп.опер1> ::= <сп.опер>
<сп.опер> ::= <опер>
<сп.опер> ::= <сп.опер> ; <опер>
<опер> ::= id := <выр1>
<опер> ::= read ( <сп.ид1> )
<опер> ::= write ( <сп.ид1> )
<опер> ::= do while <ЛВ1> <сп.опер1> enddo
<опер> ::= if <ЛВ1> <сп.опер1> else <сп.опер1> endif
<выр1> ::= <выр>
<выр> ::= <терм1>
<выр> ::= <выр> + <терм1>
<выр> ::= <выр> - <терм1>
<выр> ::= - <терм1>
<терм1> ::= <терм>
<терм> ::= <множ1>
<терм> ::= <терм> * <множ1>
<терм> ::= <терм> / <множ1>
<множ1> ::= <множ>
<множ> ::= <перв.выр>
<множ> ::= <множ> ^ <перв.выр>
<перв.выр> ::= ( <выр1> )
<перв.выр> ::= id
<перв.выр> ::= cons
<ЛВ1> ::= <ЛВ>
<ЛВ> ::= <ЛТ1>
<ЛВ> ::= <ЛВ> or <ЛТ1>
<ЛТ1> ::= <ЛТ>
<ЛТ> ::= <ЛМ1>
<ЛТ> ::= <ЛТ> and <ЛМ1>
<ЛМ1> ::= <ЛМ>
<ЛМ> ::= <отнош>
<ЛМ> ::= [ <ЛВ1> ]
<ЛМ> ::= not <ЛМ>
<отнош> ::= <выр1> < <выр1>
<отнош> ::= <выр1> <= <выр1>
<отнош> ::= <выр1> > <выр1>
<отнош> ::= <выр1> >= <выр1>
<отнош> ::= <выр1> == <выр1>
<отнош> ::= <выр1> != <выр1>`;

var strings;

function createSyntaxTable(strings){
    strings = source.split("\n");

    $.each(strings,function(index,value){
        var substr = value.substr(-value.length,value.indexOf("::=")-1).split(" ");//записываем все левые части в массив
        if(leftPart.indexOf(substr[0])==-1)
            leftPart.push(substr[0]);

        var left = substr[0];

        var right = new Array();
        substr = value.substr(value.indexOf("::=")+4).split(" ");//записываем все правые части в массив
        $.each(substr,function(index1,value1){
            if(rightPart.indexOf(value1) == -1){
                rightPart.push(value1);
            }
            right.push(value1);
        });

        toObject[toObject.length] = {"left": left, "right":right};//записываем попарно, по сути стрингс в массив обьектов
    });

    tableArray = new Array(rightPart.length+1);

    for (var i = 0; i < rightPart.length+3; i++) {
        tableArray[i] = new Array(rightPart.length+3);
        tableArray[i][rightPart.length+1] = ">";
        if (i == 0){
            tableArray[i][i]= "";
            tableArray[i][rightPart.length+1]= "#";
        }
        else if(i == rightPart.length+1){
            for (var j = 0; j < rightPart.length+3; j++) {
                if(j==0)
                    tableArray[i][j] = "#";
                else if(j ==(rightPart.length+1))
                    tableArray[i][j] = "";
                else
                    tableArray[i][j] = "<";
            }
        }else{
            tableArray[0][i] = rightPart[i-1];
            tableArray[i][0] = rightPart[i-1];
        }
    }

    var equals = new Array();//записываем все пары, которые равны
    $.each(strings,function(index,value){
        substr = value.substr(value.indexOf("::=")+4).split(" ");
        for (var i = 0; i < substr.length-1; i++) {
            var temp = 0;
            for (var j = 0; j < equals.length; j++) {
                if(equals[j]["left"] == substr[i] && equals[j]["right"] ==  substr[i+1]){
                    temp = 1;
                    break;
                }
            }
            if(temp == 0)
                equals.push({"left":substr[i], "right":substr[i+1]});

        }
    });


    $.each(equals,function(index,value){
        tableArray[findElementRow(tableArray,value["left"])][findElementColumn(tableArray,value["right"])] = "=";
    });

    $.each(equals,function(index,value){
        firstPlus(value.left,value.right);
    });

    forInterest = toObject.slice();
    var lastProto = new Array({"left":"", "right":""});
    forLast(toObject);


    $.each(equals,function(index,value){
        lastPlus(value.left,value.right, toObject);
    });

    var temp = tableArray.length - 1;
    var tbdy = document.createElement('tbody');
    for (var i = 0; i < temp; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j<temp; j++) {
            var td = document.createElement('td');
            if(tableArray[i][j] == undefined)
                td.appendChild(document.createTextNode(" "));
            else {
                td.appendChild(document.createTextNode(tableArray[i][j]));
            }
            tr.appendChild(td);
        }
        tbdy.appendChild(tr);
    }
    document.getElementById('syntaxTable').appendChild(tbdy);

}

function firstPlus(left, right){
    var isInLeft = leftPart.indexOf(right);
    if( isInLeft != -1){
        for (var i = 0; i < toObject.length; i++) {
            if (toObject[i]["left"] == right && toObject[i]["left"]!=toObject[i]["right"][0]){
                    tableArray[findElementRow(tableArray,left)][findElementColumn(tableArray,toObject[i]["right"][0])]="<";
                    firstPlus(left,toObject[i]["right"][0]);
                }
        }
    }
}

function lastPlus(left, right,toObject){
    if( leftPart.indexOf(left) != -1){
        for (var i = 0; i < toObject.length; i++) {
            if (toObject[i]["left"] == left ){
                    if(leftPart.indexOf(right)!=-1){
                        var allOfThem = new Array();
                        getFirstFor2(right,allOfThem);
                        $.each(allOfThem,function(index,value){
                            tableArray[findElementRow(tableArray,toObject[i]["right"][toObject[i]["right"].length-1])][findElementColumn(tableArray,value)]=">";
                        });
                    }else{
                        tableArray[findElementRow(tableArray,toObject[i]["right"][toObject[i]["right"].length-1])][findElementColumn(tableArray,right)]=">";
                    }
                    lastPlus(toObject[i]["right"][toObject[i]["right"].length-1],right,toObject);
                }
        }
    }
}

function getFirstFor2(element,allOfThem){
    for (var i = 0; i < forInterest.length; i++) {
        if (forInterest[i]["left"] == element && forInterest[i]["left"]!=forInterest[i]["right"][0]){
            allOfThem.push(forInterest[i]["right"][0]);
            if(leftPart.indexOf(forInterest[i]["right"][0]) != -1)
                getFirstFor2(forInterest[i]["right"][0],allOfThem);
        }
    }
}

function forLast(toObject){
    var size = toObject.length;
    var counter = 0;
    while(counter < size){
        if(toObject[counter]["left"]== toObject[counter]["right"][toObject[counter]["right"].length-1]){
            toObject.splice(counter, 1);
            size = toObject.length;
        }else{
            var counter1 = 0;
            while(counter1 < size){
                if(toObject[counter]["left"] == toObject[counter1]["left"] &&
                toObject[counter]["right"][toObject[counter]["right"].length-1] == toObject[counter1]["right"][toObject[counter1]["right"].length-1] && counter!=counter1){
                    toObject.splice(counter1, 1);
                    size = toObject.length;
                }else
                    counter1++;
            }
            counter++;
        }
    }
}

function findElementRow(array, element){
    for (var i = 0; i < array.length; i++) {
        if(array[i][0]==element)
            return i;
    }
    return -1;
}

function findElementColumn(array, element){
    for (var i = 0; i < array.length; i++) {
        if(array[0][i]==element)
        return i;
    }
    return -1;
}
