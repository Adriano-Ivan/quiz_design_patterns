from flask import Flask
from flask import render_template,redirect,request,url_for
from data import quiz1
from app import app

@app.route("/")
def index():
    current_question = request.args.get('current_question')

    if current_question:
        current_question = int(current_question)

    return render_template("quiz.html",question = quiz1.returnQuestion(current_question),
                           current_question = current_question if current_question is not None else 0)

@app.route("/next/<int:current_question>")
def next(current_question):
    return redirect(url_for("index",
                            current_question=current_question+1
                            if quiz1.nextQuestionExists(current_question+1) else 0))

@app.route("/previous/<int:current_question>")
def previous(current_question):
    return redirect(url_for("index",question=current_question-1 if current_question -1 >= 0 else 0))


@app.route("/verify_answer", methods=["POST"])
def verify_answer():
    question_id = int(request.form['question_id'])
    option_id = int(request.form['option_id'])

    print(question_id)
    print(option_id)

    for question in quiz1.questions:
        for option in question.answer_options:
            if question.id == question_id and option.id == option_id and option.is_right_answer:
                print('YEAH')


    return f"{question_id},{option_id}"
