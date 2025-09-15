from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from DatabaseLogic.models import Tasks
import os 
import json

class Command(BaseCommand):
    help = "Add all tasks from a local JSON file and save them to the database under a specific user."

    def handle(self, *args, **options):
        username = "Armaan"
        file_path = r"C:\Users\khait\Downloads\fancy-toDoListForpersonaluse\Backend\ToDoBackend\DatabaseLogic\management\commands\data.txt"

        User = get_user_model()

        # get or fail
        try:
            user,_ = User.objects.get_or_create(username=username)
        except Exception as e:
            raise CommandError(f"Error fetching/creating user: {e}")

        # check file
        if not os.path.exists(file_path):
            raise CommandError(f"File '{file_path}' does not exist.")

        # read tasks
        with open(file_path, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                raise CommandError("File is not valid JSON.")

        if not isinstance(data, list):
            raise CommandError("JSON must be a list of task objects.")
        # create tasks
        created_count = 0
        for task in data:
            Tasks.objects.update_or_create(
                user=user,
                name=task.get("name",""),
                defaults={
                    "myDay":task.get("myDay",False),
                    "isStarred":task.get("isStarred",False),
                    "isChecked":task.get("isChecked",False)
                }
                
            )
            created_count += 1
            print(f"Added task {task.get('name','')}")

        print(f"Successfully added {created_count} tasks for user '{username}'.")