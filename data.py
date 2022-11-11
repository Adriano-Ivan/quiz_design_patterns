from models import Quiz, Question, AnswerOption, Level
import json

data = json.load(open('source.json'))

for d in data:
    print(d['questions'])

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


# QUIZ 1

questions = [question1, question2]
quiz1 = Quiz(1, "Mitologia grega", questions)
