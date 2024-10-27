from django.urls import path
from .views import ImageUploadView
from .views import FileListView

from .views import submit_report, submit_report_pdf

urlpatterns = [
    path('upload/', ImageUploadView.as_view(), name='image-upload'),
    path('files/', FileListView.as_view(), name='file-list'),

    path('submit-report/', submit_report, name='submit_report'),
    path('submit-report-pdf/', submit_report_pdf, name='submit_report_pdf')


]
