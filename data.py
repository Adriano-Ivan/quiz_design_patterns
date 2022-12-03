from models import Quiz, Question, AnswerOption, QuizTheme
import json
from models import Level, QuizTheme

current_type = QuizTheme.GREEK_MITHOLOGY
current_quiz_obj = None

# Singleton pattern
class QuizDataAccessor:

    _instance = None
    _quiz_list = []

    def __init__(self):
        print(f'Object {id(self)} was created')

    def __new__(cls):

        if cls._instance is None :
            cls._instance = super().__new__(cls)
            cls._define_data(cls)

        return cls._instance

    def _define_data(cls):

        arq = open("source.json", "r", encoding="utf-8")
        quiz_list_data = json.load(arq)

        if len(cls._quiz_list) == 0:
            for quiz in quiz_list_data:
                quiz_object = quiz

                quiz_id = quiz_object['id']
                quiz_title = quiz_object['title']
                quiz_questions = []

                category_quiz = None

                if quiz_object['category_quiz'] == 1:
                    category_quiz = QuizTheme.GREEK_MITHOLOGY

                if quiz_object['category_quiz'] == 2:
                    category_quiz = QuizTheme.LITERATURE

                for question in quiz_object['questions']:
                    question_id = question['id']
                    question_quiz_id = question['quiz_id']
                    question_content = question['question_content']

                    question_level = None
                    question_level_int = question['level']
                    question_answer_options = []

                    if question_level_int == 1:
                        question_level = Level.EASY
                    elif question_level_int == 2:
                        question_level = Level.MEDIUM
                    elif question_level_int == 3:
                        question_level = Level.DIFFICULT
                    elif question_level_int == 4:
                        question_level = Level.SUPER_CHALLENGE

                    for answer_option in question['answer_options']:
                        answer_option_to_insert = AnswerOption(
                            answer_option["id"], answer_option["description"],
                            answer_option["is_right_answer"], answer_option["question_id"]
                        )

                        question_answer_options.append(answer_option_to_insert)

                    question_to_insert = Question(question_id, question_quiz_id,
                                                  question_level, question_content, question_answer_options)

                    quiz_questions.append(question_to_insert)

                quiz_to_insert = Quiz(quiz_id, quiz_title, quiz_questions)
                quiz_to_insert.category_quiz = category_quiz
                cls._quiz_list.append(quiz_to_insert)

    def get_data(cls):
        return cls._quiz_list


# Factory pattern
class QuizFactory:
    @staticmethod
    def return_quiz(type_quiz):
        quiz_to_choose = None
        quiz_data_accessor = QuizDataAccessor()

        for quiz in quiz_data_accessor.get_data():
            if quiz.category_quiz == type_quiz:
                quiz_to_choose = quiz
                break

        return quiz_to_choose


def change_quiz_with_new_type(received_type):
    for member in QuizTheme:
        if member.name == received_type:
            new_theme = QuizTheme[received_type]
            global current_quiz_obj
            current_quiz_obj = QuizFactory.return_quiz(new_theme)

            global current_type
            current_type = new_theme

            return new_theme

    return None


def current_quiz():
    global current_quiz_obj
    current_quiz_to_define = QuizFactory.return_quiz(current_type
                                                     if current_type is not None else QuizTheme.GREEK_MITHOLOGY )

    if current_quiz_to_define is not None:
        current_quiz_obj = current_quiz_to_define

    return current_quiz_obj

