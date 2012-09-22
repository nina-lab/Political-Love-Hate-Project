function main(d) {

    var render = function (data) {
        data.ObamaTotal = parseInt(data.ObamaLove, 10) + parseInt(data.ObamaHate, 10) + "";      
        data.RomneyTotal = parseInt(data.RomneyLove,10) + parseInt(data.RomneyHate,10) + "";
        data.totalHate = parseInt(data.ObamaHate,10) + parseInt(data.RomneyHate,10) + "";
        data.totalLove = parseInt(data.ObamaLove,10) + parseInt(data.RomneyLove,10) + "";
        data.tweetsTotal = parseInt(data.ObamaTotal,10) + parseInt(data.RomneyTotal,10) + "";
            

        $(".bar").each(function (){
            var thisBar  = $(this).attr("id");
            var toPrint  = data[thisBar]; // THERE'S OFTEN NOT ROOM TO DISPLAY: " + thisBar.match(/love|hate/i);
            var maxWidth = $(".max-bar-width").width();
            var barWidth = data[thisBar] * maxWidth / data.tweetsTotal;
            
            $("#" + thisBar).css("width", barWidth).html(toPrint);
        });
        
    };

    render(d);
}

