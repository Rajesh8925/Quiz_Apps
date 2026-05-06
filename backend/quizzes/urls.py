from django.urls import path
from .views import (
    GenerateQuizView, QuizListView, QuizDetailView,
    SubmitQuizView, QuizReviewView,
    AttemptListView, AttemptDetailView
)

urlpatterns = [
    path('generate/', GenerateQuizView.as_view(), name='generate-quiz'),
    path('', QuizListView.as_view(), name='quiz-list'),
    path('<uuid:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('<uuid:pk>/submit/', SubmitQuizView.as_view(), name='submit-quiz'),
    path('<uuid:pk>/review/', QuizReviewView.as_view(), name='quiz-review'),
    path('attempts/', AttemptListView.as_view(), name='attempt-list'),
    path('attempts/<uuid:pk>/', AttemptDetailView.as_view(), name='attempt-detail'),
]
