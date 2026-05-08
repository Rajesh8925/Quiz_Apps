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
    QuizSerializer,
    QuizDetailSerializer,
    CreateQuizSerializer,
    SubmitQuizSerializer,
    QuizAttemptSerializer,
    QuizAttemptDetailSerializer,
    QuizWithAnswersSerializer,
)


class GeminiAIClient:
    API_KEY = os.getenv("GEMINI_API_KEY")
    API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"


class OpenAIClient:
    API_KEY = os.getenv("OPENAI_API_KEY")
    API_URL = "https://api.openai.com/v1/chat/completions"


class OpenRouterClient:
    API_KEY = os.getenv("OPENROUTER_API_KEY")
    API_URL = "https://openrouter.ai/api/v1/chat/completions"

    @classmethod
    def generate_quiz(cls, topic, num_questions, difficulty):
        if not cls.API_KEY:
            raise Exception("OpenRouter API key not configured")

        prompt = f"""
Generate a {difficulty} difficulty quiz about "{topic}" with exactly {num_questions} multiple-choice questions.

For each question:
- Create a meaningful question about {topic}
- Provide 4 real options where one is clearly correct
- Make options topic-specific and educational
- Ensure the correct answer is factually accurate

Return ONLY valid JSON in this exact format:
{{
  "title": "Quiz Title",
  "questions": [
    {{
      "text": "Actual question about {topic}",
      "options": ["Correct answer", "Wrong answer 1", "Wrong answer 2", "Wrong answer 3"],
      "correct": 0
    }}
  ]
}}

Rules:
- correct must be index number 0, 1, 2, or 3 (pointing to the correct answer)
- each question must have exactly 4 real options
- one option must be clearly correct and factually accurate
- no explanation
- no markdown
- do not use placeholder text like "Option A", "Option B"
"""

        try:
            response = requests.post(
                f"{cls.API_URL}?key={cls.API_KEY}",
                json={
                    "contents": [
                        {
                            "parts": [
                                {
                                    "text": prompt
                                }
                            ]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.7,
                        "maxOutputTokens": 1500,
                    },
                },
                timeout=60,
            )

            response.raise_for_status()
            data = response.json()

            text_response = data["candidates"][0]["content"]["parts"][0]["text"]

            if "```json" in text_response:
                text_response = text_response.split("```json")[1].split("```")[0].strip()
            elif "```" in text_response:
                text_response = text_response.split("```")[1].split("```")[0].strip()

            return json.loads(text_response)

        # except requests.exceptions.RequestException:
        #     # Fallback quiz if Gemini quota/API fails
        #     return {
        #         "title": f"{topic} Quiz",
        #         "questions": [
        #             {
        #                 "text": f"Sample question {i + 1} about {topic}?",
        #                 "options": ["Option A", "Option B", "Option C", "Option D"],
        #                 "correct": 0,
        #             }
        #             for i in range(num_questions)
        #         ],
        #     }

        except (json.JSONDecodeError, KeyError, IndexError) as e:
            raise Exception(f"Failed to parse AI response: {str(e)}")

    @classmethod
    def generate_quiz_openai(cls, topic, num_questions, difficulty):
        if not cls.API_KEY:
            raise Exception("OpenAI API key not configured")

        prompt = f"""Generate a {difficulty} difficulty quiz about "{topic}" with exactly {num_questions} multiple-choice questions.

For each question:
- Create a meaningful question about {topic}
- Provide 4 real options where one is clearly correct
- Make options topic-specific and educational
- Ensure the correct answer is factually accurate

Return ONLY valid JSON in this exact format:
{{
  "title": "Quiz Title",
  "questions": [
    {{
      "text": "Actual question about {topic}",
      "options": ["Correct answer", "Wrong answer 1", "Wrong answer 2", "Wrong answer 3"],
      "correct": 0
    }}
  ]
}}

Rules:
- correct must be index number 0, 1, 2, or 3 (pointing to the correct answer)
- each question must have exactly 4 real options
- one option must be clearly correct and factually accurate
- no explanation
- no markdown
- do not use placeholder text like "Option A", "Option B"
"""

        try:
            response = requests.post(
                f"{cls.API_URL}",
                headers={
                    "Authorization": f"Bearer {cls.API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": "You are a helpful quiz generator."},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 1500,
                    "temperature": 0.7,
                },
                timeout=60,
            )

            response.raise_for_status()
            data = response.json()
            text_response = data["choices"][0]["message"]["content"]

            if "```json" in text_response:
                text_response = text_response.split("```json")[1].split("```")[0].strip()
            elif "```" in text_response:
                text_response = text_response.split("```")[1].split("```")[0].strip()

            return json.loads(text_response)

        except requests.exceptions.RequestException:
            # Fallback quiz if OpenAI quota/API fails
            return {
                "title": f"{topic} Quiz",
                "questions": [
                    {
                        "text": f"Sample question {i + 1} about {topic}?",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "correct": 0,
                    }
                    for i in range(num_questions)
                ],
            }

        except (json.JSONDecodeError, KeyError, IndexError) as e:
            raise Exception(f"Failed to parse OpenAI response: {str(e)}")

    @classmethod
    def generate_quiz_openrouter(cls, topic, num_questions, difficulty):
        if not cls.API_KEY:
            raise Exception("OpenRouter API key not configured")

        prompt = f"""Generate a {difficulty} difficulty quiz about "{topic}" with exactly {num_questions} multiple-choice questions.

For each question:
- Create a meaningful question about {topic}
- Provide 4 real options where one is clearly correct
- Make options topic-specific and educational
- Ensure the correct answer is factually accurate

Return ONLY valid JSON in this exact format:
{{
  "title": "Quiz Title",
  "questions": [
    {{
      "text": "Actual question about {topic}",
      "options": ["Correct answer", "Wrong answer 1", "Wrong answer 2", "Wrong answer 3"],
      "correct": 0
    }}
  ]
}}

Rules:
- correct must be index number 0, 1, 2, or 3 (pointing to the correct answer)
- each question must have exactly 4 real options
- one option must be clearly correct and factually accurate
- no explanation
- no markdown
- do not use placeholder text like "Option A", "Option B"
"""

        try:
            response = requests.post(
                f"{cls.API_URL}",
                headers={
                    "Authorization": f"Bearer {cls.API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "openai/gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": "You are a helpful quiz generator."},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 1500,
                    "temperature": 0.7,
                },
                timeout=60,
            )

            response.raise_for_status()
            data = response.json()
            text_response = data["choices"][0]["message"]["content"]

            if "```json" in text_response:
                text_response = text_response.split("```json")[1].split("```")[0].strip()
            elif "```" in text_response:
                text_response = text_response.split("```")[1].split("```")[0].strip()

            return json.loads(text_response)

        except requests.exceptions.RequestException:
            # Fallback quiz if OpenRouter quota/API fails
            return {
                "title": f"{topic} Quiz",
                "questions": [
                    {
                        "text": f"Sample question {i + 1} about {topic}?",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "correct": 0,
                    }
                    for i in range(num_questions)
                ],
            }

        except (json.JSONDecodeError, KeyError, IndexError) as e:
            raise Exception(f"Failed to parse OpenRouter response: {str(e)}")


class GenerateQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateQuizSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        topic = serializer.validated_data["topic"]
        num_questions = serializer.validated_data["num_questions"]
        difficulty = serializer.validated_data["difficulty"]

        print(f"Quiz generation request: topic={topic}, num_questions={num_questions}, difficulty={difficulty}")
        print(f"User: {request.user.username if request.user else 'Anonymous'}")

        try:
            ai_quiz_data = GeminiAIClient.generate_quiz(
                topic,
                num_questions,
                difficulty
            )
        except Exception as e:
            print(f"Gemini API failed: {str(e)}")
            print("Trying OpenAI as fallback...")
            try:
                ai_quiz_data = OpenAIClient.generate_quiz(
                    topic,
                    num_questions,
                    difficulty
                )
                print("OpenAI generation successful!")
            except Exception as openai_error:
                print(f"OpenAI also failed: {str(openai_error)}")
                print("Trying OpenRouter as final fallback...")
                try:
                    ai_quiz_data = OpenRouterClient.generate_quiz_openrouter(
                        topic,
                        num_questions,
                        difficulty
                    )
                    print("OpenRouter generation successful!")
                except Exception as openrouter_error:
                    print(f"OpenRouter also failed: {str(openrouter_error)}")
                    raise Exception("All AI services are currently unavailable. Please try again later.")

            print("AI generation successful, saving quiz to database...")
            with transaction.atomic():
                quiz = Quiz.objects.create(
                    user=request.user,
                    title=ai_quiz_data["title"],
                    topic=topic,
                    difficulty=difficulty,
                    num_questions=num_questions,
                )
                print(f"Quiz created with ID: {quiz.id}")

                for i, q_data in enumerate(ai_quiz_data["questions"]):
                    question = Question.objects.create(
                        quiz=quiz,
                        text=q_data["text"],
                        order=i + 1,
                    )

                    for j, option_text in enumerate(q_data["options"]):
                        Answer.objects.create(
                            question=question,
                            text=option_text,
                            is_correct=(j == q_data["correct"]),
                            order=j + 1,
                        )

            response_data = QuizSerializer(quiz).data
            print(f"Returning response data for quiz {quiz.id}")
            return Response(
                response_data,
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
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
    lookup_field = "pk"

    def get_queryset(self):
        return Quiz.objects.filter(user=self.request.user)


class SubmitQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        quiz = get_object_or_404(Quiz, pk=pk, user=request.user)

        serializer = SubmitQuizSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        answers_data = serializer.validated_data["answers"]
        score = 0
        total = quiz.questions.count()

        with transaction.atomic():
            attempt = QuizAttempt.objects.create(
                user=request.user,
                quiz=quiz,
                score=0,
                total_questions=total,
            )

            for answer_data in answers_data:
                question_id = answer_data["question_id"]
                answer_id = answer_data["answer_id"]

                question = get_object_or_404(
                    Question,
                    id=question_id,
                    quiz=quiz
                )

                selected = get_object_or_404(
                    Answer,
                    id=answer_id,
                    question=question
                )

                is_correct = selected.is_correct

                if is_correct:
                    score += 1

                UserAnswer.objects.create(
                    attempt=attempt,
                    question=question,
                    selected_answer=selected,
                    is_correct=is_correct,
                )

            attempt.score = score
            attempt.save()

        return Response({
            "attempt_id": attempt.id,
            "score": score,
            "total": total,
            "percentage": round((score / total) * 100, 1) if total > 0 else 0,
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
        return QuizAttempt.objects.filter(user=self.request.user).order_by("-completed_at")


class AttemptDetailView(generics.RetrieveAPIView):
    serializer_class = QuizAttemptDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user)