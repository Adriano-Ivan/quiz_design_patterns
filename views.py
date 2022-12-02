from flask import render_template, request
from models import QuizTheme
from data import current_quiz, change_quiz_with_new_type
from app import app
from flask import jsonify
from services import return_question_service

quiz_default_theme = QuizTheme.GREEK_MITHOLOGY

@app.route("/")
def index():
    return render_template("quiz.html")


@app.route("/previous_question", methods=["POST"])
def previous_question():
    next_question_req = int(request.form["previous_question"])
    current_question = next_question_req - 2 if current_quiz().question_exists(next_question_req - 1) else 0

    return return_question_service(current_question, next_question_req - 1)


@app.route("/next_question", methods=["POST"])
def next_question():
    next_question_req = int(request.form["next_question"])
    current_question = next_question_req if current_quiz().question_exists(next_question_req) else 0

    return return_question_service(current_question, current_question+1)

@app.route("/change_quiz",methods=["POST"])
def change_quiz():
    new_quiz_type = request.form['quiz_type']
    new_quiz = change_quiz_with_new_type(new_quiz_type)

    global quiz_default_theme

    quiz_default_theme= new_quiz

    return jsonify({"type": new_quiz})

@app.route("/verify_answer", methods=["POST"])
def verify_answer():
    question_id = int(request.form['question_id'])
    option_id = int(request.form['option_id'])
    is_correct = False
    description = ""

    for question in current_quiz().questions:
        for option in question.answer_options:
            if question.id == question_id and option.id == option_id:
                description = option.description

            if question.id == question_id and option.id == option_id and option.is_right_answer:
                is_correct = True
                break

    return jsonify({"is_correct": is_correct, "description": description})

@app.route("/number_of_questions",methods=["GET"])
def return_number_of_questions():
    return jsonify(len(current_quiz().questions))

@app.route("/list_quizes", methods=["GET"])
def return_quiz_types():
    return jsonify({"types": [member.name for member in QuizTheme]})
