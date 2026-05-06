from django.contrib import admin
from .models import Quiz, Question, Answer, QuizAttempt, UserAnswer


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 4
    max_num = 4


class QuestionInline(admin.StackedInline):
    model = Question
    extra = 0
    inlines = [AnswerInline]


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'topic', 'difficulty', 'num_questions', 'created_at']
    list_filter = ['difficulty', 'created_at']
    search_fields = ['title', 'topic', 'user__username']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['quiz', 'order', 'text_preview']
    list_filter = ['quiz']
    inlines = [AnswerInline]

    def text_preview(self, obj):
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Text'


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['question', 'text_preview', 'is_correct', 'order']
    list_filter = ['is_correct']

    def text_preview(self, obj):
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Text'


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'quiz', 'score', 'total_questions', 'completed_at']
    list_filter = ['completed_at']
    search_fields = ['user__username', 'quiz__title']


@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ['attempt', 'question', 'selected_answer', 'is_correct']
    list_filter = ['is_correct']
