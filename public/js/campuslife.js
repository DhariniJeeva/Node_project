$(document).ready(function(){

      $('.liclass').on("click", function (e) {
        var link_name = $(e.target).text();
        var a = $(e.target).next().toggle();
      });

      $('.us_campus').fadeIn();
      $('#rit_us').on("click" , function(e){
        $('.us_campus').fadeIn();
        $('.croatia_campus').hide();
        $('.dubai_campus').hide();
        $(this).addClass("selectednav");
        $(this).siblings().removeClass("selectednav");

      });
      $('#rit_croatia').on("click" , function(e){
        $('.croatia_campus').fadeIn();
        $('.us_campus').hide();
        $('.dubai_campus').hide();
        $(this).addClass("selectednav");
        $(this).siblings().removeClass("selectednav");
      });
      $('#rit_dubai').on("click" , function(e){
        $('.dubai_campus').fadeIn();
        $('.croatia_campus').hide();
        $('.us_campus').hide();
        $(this).addClass("selectednav");
        $(this).siblings().removeClass("selectednav");
      });
    
 
            $("#essentialthings-btn").on("click", function(){
                $("#otherthings").css("display" , "none");
                $("#essentialthings").fadeIn();
            })
             $("#otherthings-btn").on("click", function(){
                 $("#essentialthings").css("display", "none");
                $("#otherthings").fadeIn();
                 
            })
            
       
});
