from flask import Flask
from flask import render_template,redirect,request,url_for
from data import quiz1
from app import app
from flask import jsonify

@app.route("/")
def index():
    current_question = request.args.get('current_question')

    if current_question:
        current_question = int(current_question)

    return render_template("quiz.html",question = quiz1.return_question(current_question),
                           next_question_exists=quiz1.next_question_exists(current_question+1 if current_question is not None else 0),
                           current_question = current_question if current_question is not None else 0)

@app.route("/next/<int:current_question>")
def next(current_question):
    return redirect(url_for("index",
                            current_question=current_question+1
                            if quiz1.next_question_exists(current_question+1) else 0))

@app.route("/previous/<int:current_question>")
def previous(current_question):
    return redirect(url_for("index",current_question=current_question-1 if current_question -1 >= 0 else 0))


@app.route("/verify_answer", methods=["POST"])
def verify_answer():
    question_id = int(request.form['question_id'])
    option_id = int(request.form['option_id'])
    is_correct = False

    print(question_id)
    print(option_id)

    for question in quiz1.questions:
        for option in question.answer_options:
            if question.id == question_id and option.id == option_id and option.is_right_answer:
                is_correct = True
                break

    return jsonify(is_correct)

