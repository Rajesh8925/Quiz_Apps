from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
import requests
import json
import os
from .models import Quiz, Question, Answer, QuizAttempt, UserAnswer
from .serializers import (
    QuizSerializer, QuizDetailSerializer, CreateQuizSerializer,
    SubmitQuizSerializer, QuizAttemptSerializer, QuizAttemptDetailSerializer,
    QuizWithAnswersSerializer
)


class GeminiAIClient:
    API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyCepux-RZyzREg8NHWFBWPZGARXrpTolYI')

    API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

    @classmethod
    def generate_quiz(cls, topic, num_questions, difficulty):
        if not cls.API_KEY:
            raise Exception('Gemini API key not configured')

        prompt = f"""Generate a {difficulty} difficulty quiz about '{topic}' with {num_questions} multiple-choice questions.

For each question, provide:
1. The question text
2. 4 answer options (A, B, C, D)
3. The correct answer (indicated by letter)

Return ONLY valid JSON in this exact format:
{{
  "title": "Quiz Title",
  "questions": [
    {{
      "text": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }}
  ]
}}

The "correct" field should be 0-3 indicating the index of the correct answer.
Generate exactly {num_questions} questions."""

        try:
            response = requests.post(
                f'{cls.API_URL}?key={cls.API_KEY}',
                json={
                    'contents': [{
                        'parts': [{'text': prompt}]
                    }],
                    'generationConfig': {
                        'temperature': 0.7,
                        'maxOutputTokens': 4000
                    }
                },
                timeout=60
            )
            response.raise_for_status()
            data = response.json()

            text_response = data['candidates'][0]['content']['parts'][0]['text']
            
            # Extract JSON from response (handling markdown code blocks)
            json_str = text_response
            if '```json' in text_response:
                json_str = text_response.split('```json')[1].split('```')[0].strip()
            elif '```' in text_response:
                json_str = text_response.split('```')[1].split('```')[0].strip()

            return json.loads(json_str)

        except requests.exceptions.RequestException as e:
            raise Exception(f'AI service error: {str(e)}')
        except (json.JSONDecodeError, KeyError, IndexError) as e:
            raise Exception(f'Failed to parse AI response: {str(e)}')


class GenerateQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateQuizSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        topic = serializer.validated_data['topic']
        num_questions = serializer.validated_data['num_questions']
        difficulty = serializer.validated_data['difficulty']

        try:
            ai_response = GeminiAIClient.generate_quiz(topic, num_questions, difficulty)

            with transaction.atomic():
                quiz = Quiz.objects.create(
                    user=request.user,
                    title=ai_response['title'],
                    topic=topic,
                    difficulty=difficulty,
                    num_questions=num_questions
                )

                for i, q_data in enumerate(ai_response['questions']):
                    question = Question.objects.create(
                        quiz=quiz,
                        text=q_data['text'],
                        order=i + 1
                    )

                    for j, option_text in enumerate(q_data['options']):
                        Answer.objects.create(
                            question=question,
                            text=option_text,
                            is_correct=(j == q_data['correct']),
                            order=j + 1
                        )

            return Response(QuizSerializer(quiz).data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class QuizListView(generics.ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.filter(user=self.request.user)


class QuizDetailView(generics.RetrieveAPIView):
    serializer_class = QuizDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return Quiz.objects.filter(user=self.request.user)


class SubmitQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        print(f"Submit quiz request for pk: {pk}, user: {request.user}")
        print(f"Request data: {request.data}")
        
        try:
            quiz = get_object_or_404(Quiz, pk=pk, user=request.user)
        except:
            print("Quiz not found or user doesn't own it")
            return Response({'error': 'Quiz not found'}, status=404)
            
        serializer = SubmitQuizSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print("Serializer is valid")

        answers_data = serializer.validated_data['answers']
        score = 0
        total = quiz.questions.count()

        with transaction.atomic():
            attempt = QuizAttempt.objects.create(
                user=request.user,
                quiz=quiz,
                score=0,
                total_questions=total
            )

            for answer_data in answers_data:
                question_id = answer_data['question_id']
                answer_id = answer_data['answer_id']

                question = get_object_or_404(Question, id=question_id, quiz=quiz)
                selected = get_object_or_404(Answer, id=answer_id, question=question)

                is_correct = selected.is_correct
                if is_correct:
                    score += 1

                UserAnswer.objects.create(
                    attempt=attempt,
                    question=question,
                    selected_answer=selected,
                    is_correct=is_correct
                )

            attempt.score = score
            attempt.save()

        return Response({
            'attempt_id': attempt.id,
            'score': score,
            'total': total,
            'percentage': round((score / total) * 100, 1) if total > 0 else 0
        })


class QuizReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        quiz = get_object_or_404(Quiz, pk=pk, user=request.user)
        return Response(QuizWithAnswersSerializer(quiz).data)


class AttemptListView(generics.ListAPIView):
    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user)


class AttemptDetailView(generics.RetrieveAPIView):
    serializer_class = QuizAttemptDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user)
