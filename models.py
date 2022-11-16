from enum import Enum

class Quiz():

    def __init__(self,id,title,  questions):
        self.id = id
        self.title = title
        self.questions = questions
        self.total_pontuation_after_end = None
        self.max_pontation = None

    def return_question(self,nextQuestion):
        if(nextQuestion is not None and len(self.questions) > nextQuestion):
            return self.questions[nextQuestion]
        else:
            return self.questions[0]

    def next_question_exists(self, nextQuestion):
        return len(self.questions) > nextQuestion


class Question():

    def __init__(self, id,quiz_id, level,question_content,answer_options):
        self.id = id
        self.quiz_id = quiz_id
        self.question_content=question_content
        self.level = level
        self.answer_options = answer_options
        self.right_answer_id = None
        self.pontuation_for_right_answer = None

class AnswerOption():

    def __init__(self, id,description, is_right_answer,question_id):
        self.id = id
        self.description= description
        self.is_right_answer = is_right_answer
        self.question_id = question_id


class Level(Enum):
    EASY = 1
    MEDIUM = 2
    DIFFICULT = 3
    SUPER_CHALLENGE = 4
