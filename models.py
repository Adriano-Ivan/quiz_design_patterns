from enum import IntEnum
import json
from flask import jsonify


# DTO design pattern
class QuestionReadDTO(object):

    def __init__(self, id, quiz_id, question_content, answer_options, level, right_answer_id,
                 punctuation_for_right_answer):
        self.id = id
        self.quiz_id = quiz_id
        self.question_content = question_content
        self.answer_options = answer_options
        self.level = level
        self.right_answer_id = right_answer_id
        self.punctuation_for_right_answer = punctuation_for_right_answer

    def to_dict(self):
        return {
            "id": self.id,
            "quiz_id": self.quiz_id,
            "question_content": self.question_content,
            "answer_options": self.answer_options,
            "level": json.dumps(self.level),
            "right_answer_id": self.right_answer_id,
            "punctuation_for_right_answer": self.punctuation_for_right_answer
        }

class AnswerOptionReadDTO(object):

    def __init__(self, id, description,is_right_answer, question_id):
        self.id = id
        self.description = description
        self.is_right_answer = is_right_answer
        self.question_id = question_id

    def to_dict(self):
         return {
            "id": self.id,
            "description": self.description,
            "is_right_answer": self.is_right_answer,
            "question_id": self.question_id
         }
class QuestionReadContainerDTO(object):

    def __init__(self, next_question, question, next_question_exists,title_quiz):
        self.next_question = next_question
        self.question = question
        self.next_question_exists = next_question_exists
        self.title_quiz = title_quiz

    def to_dict(self):
        return {
            "next_question":  self.next_question if self.next_question != 0 else 1,
            "question": self.question.to_dict(),
            "next_question_exists": self.next_question_exists,
            "title_quiz": self.title_quiz
        }


class CorrectOptionDTO(object):

    def __init__(self, description, is_correct):
        self.is_correct = is_correct
        self.description = description

    def to_dict(self):
        return {
            "description": self.description,
            "is_correct": self.is_correct
        }

class Quiz:

    def __init__(self, id, title,  questions):
        self.id = id
        self.title = title
        self.questions = questions
        self.total_punctuation_after_end = None
        self.max_punctuation = None

    def return_question(self,current_question, current_question_to_search_after_this):
        current_question_to_send = self._return_question_based_on_parameter(current_question)

        question_dto = QuestionReadContainerDTO(
            current_question_to_search_after_this, current_question_to_send,
            self.question_exists(
                current_question_to_search_after_this if current_question is not None else 0), self.title
            )

        response = jsonify(question_dto.to_dict())

        return response

    def _return_question_based_on_parameter(self, nextQuestion):
        if(nextQuestion is not None and len(self.questions) > nextQuestion):
            return self.questions[nextQuestion]
        else:
            return self.questions[0]

    def is_marked_option_correct(self, question_id, option_id):
        for question in self.questions:
            for option in question.answer_options:
                if question.id == question_id and option.id == option_id and option.is_right_answer:
                    description = option.description
                    is_correct = True
                    return CorrectOptionDTO(description, is_correct).to_dict()

        return CorrectOptionDTO("", False).to_dict()

    def question_exists(self, question_index):
        return len(self.questions) > question_index >= 0


class Question(object):

    def __init__(self, id,quiz_id, level,question_content,answer_options):
        self.id = id
        self.quiz_id = quiz_id
        self.question_content=question_content
        self.level = level
        self.answer_options = answer_options
        self.right_answer_id = None
        self.punctuation_for_right_answer = None
        self.category_quiz = None

    def to_dict(self):
        return QuestionReadDTO(self.id, self.quiz_id, self.question_content,self.return_answer_options(),
                               self.level, self.right_answer_id, self.punctuation_for_right_answer).to_dict()

    def return_answer_options(self):
        answers = []

        for option in self.answer_options:
            answers.append(option.to_dict())

        return answers


class AnswerOption(object):

    def __init__(self, id,description, is_right_answer,question_id):
        self.id = id
        self.description = description
        self.is_right_answer = is_right_answer
        self.question_id = question_id

    def to_dict(self):
        return AnswerOptionReadDTO(self.id, self.description, self.is_right_answer, self.question_id).to_dict()


class Level(IntEnum):
    EASY = 1
    MEDIUM = 2
    DIFFICULT = 3
    SUPER_CHALLENGE = 4

class QuizTheme(IntEnum):
    GREEK_MITHOLOGY = 1
    LITERATURE = 2
    PROGRAMMING = 3