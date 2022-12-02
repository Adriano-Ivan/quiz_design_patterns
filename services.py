from data import current_quiz
from flask import jsonify


def return_question_service(current_question, current_question_to_search_after_this):
    current_question_to_send = current_quiz().return_question(current_question)

    object_to_jsonify = {
        "next_question": current_question_to_search_after_this if current_question_to_search_after_this != 0 else 1,
        "question": current_question_to_send.to_dict(),
        "next_question_exists": current_quiz().question_exists(current_question_to_search_after_this if current_question is not None else 0)
    }

    response = jsonify(object_to_jsonify)

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')

    return response

