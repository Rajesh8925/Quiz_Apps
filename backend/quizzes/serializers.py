from rest_framework import serializers
from .models import Quiz, Question, Answer, QuizAttempt, UserAnswer


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'order']


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'order', 'answers']


class QuestionWithCorrectSerializer(serializers.ModelSerializer):
    answers = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'text', 'order', 'answers']

    def get_answers(self, obj):
        return [
            {
                'id': answer.id,
                'text': answer.text,
                'order': answer.order,
                'is_correct': answer.is_correct
            }
            for answer in obj.answers.all()
        ]


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'topic', 'difficulty', 'num_questions', 'created_at']


class QuizDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'topic', 'difficulty', 'num_questions', 'created_at', 'questions']


class QuizWithAnswersSerializer(serializers.ModelSerializer):
    questions = QuestionWithCorrectSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'topic', 'difficulty', 'num_questions', 'created_at', 'questions']


class CreateQuizSerializer(serializers.Serializer):
    topic = serializers.CharField(max_length=200)
    num_questions = serializers.IntegerField(min_value=5, max_value=20)
    difficulty = serializers.ChoiceField(choices=['easy', 'medium', 'hard'])


class SubmitAnswerSerializer(serializers.Serializer):
    question_id = serializers.UUIDField()
    answer_id = serializers.UUIDField()


class SubmitQuizSerializer(serializers.Serializer):
    answers = SubmitAnswerSerializer(many=True)


class UserAnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.text', read_only=True)
    selected_answer_text = serializers.CharField(source='selected_answer.text', read_only=True)
    correct_answer_text = serializers.SerializerMethodField()

    class Meta:
        model = UserAnswer
        fields = ['question_text', 'selected_answer_text', 'correct_answer_text', 'is_correct']

    def get_correct_answer_text(self, obj):
        correct = obj.question.answers.filter(is_correct=True).first()
        return correct.text if correct else None


class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    percentage = serializers.FloatField(read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz_title', 'score', 'total_questions', 'percentage', 'completed_at']


class QuizAttemptDetailSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    quiz_topic = serializers.CharField(source='quiz.topic', read_only=True)
    percentage = serializers.FloatField(read_only=True)
    user_answers = UserAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz_title', 'quiz_topic', 'score', 'total_questions', 'percentage', 'completed_at', 'user_answers']
