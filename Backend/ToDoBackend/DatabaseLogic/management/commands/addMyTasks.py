from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Add all my tasks from Firebase and save them to the database."

    def handle(self, *args, **kwargs):
