var lex = ['','program', 'var', 'begin', 'end','integer','read','write','do', 'while','enddo','if','else','endif','/',';',':',',',':=','+','-',"^",
'*','(',')','or', 'and','not','!=','<','>','<=','>=','==','[',']','idn','con'];

var letterClass = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var numberClass = ['1','2','3','4','5','6','7','8','9','0'];
var opo = ['(',')','[',']','+','-','*','/',';',',',"^"];
var more = '>', less = '<', equal = '=', colon = ':', exclamation = '!';


var idn = [], cons = [];
var temp;
counter = 0;

var classTabl = {
  'a-z':'Б',
  '0-9':'Ц',
  '()[]+-*/;,':'ОРО',
  '>':'>',
  '<':'<',
  '=':'=',
  ':':':',
  '!':'!'
};

var outputLaTable = [];

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

function generate_lexTable() {
  var tbl     = document.createElement("table");
  var tblBody = document.createElement("tbody");
  addRow(tblBody,"Таблица лексем" );
  for (var i =1; i < lex.length; i++) {
      addRow(tblBody,i,lex[i]);
  }
  tbl.appendChild(tblBody);

  var div = document.getElementById('lexTable');
  div.appendChild(tbl);
  tbl.setAttribute("border", "1");
}

function generate_classTable(){
  var tbl2     = document.createElement("table");
  var tblBody2 = document.createElement("tbody");

  var row = document.createElement("tr");
  var cellText = document.createTextNode("Таблица классов символов");
  row.appendChild(cellText);
  tblBody2.appendChild(row);

  for (key in classTabl) {
      addRow(tblBody2,key,classTabl[key]);
  }

  tbl2.appendChild(tblBody2);

  var div = document.getElementById('lexTable');
  div.appendChild(tbl2);
  tbl2.setAttribute("border", "1");
}

function trans(){
    outputLaTable = [];
    idn = []; cons = [];

  var myNode = document.getElementById("lexicalRes");
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }

  var lexicalRes     = document.createElement("table");
  var tblBody = document.createElement("tbody");

  addRow(tblBody,"№ строки","подстрока","код","индекс");

  var text = document.getElementById("inputCode").value;
  var out = document.getElementById("result");
  var result = "";
  out.value = result;
  var rowCounter = 1;

  var i = 0;
  var len = text.length;
  console.log("len",len);
  var fl_begin = false;
  while(i<len) {
      var buffer = "";

      if(text[i]=="\t"){
        i++;
        continue;
      }
      if(text[i]==" "){
        i++;
        continue;
      }

      if(text[i]=="\n"){
        rowCounter++;
        i++;
        continue;
      }

      if(include(letterClass,text[i])){
        buffer += text[i];
        while((include(letterClass,text[i+1]) || include(numberClass,text[i+1])) && (i+1)<len){
          buffer += text[++i];
        }
        i++;
        var res;

        if(fl_begin){
            if(include(lex,buffer)){
                temp = numbOfLex(buffer);
            }else if(include(idn,buffer)){
                temp = numbOfLex("idn");
            }else {
              result += "Error in line "+rowCounter+"! No such idn \""+buffer +"\" in table of idn\n";
              continue;
            }
        }else{
          if(buffer=="begin")
          fl_begin = true;
          if(include(lex,buffer))
            temp = numbOfLex(buffer)
          else {
              temp = numbOfLex("idn");
              if(!include(idn,buffer)){
                idn.push(buffer);
              }
            }
        }

        var index = numbOfIdn(buffer);
        if(index!=0)
            addRow(tblBody,rowCounter,buffer,temp,index);
        else {
                addRow(tblBody,rowCounter,buffer,temp,"");
            }

        outputLaTable.push({row:rowCounter,value:buffer});
        continue;
      }

      if (include(numberClass,text[i])){
        buffer += text[i];
        while(include(numberClass,text[i+1]) && (i+1)<len){
          buffer += text[++i];
        }
        i++;

        if(!include(cons,Number(buffer))){
        //   cons.push(buffer);
        cons.push(Number(buffer));
        }
        var index = cons.indexOf(buffer)+1;
        if(index!=0)
            addRow(tblBody,rowCounter,buffer,numbOfLex("con"),index);
        else {
                addRow(tblBody,rowCounter,buffer,numbOfLex("con"),"");
            }
        outputLaTable.push({row:rowCounter,value:buffer});
        continue;
      }

      if (include(opo,text[i])){
        console.log("include opo", i)

        addRow(tblBody,rowCounter,text[i],numbOfLex(text[i]),"");
        outputLaTable.push({row:rowCounter,value:text[i]});
        i++;
        continue;
      }

      if (text[i]==more){
        buffer=more;
        if(text[i+1]=="="){
          buffer += "=";
          i++;
        }
        i++;

        addRow(tblBody,rowCounter,buffer,numbOfLex(buffer),"");

        outputLaTable.push({row:rowCounter,value:buffer});
        continue;
      }

      if (text[i]==less){
        buffer=less;
        if(text[i+1]=="="){
          buffer += "=";
          i++;
        }
        i++;

        addRow(tblBody,rowCounter,buffer,numbOfLex(buffer),"");
        outputLaTable.push({row:rowCounter,value:buffer});
        continue;
      }

      if (text[i]==equal){
        buffer=equal;
        if(text[i+1]=="="){
          buffer += "=";
          i++;
        }
        else{
          result += "Error in line "+rowCounter+"! No such symbol \""+buffer +"\" in table of lex\n";
          i++;
          continue;
      }
        i++;

        addRow(tblBody,rowCounter,buffer,numbOfLex(buffer),"");
        outputLaTable.push({row:rowCounter,value:buffer});
        continue;
      }

      if (text[i]==colon){
        buffer=colon;
        if(text[i+1]=="="){
          buffer += "=";
          i++;
        }
        i++;
        addRow(tblBody,rowCounter,buffer,numbOfLex(buffer),"");
        outputLaTable.push({row:rowCounter,value:buffer});
        continue;
      }

      if (text[i]==exclamation){
        buffer=exclamation;
        if(text[i+1]=="="){
          buffer += "=";
          i++;
        }
        else{
          result += "Error in line "+rowCounter+"! No such symbol \""+buffer +"\" in table of lex\n";
          i++;continue;
        }
        i++;
        addRow(tblBody,rowCounter,buffer,numbOfLex(buffer),"");
        outputLaTable.push({row:rowCounter,value:buffer});
        continue;
      }

      result += "Error in line "+rowCounter+"! No such symbol \""+text[i] +"\" in table of lex\n";
      i++;
  }
  console.log(rowCounter);
  console.log("outputLaTable", outputLaTable);
  out.value = result;
  lexicalRes.appendChild(tblBody);
  lexicalRes.setAttribute("border", "1");
  var div = document.getElementById('lexicalRes');
  div.appendChild(lexicalRes);
}

function numbOfLex(text){
  for (var i = 0; i < lex.length; i++) {
    if (lex[i]==text)
    return (i);
  }
  return 0;
}

function numbOfIdn(text){
  for (var i = 0; i < idn.length; i++) {
    if (idn[i]==text)
    return (i+1);
  }
  return 0;
}

function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}

function printInd(){
  var indTable     = document.createElement("table");
  var tblBody = document.createElement("tbody");
  var row = document.createElement("tr");
  var cellText = document.createTextNode("Таблица idn");
  row.appendChild(cellText);
  tblBody.appendChild(row);

  for (var i = 0; i < idn.length; i++) {
    addRow(tblBody,idn[i],i+1);
  }

  indTable.appendChild(tblBody);
  indTable.setAttribute("border", "1");
  var div = document.getElementById('lexicalRes');
  div.appendChild(indTable);
}

function printCons(){
  var indTable     = document.createElement("table");
  var tblBody = document.createElement("tbody");
  var row = document.createElement("tr");
  var cellText = document.createTextNode("Таблица cons");
  row.appendChild(cellText);
  tblBody.appendChild(row);

  for (var i = 0; i < cons.length; i++) {
    addRow(tblBody,cons[i],i+1);
  }
  indTable.appendChild(tblBody);
  indTable.setAttribute("border", "1");
  var div = document.getElementById('lexicalRes');
  div.appendChild(indTable);

}
