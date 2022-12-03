from data import current_quiz
from flask import jsonify
from data import current_quiz


def return_question_service(current_question, current_question_to_search_after_this):
    response = current_quiz().return_question(current_question,current_question_to_search_after_this)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')

    return response

