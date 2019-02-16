$(document).ready(function(){
    $('.delete-sport').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');

        $.ajax({
            type:'DELETE',
            url: '/sports/'+id,
            success: function(response){
                alert('Deleting Sport');
                window.location.href='/sportovi';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

$(document).ready(function(){
    $('.delete-league').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');

        $.ajax({
            type:'DELETE',
            url: '/leagues/'+id,
            success: function(response){
                alert('Deleting League');
                window.location.href='/lige';
            },
            error: function(err){
                console.log(err);
            } 
        });
    });
});

$(document).ready(function(){
    $('.delete-club').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');

        $.ajax({
            type:'DELETE',
            url: '/clubs/'+id,
            success: function(response){
                alert('Deleting Club');
                window.location.href='/klubovi';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

$(document).ready(function(){
    $('.delete-match').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url: '/matches/'+id,
            success: function(response){
                alert('Deleting Match');
                window.location.href='/mecevi';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

function getSelectValue(){
    var selectedValue = document.getElementById("chooseSportInClub").value;
    document.getElementById("id").innerHTML = selectedValue; 
    return selectedValue;
}