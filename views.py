from flask import render_template, request
from data import current_quiz
from app import app
from flask import jsonify
from services import return_question_service


@app.route("/")
def index():
    return render_template("quiz.html")


@app.route("/previous_question", methods=["POST"])
def previous_question():
    next_question_req = int(request.form["previous_question"])
    current_question = next_question_req - 2 if current_quiz.question_exists(next_question_req - 1) else 0

    print(current_question)
    return return_question_service(current_question, next_question_req - 1)


@app.route("/next_question", methods=["POST"])
def next_question():
    next_question_req = int(request.form["next_question"])
    current_question = next_question_req if current_quiz.question_exists(next_question_req) else 0

    return return_question_service(current_question, current_question+1)


@app.route("/verify_answer", methods=["POST"])
def verify_answer():
    question_id = int(request.form['question_id'])
    option_id = int(request.form['option_id'])
    is_correct = False

    for question in current_quiz.questions:
        for option in question.answer_options:
            if question.id == question_id and option.id == option_id and option.is_right_answer:
                is_correct = True
                break

    return jsonify(is_correct)
