from models import Quiz, Question, AnswerOption, Level
import json
from models import Level, QuizTheme

quiz_list = []

current_quiz = None

arq = open("source.json", "r", encoding="utf-8")
quiz_list_data = json.load(arq)

if len(quiz_list) == 0:
    for quiz in quiz_list_data:
        quiz_object = quiz

        quiz_id = quiz_object['id']
        quiz_title = quiz_object['title']
        quiz_questions = []

        category_quiz = None

        if quiz_object['category_quiz'] == 1:
            category_quiz = QuizTheme.GREEK_MITHOLOGY

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
        quiz_list.append(quiz_to_insert)


class QuizFactory:
    @staticmethod
    def return_quiz(type):
        quiz_to_choose = None
        for quiz in quiz_list:
            if quiz.category_quiz == type:
                quiz_to_choose = quiz
                break

        return quiz_to_choose


current_quiz = QuizFactory.return_quiz(QuizTheme.GREEK_MITHOLOGY)
