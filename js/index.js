$( document ).ready(function() {
    inputCode();
    generate_lexTable();
    generate_classTable();

    $("#submit").on( "click", function () {
        trans();
        printInd();
        printCons();
        if( $("#result").val() == ""){
            createSyntaxTable();
            createChainTable();
            if( $("#result").val() == "Successful"){
                var forPoliz = outputLaTable.map(function(name) {return name.value;});
                var forPoliz1 = forPoliz.slice(forPoliz.indexOf("begin")+1,forPoliz.length-1);
                allPoliz(forPoliz1);
                toDo();
            }
        }
        var lines = $('#poliz').val().split('\n');
        if(lines[0]==""){
            lines.splice(0, 1);
            $('#poliz').val(lines.join("\n"));
        }

    });
});
