$(function(){
    $("li.question_answer_option").on("click", function(e){
        e.preventDefault();

        console.log(e);
        console.log(`target id: ${e.target.id}`)

        const question_id = e.target.id.split("_")[0]
        const option_id = e.target.id.split("_")[1]

        var verify = $.post("/verify_answer", {"question_id": question_id, "option_id":option_id});

        verify.done(function(data){
            console.log(data);
        });
    })
})