from models import Quiz, Question, AnswerOption, Level
import json

# QUESTION 1
answer_option1_question1 = AnswerOption(1, "Carambola", False, 20)
answer_option2_question1 = AnswerOption(2, "Amoras", False, 20)
answer_option3_question1= AnswerOption(3, "Uvas", True, 20)

answer_options_question1 = [answer_option3_question1, answer_option2_question1,answer_option1_question1]

question1 = Question(20, 1, Level.MEDIUM,"Qual a fruta de Dionísio ?",answer_options_question1)

# QUESTION 2
answer_option1_question2 = AnswerOption(4, "Dionísio", False, 21)
answer_option2_question2 = AnswerOption(5, "Apolo", False, 21)
answer_option3_question2= AnswerOption(6, "Hermes", True, 21)

answer_options_question2 = [answer_option1_question2,answer_option2_question2,answer_option3_question2]

question2=Question(21, 1, Level.MEDIUM,
                   "Qual é o deus patrono das artes, diplomacia, comércio e medicina ?",
                   answer_options_question2)

# QUESTION 3
answer_option1_question3 = AnswerOption(7, "Ártemis", False, 22)
answer_option2_question3 = AnswerOption(8, "Apolo", False, 22)
answer_option3_question3= AnswerOption(9, "Ares", True, 22)

answer_options_question2 = [answer_option1_question3,answer_option2_question3,answer_option3_question3]

question3=Question(22, 1, Level.MEDIUM,
                   "Qual é a divindade relacionanda à música ?",
                   answer_options_question2)

# QUIZ 1

questions = [question1, question2,question3]
quiz1 = Quiz(1, "Mitologia grega", questions)
